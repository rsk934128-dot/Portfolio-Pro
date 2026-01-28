"use client";

import { useState, useTransition, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Sparkles } from "lucide-react";

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
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getPersonalizationSuggestions } from "@/app/actions";
import type { PersonalizePortfolioOutput } from "@/ai/flows/ai-powered-personalization";
import { Separator } from "./ui/separator";

const formSchema = z.object({
  brandKeywords: z
    .string()
    .min(10, "Please provide at least 10 characters.")
    .max(200, "Keywords should not exceed 200 characters."),
});

type FormValues = z.infer<typeof formSchema>;

export function PersonalizationTool({ children, profile, skills }: { children: React.ReactNode, profile: any, skills: any[] | null }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [suggestions, setSuggestions] = useState<PersonalizePortfolioOutput | null>(null);

  const currentSkillsString = useMemo(() => {
    if (!skills) return "";
    return skills.map(s => s.name).join(', ');
  }, [skills]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brandKeywords: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    if (!profile || !currentSkillsString) {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Profile data is not available yet. Please wait and try again.",
      });
      return;
    }

    startTransition(async () => {
      try {
        const result = await getPersonalizationSuggestions({
          brandKeywords: values.brandKeywords,
          currentBio: profile.bio,
          currentSkills: currentSkillsString,
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
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
        <ScrollArea className="h-full pr-6">
          <SheetHeader>
            <SheetTitle className="font-headline text-2xl flex items-center gap-2">
              <Sparkles className="text-accent" />
              AI-Powered Personalization
            </SheetTitle>
            <SheetDescription>
              Describe your desired personal brand, and our AI will suggest
              customizations to your portfolio.
            </SheetDescription>
          </SheetHeader>
          <div className="py-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="brandKeywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">Personal Brand Keywords</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., 'innovative tech leader', 'creative problem-solver', 'minimalist design expert'"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter keywords or phrases describing your brand image.
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
                    <CardTitle className="font-headline text-lg">Suggested Bio</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{suggestions.suggestedBio}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="font-headline text-lg">Suggested Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{suggestions.suggestedSkills}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="font-headline text-lg">Suggested Visuals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{suggestions.suggestedVisuals}</p>
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
