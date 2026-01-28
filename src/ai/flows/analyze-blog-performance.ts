'use server';

/**
 * @fileOverview An AI tool to analyze blog post performance and suggest content strategy.
 *
 * - getBlogPerformanceAnalysis - A function that handles the performance analysis.
 * - BlogPerformanceAnalysisInput - The input type for the function.
 * - BlogPerformanceAnalysisOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BlogPostPerformanceSchema = z.object({
    title: z.string(),
    publicationDate: z.string(),
    viewCount: z.number().optional().default(0),
    tags: z.array(z.string()).optional(),
});

const BlogPerformanceAnalysisInputSchema = z.object({
  posts: z.array(BlogPostPerformanceSchema),
});
export type BlogPerformanceAnalysisInput = z.infer<typeof BlogPerformanceAnalysisInputSchema>;

const BlogPerformanceAnalysisOutputSchema = z.object({
  performanceSummary: z.string().describe("A high-level summary of the overall blog performance."),
  topPerformingPosts: z.array(z.string()).describe("A list of the titles of the top 3-5 performing posts based on views and recency."),
  contentStrategySuggestions: z.string().describe("Actionable suggestions for future content strategy based on what's working well (popular topics, formats, etc.)."),
});
export type BlogPerformanceAnalysisOutput = z.infer<typeof BlogPerformanceAnalysisOutputSchema>;

export async function getBlogPerformanceAnalysis(input: BlogPerformanceAnalysisInput): Promise<BlogPerformanceAnalysisOutput> {
  return blogPerformanceAnalyzerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'blogPerformanceAnalyzerPrompt',
  input: {schema: BlogPerformanceAnalysisInputSchema},
  output: {schema: BlogPerformanceAnalysisOutputSchema},
  prompt: `You are a data analyst and content strategist for a tech professional's blog.

Analyze the following list of blog posts, including their titles, publication dates, view counts, and tags.

Based on this data, provide:
1.  A concise summary of the overall blog performance.
2.  A list of the top 3-5 performing posts. Consider both view counts and how recent the posts are.
3.  Actionable content strategy suggestions. What topics are popular? What should they write about next? What tags are most effective?

**Blog Post Data:**
{{#each posts}}
- **Title:** {{{title}}}
  - **Publication Date:** {{{publicationDate}}}
  - **View Count:** {{{viewCount}}}
  - **Tags:** {{#each tags}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
{{/each}}

Provide the output in the required JSON format.`,
});

const blogPerformanceAnalyzerFlow = ai.defineFlow(
  {
    name: 'blogPerformanceAnalyzerFlow',
    inputSchema: BlogPerformanceAnalysisInputSchema,
    outputSchema: BlogPerformanceAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
