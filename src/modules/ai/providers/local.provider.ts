import {
  ChatCompletionRequest,
  ChatCompletionResponse
} from "../chat/chat-completion.types";

import {AiProvider} from "./ai-provider.interface";
import OpenAI from "openai";

export class LocalAIProvider implements AiProvider {
  private client: OpenAI;
  name = "qwen3:1.7b";

  constructor(apiKey: string, baseURL: string) {
    this.client = new OpenAI({
      baseURL,
      apiKey: apiKey // Placeholder; Ollama's local API doesn't require authentication
    });
  }

  async createChatCompletion(
    request: ChatCompletionRequest
  ): Promise<ChatCompletionResponse> {
    const response = await this.client.chat.completions.create({
      model: this.name,
      messages:
        request.messages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
      max_tokens: request.max_tokens,
      temperature: request.temperature
    });
    return response as ChatCompletionResponse;
  }
}
