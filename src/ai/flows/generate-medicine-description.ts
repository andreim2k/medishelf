'use server';
/**
 * @fileOverview A flow to generate a medicine description.
 *
 * - generateMedicineDescription - A function that generates a description for a given medicine name.
 * - GenerateMedicineDescriptionInput - The input type for the generateMedicineDescription function.
 * - GenerateMedicineDescriptionOutput - The return type for the generateMedicineDescription function.
 */

import { ai, devstralModel } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateMedicineDescriptionInputSchema = z.object({
  medicineName: z.string().describe('The name of the medicine.'),
});
export type GenerateMedicineDescriptionInput = z.infer<
  typeof GenerateMedicineDescriptionInputSchema
>;

const GenerateMedicineDescriptionOutputSchema = z.object({
  descriptionEn: z
    .string()
    .describe('A short, one-sentence description of the medicine in English.'),
  descriptionRo: z
    .string()
    .describe('A short, one-sentence description of the medicine in Romanian.'),
});
export type GenerateMedicineDescriptionOutput = z.infer<
  typeof GenerateMedicineDescriptionOutputSchema
>;

export async function generateMedicineDescription(
  input: GenerateMedicineDescriptionInput
): Promise<GenerateMedicineDescriptionOutput> {
  return generateMedicineDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMedicineDescriptionPrompt',
  model: devstralModel,
  input: { schema: GenerateMedicineDescriptionInputSchema },
  output: { schema: GenerateMedicineDescriptionOutputSchema },
  prompt: `You are a medical expert. Generate a short, one-sentence description for the following medicine: {{{medicineName}}}. Provide the description in both English and Romanian.`,
});

const generateMedicineDescriptionFlow = ai.defineFlow(
  {
    name: 'generateMedicineDescriptionFlow',
    inputSchema: GenerateMedicineDescriptionInputSchema,
    outputSchema: GenerateMedicineDescriptionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate description.');
    }
    return output;
  }
);
