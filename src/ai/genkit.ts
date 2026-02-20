import {genkit, modelRef} from 'genkit';
import { openAICompatible } from '@genkit-ai/compat-oai';

export const ai = genkit({
  plugins: [
    openAICompatible({
      name: 'requesty',
      baseURL: 'https://router.requesty.ai/v1',
      apiKey: process.env.REQUESTY_API_KEY,
    }),
  ],
  model: 'requesty/mistral/devstral-latest',
});

export const devstralModel = modelRef({
  name: 'requesty/mistral/devstral-latest',
});
