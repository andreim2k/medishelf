'use server';
/**
 * @fileOverview A flow to find a relevant image URL for a medicine.
 *
 * - generateMedicineImage - A function that generates an image URL for a given medicine name.
 * - GenerateMedicineImageInput - The input type for the generateMedicineImage function.
 * - GenerateMedicineImageOutput - The return type for the generateMedicineImage function.
 */

import { ai, devstralModel } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateMedicineImageInputSchema = z.object({
  medicineName: z.string().describe('The name of the medicine.'),
});
export type GenerateMedicineImageInput = z.infer<
  typeof GenerateMedicineImageInputSchema
>;

const GenerateMedicineImageOutputSchema = z.object({
  imageDataUri: z
    .string()
    .describe('A URL for a relevant image of the medicine.'),
  imageHint: z.string().describe('The search term used for the image.').optional(),
});
export type GenerateMedicineImageOutput = z.infer<
  typeof GenerateMedicineImageOutputSchema
>;

export async function generateMedicineImage(
  input: GenerateMedicineImageInput
): Promise<GenerateMedicineImageOutput> {
  return generateMedicineImageUrlFlow(input);
}

// A prompt to get a good search term from the medicine name
const generateSearchTermPrompt = ai.definePrompt({
  name: 'generateMedicineImageSearchTerm',
  model: devstralModel,
  input: { schema: GenerateMedicineImageInputSchema },
  output: {
    schema: z.object({
      searchTerm: z
        .string()
        .describe(
          'A 1-2 word search term for a stock photo of the medicine.'
        ),
    }),
  },
  prompt: `Generate a concise, 1-2 word Unsplash search term for an image representing '{{{medicineName}}}'.
    Focus on the visual representation.
    Examples:
    - "Paracetamol 500mg" -> "white pills"
    - "Sirop de tuse" -> "syrup bottle"
    - "Cremă antiseptică" -> "cream tube"
    - "Vitamina C 1000mg" -> "orange tablets"
    `,
});

const generateMedicineImageUrlFlow = ai.defineFlow(
  {
    name: 'generateMedicineImageUrlFlow',
    inputSchema: GenerateMedicineImageInputSchema,
    outputSchema: GenerateMedicineImageOutputSchema,
  },
  async (input) => {
    let imageUrl: string;
    let imageHint: string | undefined;
    try {
      const { output } = await generateSearchTermPrompt(input);
      if (output?.searchTerm) {
        imageHint = output.searchTerm;
        imageUrl = `https://source.unsplash.com/400x300/?${encodeURIComponent(
          imageHint
        )}`;
      } else {
        // Fallback to picsum if search term generation fails
        imageUrl = `https://picsum.photos/seed/${encodeURIComponent(
          input.medicineName
        )}/400/300`;
      }
    } catch (error) {
      console.error(
        'Failed to generate search term, falling back to picsum.',
        error
      );
      // Fallback to picsum on error
      imageUrl = `https://picsum.photos/seed/${encodeURIComponent(
        input.medicineName
      )}/400/300`;
    }

    return { imageDataUri: imageUrl, imageHint };
  }
);
