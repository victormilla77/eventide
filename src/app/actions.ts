'use server';

import { suggestBestPhotosForLiveDisplay, SuggestBestPhotosInput, SuggestBestPhotosOutput } from '@/ai/flows/suggest-best-photos-for-live-display';

export async function getSuggestions(input: SuggestBestPhotosInput): Promise<SuggestBestPhotosOutput['suggestedMedia']> {
  try {
    const result = await suggestBestPhotosForLiveDisplay(input);
    return result.suggestedMedia;
  } catch (error) {
    console.error('AI suggestion failed:', error);
    // In a real app, you'd want more robust error handling and logging.
    // For now, we return an empty array to prevent the client from crashing.
    return [];
  }
}
