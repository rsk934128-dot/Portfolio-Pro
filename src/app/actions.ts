"use server";

import { personalizePortfolio, type PersonalizePortfolioInput, type PersonalizePortfolioOutput } from "@/ai/flows/ai-powered-personalization";
import { getBlogSuggestions as getBlogSuggestionsFlow, type BlogSuggestionsInput, type BlogSuggestionsOutput } from "@/ai/flows/summarize-blog-post";
import { getTopicSuggestions as getTopicSuggestionsFlow, type TopicSuggestionsInput, type TopicSuggestionsOutput } from "@/ai/flows/suggest-blog-topics";
import { getBlogPerformanceAnalysis as getBlogPerformanceAnalysisFlow, type BlogPerformanceAnalysisInput, type BlogPerformanceAnalysisOutput } from "@/ai/flows/analyze-blog-performance";
import { getChatbotResponse as getChatbotResponseFlow, type ChatbotInput, type ChatbotOutput } from "@/ai/flows/portfolio-chatbot";


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

export async function getBlogSuggestions(
  input: BlogSuggestionsInput
): Promise<BlogSuggestionsOutput> {
  try {
    const result = await getBlogSuggestionsFlow(input);
    return result;
  } catch (error)
  {
    console.error("Error in AI blog suggestion flow:", error);
    throw new Error("Failed to get blog suggestions.");
  }
}

export async function getTopicSuggestions(
    input: TopicSuggestionsInput
): Promise<TopicSuggestionsOutput> {
    try {
        const result = await getTopicSuggestionsFlow(input);
        return result;
    } catch (error) {
        console.error("Error in AI topic suggestion flow:", error);
        throw new Error("Failed to get topic suggestions.");
    }
}

export async function getBlogPerformanceAnalysis(
    input: BlogPerformanceAnalysisInput
): Promise<BlogPerformanceAnalysisOutput> {
    try {
        const result = await getBlogPerformanceAnalysisFlow(input);
        return result;
    } catch (error) {
        console.error("Error in AI blog performance analysis flow:", error);
        throw new Error("Failed to get blog performance analysis.");
    }
}

export async function getChatbotResponse(
    input: ChatbotInput
): Promise<ChatbotOutput> {
    try {
        const result = await getChatbotResponseFlow(input);
        return result;
    } catch (error) {
        console.error("Error in AI chatbot flow:", error);
        throw new Error("Failed to get chatbot response.");
    }
}
