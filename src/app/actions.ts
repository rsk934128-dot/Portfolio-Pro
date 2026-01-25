"use server";

import { personalizePortfolio, type PersonalizePortfolioInput, type PersonalizePortfolioOutput } from "@/ai/flows/ai-powered-personalization";

export async function getPersonalizationSuggestions(
  input: PersonalizePortfolioInput
): Promise<PersonalizePortfolioOutput> {
  try {
    const result = await personalizePortfolio(input);
    return result;
  } catch (error) {
    console.error("Error in AI personalization flow:", error);
    // Return a structured error or re-throw
    throw new Error("Failed to get personalization suggestions.");
  }
}
