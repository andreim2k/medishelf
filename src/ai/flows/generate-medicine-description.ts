'use server';
/**
 * @fileOverview A flow to generate a medicine description in Romanian.
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
  description: z
    .string()
    .describe('A detailed, well-formatted description of the medicine in Romanian, including usage, active substance, and common side effects.'),
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
  prompt: `Ești un expert medical. Generează o descriere detaliată și bine formatată pentru următorul medicament: {{{medicineName}}}. Descrierea trebuie să fie în limba română și să includă următoarele secțiuni, fiecare pe un rând nou și cu un titlu boldat (ex: **Utilizare:**): \n- **Utilizare:** Pentru ce este folosit medicamentul. \n- **Substanță activă:** Care este principala substanță activă. \n- **Efecte secundare comune:** O listă scurtă cu cele mai comune efecte secundare. \n\nAsigură-te că textul este clar, concis și ușor de înțeles pentru un non-specialist.`,
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
