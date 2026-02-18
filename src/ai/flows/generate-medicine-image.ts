'use server';
/**
 * @fileOverview A flow to generate a relevant image for a medicine.
 *
 * - generateMedicineImage - A function that generates an image for a given medicine name.
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
    .describe('A data URI for a relevant image of the medicine.'),
  imageHint: z.string().describe('The search term used for the image.').optional(),
});
export type GenerateMedicineImageOutput = z.infer<
  typeof GenerateMedicineImageOutputSchema
>;

export async function generateMedicineImage(
  input: GenerateMedicineImageInput
): Promise<GenerateMedicineImageOutput> {
  return generateMedicineImageFlow(input);
}

// A prompt to get a good image generation prompt from the medicine name
const generateImagePrompt = ai.definePrompt({
  name: 'generateMedicineImagePrompt',
  model: devstralModel,
  input: { schema: GenerateMedicineImageInputSchema },
  output: {
    schema: z.object({
      imagePrompt: z
        .string()
        .describe(
          'A descriptive prompt for an image generation model to create a stock photo of the medicine.'
        ),
      imageHint: z.string().describe('A 1-2 word hint for the image content.'),
    }),
  },
  prompt: `Generate a descriptive prompt and a 1-2 word hint for an image generation model to create a professional, clean stock photo representing '{{{medicineName}}}' on a plain white background.
    Focus on a generic, high-quality product shot.
    Examples:
    - "Paracetamol 500mg" -> { "imagePrompt": "A professional product shot of white pills, scattered on a clean white background.", "imageHint": "white pills" }
    - "Sirop de tuse" -> { "imagePrompt": "A professional product shot of a generic cough syrup bottle with a blank label, on a clean white background.", "imageHint": "syrup bottle" }
    - "Cremă antiseptică" -> { "imagePrompt": "A professional product shot of a white tube of antiseptic cream with a blank label, on a clean white background.", "imageHint": "cream tube" }
    - "Vitamina C 1000mg" -> { "imagePrompt": "A professional product shot of orange vitamin C tablets, on a clean white background.", "imageHint": "orange tablets" }
    `,
});

const generateMedicineImageFlow = ai.defineFlow(
  {
    name: 'generateMedicineImageFlow',
    inputSchema: GenerateMedicineImageInputSchema,
    outputSchema: GenerateMedicineImageOutputSchema,
  },
  async (input) => {
    try {
      // 1. Generate a descriptive prompt for the image model
      const { output } = await generateImagePrompt(input);
      if (!output?.imagePrompt) {
        throw new Error('Failed to generate image prompt.');
      }

      // 2. Generate the image using the descriptive prompt
      const { media } = await ai.generate({
        model: 'googleai/imagen-4.0-fast-generate-001',
        prompt: output.imagePrompt,
      });

      if (!media?.url) {
        throw new Error('Image generation failed to return a data URI.');
      }

      return { imageDataUri: media.url, imageHint: output.imageHint };
    } catch (error) {
      console.error(
        'Image generation process failed, falling back to picsum.',
        error
      );
      // Fallback to picsum on error
      const fallbackUrl = `https://picsum.photos/seed/${encodeURIComponent(
        input.medicineName
      )}/400/300`;
      return { imageDataUri: fallbackUrl, imageHint: 'placeholder' };
    }
  }
);
