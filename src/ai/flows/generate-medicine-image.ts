'use server';
/**
 * @fileOverview A flow to generate an image for a medicine.
 *
 * - generateMedicineImage - A function that generates an image for a given medicine name.
 * - GenerateMedicineImageInput - The input type for the generateMedicineImage function.
 * - GenerateMedicineImageOutput - The return type for the generateMedicineImage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateMedicineImageInputSchema = z.object({
  medicineName: z.string().describe('The name of the medicine.'),
});
export type GenerateMedicineImageInput = z.infer<
  typeof GenerateMedicineImageInputSchema
>;

const GenerateMedicineImageOutputSchema = z.object({
  imageDataUri: z.string().describe('The generated image as a data URI.'),
});
export type GenerateMedicineImageOutput = z.infer<
  typeof GenerateMedicineImageOutputSchema
>;

export async function generateMedicineImage(
  input: GenerateMedicineImageInput
): Promise<GenerateMedicineImageOutput> {
  return generateMedicineImageFlow(input);
}

const generateMedicineImageFlow = ai.defineFlow(
  {
    name: 'generateMedicineImageFlow',
    inputSchema: GenerateMedicineImageInputSchema,
    outputSchema: GenerateMedicineImageOutputSchema,
  },
  async ({ medicineName }) => {
    const { media } = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: `A photorealistic, professional, clean product shot of '${medicineName}', a pharmaceutical drug. The product should be clearly visible and centered on a plain, light-colored, studio background. The image should look realistic, high-quality, and be suitable for an online pharmacy catalog.`,
      config: {
        aspectRatio: '4:3',
      },
    });

    if (!media || !media.url) {
      throw new Error('Failed to generate image.');
    }

    return { imageDataUri: media.url };
  }
);
