import {genkit, modelRef} from 'genkit';
import { openAICompatible } from '@genkit-ai/compat-oai';

export const ai = genkit({
  plugins: [openAICompatible({
    name: 'requesty',
    baseURL: 'https://router.requesty.ai/v1',
    apiKey: 'rqsty-sk-G2OlCAhrRLak4xOeOaKQ+qsJTJCkd4PHtM31RlebV/Q1lyroX85yhlB+UmMstPWxcob85UExTdDYGchPKHIxHA5Ve4uc5YyYT3RG+5qQmwE=',
  })],
  model: 'requesty/mistral/devstral-latest',
});

export const devstralModel = modelRef({
  name: 'requesty/mistral/devstral-latest',
});
