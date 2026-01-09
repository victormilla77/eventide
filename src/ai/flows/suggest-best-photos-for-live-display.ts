'use server';
/**
 * @fileOverview This file defines a Genkit flow for suggesting the best photos and videos for live display.
 *
 * The flow uses AI to assess the visual quality and relevance of media items and recommends the most suitable ones for showcasing on live TV feeds at events.
 *
 * - suggestBestPhotosForLiveDisplay - An async function that takes media descriptions and returns a list of suggested media.
 * - SuggestBestPhotosInput - The input type for the suggestBestPhotosForLiveDisplay function.
 * - SuggestBestPhotosOutput - The output type for the suggestBestPhotosForLiveDisplay function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestBestPhotosInputSchema = z.object({
  mediaDescriptions: z.array(
    z.object({
      mediaUrl: z.string().describe('URL of the media file (photo or video).'),
      description: z.string().describe('A short description of the media content.'),
    })
  ).describe('An array of media descriptions to evaluate.'),
  eventDescription: z.string().describe('A description of the event.'),
});
export type SuggestBestPhotosInput = z.infer<typeof SuggestBestPhotosInputSchema>;

const SuggestBestPhotosOutputSchema = z.object({
  suggestedMedia: z.array(
    z.object({
      mediaUrl: z.string().describe('URL of the suggested media file.'),
      reason: z.string().describe('Reason for suggesting this media.'),
    })
  ).describe('An array of suggested media URLs with reasons.'),
});
export type SuggestBestPhotosOutput = z.infer<typeof SuggestBestPhotosOutputSchema>;

export async function suggestBestPhotosForLiveDisplay(input: SuggestBestPhotosInput): Promise<SuggestBestPhotosOutput> {
  return suggestBestPhotosFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestBestPhotosPrompt',
  input: {schema: SuggestBestPhotosInputSchema},
  output: {schema: SuggestBestPhotosOutputSchema},
  prompt: `You are an AI assistant that helps event organizers select the best photos and videos to display on live TV feeds during events.

You will receive a list of media descriptions, each containing a media URL and a short description of the media content. You will also receive a description of the event.

Your task is to analyze each media item and determine its suitability for live display based on visual quality, relevance to the event, and overall appeal. Provide a reason for each suggestion.

Event Description: {{{eventDescription}}}

Media Descriptions:
{{#each mediaDescriptions}}
- Media URL: {{{mediaUrl}}}, Description: {{{description}}}
{{/each}}
`,
});

const suggestBestPhotosFlow = ai.defineFlow(
  {
    name: 'suggestBestPhotosFlow',
    inputSchema: SuggestBestPhotosInputSchema,
    outputSchema: SuggestBestPhotosOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
