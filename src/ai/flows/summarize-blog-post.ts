'use server';

/**
 * @fileOverview An AI tool to generate summaries and SEO-friendly content for blog posts.
 *
 * - getBlogSuggestions - A function that handles the blog post analysis.
 * - BlogSuggestionsInput - The input type for the getBlogSuggestions function.
 * - BlogSuggestionsOutput - The return type for the getBlogSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BlogSuggestionsInputSchema = z.object({
  content: z.string().describe("The full content of the blog post."),
});
export type BlogSuggestionsInput = z.infer<typeof BlogSuggestionsInputSchema>;

const BlogSuggestionsOutputSchema = z.object({
  summary: z.string().describe("A short, engaging summary of the blog post, suitable for a blog listing page (around 2-3 sentences)."),
  seoTitle: z.string().describe("A concise and SEO-friendly title for the blog post (under 60 characters)."),
  metaDescription: z.string().describe("A compelling meta description for search engine results (under 160 characters)."),
  tags: z.array(z.string()).describe("A list of 3-5 relevant tags or keywords for the blog post."),
});
export type BlogSuggestionsOutput = z.infer<typeof BlogSuggestionsOutputSchema>;

export async function getBlogSuggestions(input: BlogSuggestionsInput): Promise<BlogSuggestionsOutput> {
  return blogSummarizerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'blogSummarizerPrompt',
  input: {schema: BlogSuggestionsInputSchema},
  output: {schema: BlogSuggestionsOutputSchema},
  prompt: `You are an expert content strategist and SEO specialist.

Analyze the following blog post content and generate the following:
1.  A short, engaging summary (2-3 sentences).
2.  A concise, SEO-friendly title (under 60 characters).
3.  A compelling meta description for search engines (under 160 characters).
4.  A list of 3-5 relevant tags or keywords for the blog post.

Blog Post Content:
{{{content}}}

Provide the output in the required JSON format.`,
});

const blogSummarizerFlow = ai.defineFlow(
  {
    name: 'blogSummarizerFlow',
    inputSchema: BlogSuggestionsInputSchema,
    outputSchema: BlogSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
