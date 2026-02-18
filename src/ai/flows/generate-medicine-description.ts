'use server';
/**
 * @fileOverview A flow to generate a medicine description.
 *
 * - generateMedicineDescription - A function that generates a description for a given medicine name.
 * - GenerateMedicineDescriptionInput - The input type for the generateMedicineDescription function.
 * - GenerateMedicineDescriptionOutput - The return type for the generateMedicineDescription function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const GenerateMedicineDescriptionInputSchema = z.object({
  medicineName: z.string().describe('The name of the medicine.'),
});
export type GenerateMedicineDescriptionInput = z.infer<
  typeof GenerateMedicineDescriptionInputSchema
>;

export const GenerateMedicineDescriptionOutputSchema = z.object({
  description: z.string().describe('A short description of the medicine.'),
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
  input: { schema: GenerateMedicineDescriptionInputSchema },
  output: { schema: GenerateMedicineDescriptionOutputSchema },
  prompt: `You are a medical expert. Generate a short, one-sentence description for the following medicine: {{{medicineName}}}.`,
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
