'use server';

/**
 * @fileOverview An AI-powered chatbot that answers questions about Muskan Akram's portfolio.
 *
 * - getChatbotResponse - A function that handles the chatbot conversation.
 * - ChatbotInput - The input type for the getChatbotResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the structure for a single chat message
const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

// Define the input for the chatbot flow
const ChatbotInputSchema = z.object({
  messages: z.array(ChatMessageSchema).describe("The history of the conversation so far."),
  portfolioContext: z.string().describe("A JSON string containing all of Muskan Akram's portfolio data."),
});
export type ChatbotInput = z.infer<typeof ChatbotInputSchema>;

export async function getChatbotResponse(input: ChatbotInput): Promise<string> {
  const response = await portfolioChatFlow(input);
  return response;
}

const prompt = ai.definePrompt({
  name: 'portfolioChatPrompt',
  input: {schema: ChatbotInputSchema},
  prompt: `You are a friendly and helpful AI assistant for Muskan Akram's professional portfolio website. Your name is "Portfolio Pro".
Your goal is to answer questions from visitors based ONLY on the portfolio data provided in the context. Do not make up any information. If a question cannot be answered with the given context, politely state that you don't have that information and suggest the user get in touch with Muskan via the contact form.

Keep your answers concise and conversational.

## Portfolio Context (JSON Data):
\'\'\'json
{{{portfolioContext}}}
\'\'\'

## Conversation History:
{{#each messages}}
- **{{role}}**: {{{content}}}
{{/each}}

Based on the context and history, provide a helpful response to the last user message.
`,
});

const portfolioChatFlow = ai.defineFlow(
  {
    name: 'portfolioChatFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    const response = await prompt(input);
    return response.text;
  }
);
