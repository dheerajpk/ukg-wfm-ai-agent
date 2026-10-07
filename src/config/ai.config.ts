import {env} from "./env";

export const aiConfig = {
  provider: env.AI_PROVIDER,
  defaultModel: env.AI_DEFAULT_MODEL,
  geminiModel: env.GEMINI_MODEL,
  aiLocalApiKey: env.AI_LOCAL_API_KEY,
  aiLocalBaseUrl: env.AI_LOCAL_BASE_URL
};
