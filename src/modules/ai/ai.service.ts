import {
  ChatCompletionRequest,
  ChatCompletionResponse
} from "./chat/chat-completion.types";

import {AiProvider} from "./providers/ai-provider.interface";
import {aiConfig} from "../../config/ai.config";

export class AiService {
  constructor(private readonly provider: AiProvider) {}

  async chatCompletion(
    request: ChatCompletionRequest
  ): Promise<ChatCompletionResponse> {
    return this.provider.createChatCompletion({
      ...request,
      model: request.model || aiConfig.defaultModel
    });
  }
}
