"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Sparkles, PencilRuler } from "lucide-react";

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

const formSchema = z.object({
  content: z
    .string()
    .min(50, "Please provide at least 50 characters of content.")
});

type FormValues = z.infer<typeof formSchema>;

export function BlogAssistant() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [suggestions, setSuggestions] = useState<BlogSuggestionsOutput | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      try {
        const result = await getBlogSuggestions({
          content: values.content,
        });
        setSuggestions(result);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "An error occurred",
          description: "Failed to get AI suggestions. Please try again.",
        });
      }
    });
  };

  return (
    <Sheet>
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
              Paste your blog post content below to get an SEO-friendly title, meta description, and a short summary.
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
                  {isPending ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Generate Suggestions"
                  )}
                </Button>
              </form>
            </Form>
          </div>

          {isPending && (
             <div className="space-y-4 pt-6">
                <p className="text-center text-muted-foreground flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin h-4 w-4"/>
                    Generating AI suggestions... this may take a moment.
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
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
