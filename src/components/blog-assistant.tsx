"use client";

import { useState, useTransition, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Sparkles, PencilRuler, Save, Lightbulb, ClipboardCopy, BarChart } from "lucide-react";
import { collection } from "firebase/firestore";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getBlogSuggestions, getTopicSuggestions, getBlogPerformanceAnalysis } from "@/app/actions";
import type { BlogSuggestionsOutput } from "@/ai/flows/summarize-blog-post";
import type { TopicSuggestionsOutput } from "@/ai/flows/suggest-blog-topics";
import type { BlogPerformanceAnalysisOutput } from "@/ai/flows/analyze-blog-performance";
import { Separator } from "./ui/separator";
import { useFirestore } from "@/firebase";
import { portfolioOwnerId } from "@/lib/config";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { Badge } from "./ui/badge";


const formSchema = z.object({
  content: z
    .string()
    .min(50, "Please provide at least 50 characters of content.")
});

type FormValues = z.infer<typeof formSchema>;

export function BlogAssistant({ profile, skills, blogPosts }: { profile: any, skills: any[] | null, blogPosts: any[] | null }) {
  const [isGenerating, startGenerationTransition] = useTransition();
  const [isSaving, startSavingTransition] = useTransition();
  const [isGeneratingTopics, startTopicGenerationTransition] = useTransition();
  const [isAnalyzing, startAnalysisTransition] = useTransition();


  const { toast } = useToast();
  const [suggestions, setSuggestions] = useState<BlogSuggestionsOutput | null>(null);
  const [topicSuggestions, setTopicSuggestions] = useState<TopicSuggestionsOutput | null>(null);
  const [analysis, setAnalysis] = useState<BlogPerformanceAnalysisOutput | null>(null);

  const [originalContent, setOriginalContent] = useState<string>('');
  const firestore = useFirestore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });
  
  const chartData = useMemo(() => {
    if (!blogPosts) return [];
    return blogPosts.map(post => ({
        name: post.title.substring(0, 20) + (post.title.length > 20 ? '...' : ''),
        views: post.viewCount || 0
    })).sort((a,b) => b.views - a.views);
  }, [blogPosts]);

  const onSubmit = (values: FormValues) => {
    startGenerationTransition(async () => {
      setSuggestions(null);
      setOriginalContent('');
      try {
        const result = await getBlogSuggestions({
          content: values.content,
        });
        setSuggestions(result);
        setOriginalContent(values.content);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "An error occurred",
          description: "Failed to get AI suggestions. Please try again.",
        });
      }
    });
  };

  const handleGenerateTopics = () => {
    if (!profile || !skills) {
        toast({
            variant: "destructive",
            title: "Data Missing",
            description: "Profile and skills data must be loaded to generate topic ideas.",
        });
        return;
    }
    startTopicGenerationTransition(async () => {
        setTopicSuggestions(null);
        try {
            const currentSkillsString = skills.map(s => s.name).join(', ');
            const existingPostTitles = blogPosts?.map(p => p.title) || [];
            
            const result = await getTopicSuggestions({
                brandKeywords: profile.title, // Using title as brand keywords
                currentSkills: currentSkillsString,
                existingPostTitles: existingPostTitles
            });
            setTopicSuggestions(result);
        } catch (error) {
            toast({
              variant: "destructive",
              title: "An error occurred",
              description: "Failed to get topic suggestions. Please try again.",
            });
        }
    })
  }

  const handleAnalyzePerformance = () => {
    if (!blogPosts || blogPosts.length === 0) {
        toast({
            variant: "destructive",
            title: "No Blog Posts",
            description: "There are no blog posts to analyze.",
        });
        return;
    }
    startAnalysisTransition(async () => {
        setAnalysis(null);
        try {
            const postsForAnalysis = blogPosts.map(p => ({
                title: p.title,
                publicationDate: p.publicationDate,
                viewCount: p.viewCount || 0,
                tags: p.tags || []
            }));

            const result = await getBlogPerformanceAnalysis({ posts: postsForAnalysis });
            setAnalysis(result);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "An error occurred",
                description: "Failed to analyze blog performance. Please try again.",
            });
        }
    });
  };


  const handleSavePost = () => {
    if (!suggestions || !originalContent || !firestore) {
        toast({
            variant: "destructive",
            title: "Cannot Save Post",
            description: "Generated suggestions or original content is missing. Please generate suggestions first.",
        });
        return;
    }

    startSavingTransition(() => {
        const blogPostsRef = collection(firestore, 'users', portfolioOwnerId, 'blogPosts');
        addDocumentNonBlocking(blogPostsRef, {
            title: suggestions.seoTitle,
            summary: suggestions.summary,
            content: originalContent,
            publicationDate: new Date().toISOString(),
            tags: suggestions.tags || [],
            viewCount: 0,
        });
        toast({
            title: "Post Saved!",
            description: `${suggestions.seoTitle} has been saved.`
        });
        // Reset state after saving
        setSuggestions(null);
        setOriginalContent("");
        form.reset();
    });
  }

  const handleCopyTitle = (title: string) => {
    navigator.clipboard.writeText(title);
    toast({
        title: "Copied to clipboard!",
        description: "You can now use this title for your new post.",
    });
  }

  const isPending = isGenerating || isSaving || isGeneratingTopics || isAnalyzing;
  
  const resetAllState = () => {
    setSuggestions(null);
    setTopicSuggestions(null);
    setAnalysis(null);
    setOriginalContent('');
    form.reset();
  }

  return (
    <Sheet onOpenChange={(open) => { if (!open) { resetAllState() }}}>
      <SheetTrigger asChild>
          <Button variant="outline">
              <PencilRuler className="mr-2" />
              Blog Assistant
          </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
        <ScrollArea className="h-full pr-6">
          <SheetHeader>
            <SheetTitle className="font-headline text-2xl flex items-center gap-2">
              <Sparkles className="text-accent" />
              AI Blog Assistant
            </SheetTitle>
            <SheetDescription>
              Use AI to write posts, get topic ideas, and analyze performance.
            </SheetDescription>
          </SheetHeader>
          <div className="py-6">
            <Tabs defaultValue="writer" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="writer">
                        <PencilRuler className="mr-2" />
                        AI Writer
                    </TabsTrigger>
                    <TabsTrigger value="ideas">
                        <Lightbulb className="mr-2" />
                        Topic Ideas
                    </TabsTrigger>
                    <TabsTrigger value="performance">
                        <BarChart className="mr-2" />
                        Performance
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="writer" className="mt-6">
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel className="text-lg">Blog Post Content</FormLabel>
                            <FormControl>
                                <Textarea
                                placeholder="Paste your full blog post content here..."
                                rows={10}
                                {...field}
                                disabled={isPending}
                                />
                            </FormControl>
                            <FormDescription>
                                The AI will generate an SEO title, summary, and tags based on your content.
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <Button type="submit" disabled={isPending} className="w-full">
                        {isGenerating ? (
                            <>
                                <Loader2 className="animate-spin mr-2" />
                                Generating...
                            </>
                        ) : (
                            "Generate Suggestions"
                        )}
                        </Button>
                    </form>
                    </Form>
                     {isGenerating && (
                        <div className="space-y-4 pt-6 text-center">
                            <p className="text-muted-foreground flex items-center justify-center gap-2">
                                <Loader2 className="animate-spin h-4 w-4"/>
                                Analyzing your content...
                            </p>
                        </div>
                    )}
                    {suggestions && (
                        <div className="pt-6 space-y-6">
                        <Separator />
                        <h3 className="font-headline text-xl text-center">AI Suggestions</h3>
                        <div className="space-y-4">
                            <Card>
                            <CardHeader>
                                <CardTitle className="font-headline text-lg">Suggested SEO Title</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{suggestions.seoTitle}</p>
                            </CardContent>
                            </Card>
                            <Card>
                            <CardHeader>
                                <CardTitle className="font-headline text-lg">Suggested Meta Description</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{suggestions.metaDescription}</p>
                            </CardContent>
                            </Card>
                            <Card>
                            <CardHeader>
                                <CardTitle className="font-headline text-lg">Suggested Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{suggestions.summary}</p>
                            </CardContent>
                            </Card>
                            <Card>
                            <CardHeader>
                                <CardTitle className="font-headline text-lg">Suggested Tags</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {suggestions.tags.map((tag) => (
                                        <Badge key={tag} variant="secondary">{tag}</Badge>
                                    ))}
                                </div>
                            </CardContent>
                            </Card>
                        </div>
                        <Button onClick={handleSavePost} disabled={isSaving} className="w-full">
                            {isSaving ? (
                                <>
                                    <Loader2 className="animate-spin mr-2" />
                                    Saving Post...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2" />
                                    Save as New Post
                                </>
                            )}
                        </Button>
                        </div>
                    )}
                </TabsContent>
                <TabsContent value="ideas" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Generate New Topic Ideas</CardTitle>
                            <CardDescription>
                                Get AI-powered suggestions for your next blog post based on your skills and personal brand.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Button onClick={handleGenerateTopics} disabled={isPending} className="w-full">
                                {isGeneratingTopics ? (
                                    <>
                                        <Loader2 className="animate-spin mr-2" />
                                        Getting Ideas...
                                    </>
                                ) : (
                                    <>
                                        <Lightbulb className="mr-2" />
                                        Suggest Topics
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>

                    {isGeneratingTopics && (
                        <div className="space-y-4 pt-6 text-center">
                            <p className="text-muted-foreground flex items-center justify-center gap-2">
                                <Loader2 className="animate-spin h-4 w-4"/>
                                Thinking of some great topics...
                            </p>
                        </div>
                    )}

                    {topicSuggestions && (
                        <div className="pt-6 space-y-6">
                            <Separator />
                            <h3 className="font-headline text-xl text-center">Topic Ideas</h3>
                             <div className="space-y-4">
                                {topicSuggestions.topics.map((topic, index) => (
                                    <Card key={index}>
                                        <CardHeader className="flex flex-row items-start justify-between">
                                            <div className="space-y-1.5">
                                                <CardTitle className="font-headline text-lg">{topic.title}</CardTitle>
                                                <CardDescription>{topic.description}</CardDescription>
                                            </div>
                                            <Button variant="ghost" size="icon" onClick={() => handleCopyTitle(topic.title)} aria-label="Copy title">
                                                <ClipboardCopy />
                                            </Button>
                                        </CardHeader>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                </TabsContent>
                <TabsContent value="performance" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Blog Performance Analysis</CardTitle>
                            <CardDescription>
                                Use AI to analyze your blog's performance and get content strategy suggestions.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button onClick={handleAnalyzePerformance} disabled={isPending} className="w-full">
                                {isAnalyzing ? (
                                    <>
                                        <Loader2 className="animate-spin mr-2" />
                                        Analyzing Performance...
                                    </>
                                ) : (
                                    <>
                                        <BarChart className="mr-2" />
                                        Analyze Performance
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>

                     {isAnalyzing && (
                        <div className="space-y-4 pt-6 text-center">
                            <p className="text-muted-foreground flex items-center justify-center gap-2">
                                <Loader2 className="animate-spin h-4 w-4"/>
                               Crunching the numbers and generating insights...
                            </p>
                        </div>
                    )}
                    
                    {analysis ? (
                         <div className="pt-6 space-y-6">
                            <Separator />
                            <h3 className="font-headline text-xl text-center">Performance Report</h3>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Views per Post</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <RechartsBarChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} interval={0} />
                                            <YAxis allowDecimals={false} />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="views" fill="hsl(var(--primary))" />
                                        </RechartsBarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                             <Card>
                                 <CardHeader>
                                     <CardTitle>AI Performance Summary</CardTitle>
                                 </CardHeader>
                                 <CardContent>
                                     <p className="text-muted-foreground">{analysis.performanceSummary}</p>
                                 </CardContent>
                             </Card>
                             <Card>
                                 <CardHeader>
                                     <CardTitle>Top Performing Posts</CardTitle>
                                 </CardHeader>
                                 <CardContent>
                                     <ul className="list-disc pl-5 text-muted-foreground space-y-2">
                                        {analysis.topPerformingPosts.map((postTitle, index) => (
                                            <li key={index}>{postTitle}</li>
                                        ))}
                                     </ul>
                                 </CardContent>
                             </Card>
                             <Card>
                                 <CardHeader>
                                     <CardTitle>AI Content Strategy Suggestions</CardTitle>
                                 </CardHeader>
                                 <CardContent>
                                     <p className="text-muted-foreground whitespace-pre-wrap">{analysis.contentStrategySuggestions}</p>
                                 </CardContent>
                             </Card>
                         </div>
                    ) : (
                        !isAnalyzing && (
                            <div className="pt-6 text-center text-muted-foreground">
                                <p>Click the button above to generate your performance report.</p>
                            </div>
                        )
                    )}

                </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
