import {env} from "./env";

export const aiConfig = {
  provider: env.AI_PROVIDER,
  defaultModel: env.AI_DEFAULT_MODEL,
  geminiModel: env.GEMINI_MODEL
};
