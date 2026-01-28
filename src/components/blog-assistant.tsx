"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Sparkles, PencilRuler, Save } from "lucide-react";
import { collection } from "firebase/firestore";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getBlogSuggestions } from "@/app/actions";
import type { BlogSuggestionsOutput } from "@/ai/flows/summarize-blog-post";
import { Separator } from "./ui/separator";
import { useFirestore } from "@/firebase";
import { portfolioOwnerId } from "@/lib/config";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";


const formSchema = z.object({
  content: z
    .string()
    .min(50, "Please provide at least 50 characters of content.")
});

type FormValues = z.infer<typeof formSchema>;

export function BlogAssistant() {
  const [isGenerating, startGenerationTransition] = useTransition();
  const [isSaving, startSavingTransition] = useTransition();
  const { toast } = useToast();
  const [suggestions, setSuggestions] = useState<BlogSuggestionsOutput | null>(null);
  const [originalContent, setOriginalContent] = useState<string>('');
  const firestore = useFirestore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

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
            tags: ["AI-Generated"], // Default tag for now
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

  const isPending = isGenerating || isSaving;

  return (
    <Sheet onOpenChange={(open) => { if (!open) { setSuggestions(null); setOriginalContent(''); form.reset(); }}}>
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
              Paste your blog post content below to get an SEO-friendly title, meta description, and a short summary. Then, save it as a new post.
            </SheetDescription>
          </SheetHeader>
          <div className="py-6">
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
                        The more content you provide, the better the suggestions will be.
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
          </div>

          {isGenerating && (
             <div className="space-y-4 pt-6">
                <p className="text-center text-muted-foreground flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin h-4 w-4"/>
                    Analyzing your content... this may take a moment.
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
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
