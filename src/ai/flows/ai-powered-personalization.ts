'use server';

/**
 * @fileOverview An AI-powered personalization tool that suggests textual and visual customizations to a portfolio based on keywords or phrases about personal brand.
 *
 * - personalizePortfolio - A function that handles the portfolio personalization process.
 * - PersonalizePortfolioInput - The input type for the personalizePortfolio function.
 * - PersonalizePortfolioOutput - The return type for the personalizePortfolio function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizePortfolioInputSchema = z.object({
  brandKeywords: z
    .string()
    .describe("Keywords or phrases describing the desired personal brand image."),
  currentBio: z.string().optional().describe("The user's current bio."),
  currentSkills: z.string().optional().describe("The user's current skills."),
});
export type PersonalizePortfolioInput = z.infer<typeof PersonalizePortfolioInputSchema>;

const PersonalizePortfolioOutputSchema = z.object({
  suggestedBio: z.string().describe("AI-suggested bio customization."),
  suggestedSkills: z.string().describe("AI-suggested skills customization."),
  suggestedVisuals: z.string().describe("AI-suggested visual customizations."),
});
export type PersonalizePortfolioOutput = z.infer<typeof PersonalizePortfolioOutputSchema>;

export async function personalizePortfolio(input: PersonalizePortfolioInput): Promise<PersonalizePortfolioOutput> {
  return personalizePortfolioFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizePortfolioPrompt',
  input: {schema: PersonalizePortfolioInputSchema},
  output: {schema: PersonalizePortfolioOutputSchema},
  prompt: `You are an AI-powered portfolio personalization expert.

You will receive keywords describing the desired personal brand image, current bio, and current skills.

You will provide suggestions for bio customization, skills customization, and visual customizations to effectively convey the desired personal brand image.

Desired Personal Brand Keywords: {{{brandKeywords}}}
Current Bio: {{{currentBio}}}
Current Skills: {{{currentSkills}}}


Output your suggestion for each of the following:

Suggested Bio Customization:

Suggested Skills Customization:

Suggested Visual Customizations: `,
});

const personalizePortfolioFlow = ai.defineFlow(
  {
    name: 'personalizePortfolioFlow',
    inputSchema: PersonalizePortfolioInputSchema,
    outputSchema: PersonalizePortfolioOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
