'use server';

/**
 * @fileOverview An AI tool to suggest new blog post topics based on a user's brand and skills.
 *
 * - getTopicSuggestions - A function that handles topic suggestion generation.
 * - TopicSuggestionsInput - The input type for the getTopicSuggestions function.
 * - TopicSuggestionsOutput - The return type for the getTopicSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TopicSuggestionsInputSchema = z.object({
  brandKeywords: z.string().describe("Keywords or phrases describing the user's personal brand."),
  currentSkills: z.string().describe("A comma-separated list of the user's current technical skills."),
  existingPostTitles: z.array(z.string()).optional().describe("A list of titles of existing blog posts to avoid suggesting similar topics."),
});
export type TopicSuggestionsInput = z.infer<typeof TopicSuggestionsInputSchema>;

const SuggestedTopicSchema = z.object({
    title: z.string().describe("The suggested blog post title."),
    description: z.string().describe("A brief (1-2 sentence) description of what the post could cover."),
});

const TopicSuggestionsOutputSchema = z.object({
    topics: z.array(SuggestedTopicSchema).describe("A list of 5 new blog post topic ideas."),
});
export type TopicSuggestionsOutput = z.infer<typeof TopicSuggestionsOutputSchema>;

export async function getTopicSuggestions(input: TopicSuggestionsInput): Promise<TopicSuggestionsOutput> {
  return topicSuggestorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'topicSuggestorPrompt',
  input: {schema: TopicSuggestionsInputSchema},
  output: {schema: TopicSuggestionsOutputSchema},
  prompt: `You are an expert content strategist for a tech professional.

Your goal is to generate 5 fresh and engaging blog post ideas based on the user's personal brand, their skills, and their existing blog posts. The topics should highlight their expertise and be interesting to a technical audience (developers, hiring managers, etc.).

Do not suggest topics that are too similar to the existing post titles.

**User's Personal Brand Keywords:**
{{{brandKeywords}}}

**User's Skills:**
{{{currentSkills}}}

{{#if existingPostTitles}}
**Existing Blog Post Titles (avoid these):**
{{#each existingPostTitles}}
- {{{this}}}
{{/each}}
{{/if}}

Please provide 5 topic suggestions in the required JSON format. For each topic, provide a compelling title and a brief description.`,
});

const topicSuggestorFlow = ai.defineFlow(
  {
    name: 'topicSuggestorFlow',
    inputSchema: TopicSuggestionsInputSchema,
    outputSchema: TopicSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
