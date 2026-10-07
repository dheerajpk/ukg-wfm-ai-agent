import {AiProvider} from "./ai-provider.interface";
import {GeminiProvider} from "./gemini.provider";
import {LocalAIProvider} from "./local.provider";
import {aiConfig} from "../../../config/ai.config";

export function createAiProvider(): AiProvider {
  switch (aiConfig.provider) {
    case "gemini":
      return new GeminiProvider();
    case "local":
      return new LocalAIProvider(
        aiConfig.aiLocalApiKey,
        aiConfig.aiLocalBaseUrl
      );

    default:
      throw new Error(`Unsupported AI provider: ${aiConfig.provider}`);
  }
}
