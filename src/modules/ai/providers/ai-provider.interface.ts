import {
  ChatCompletionRequest,
  ChatCompletionResponse
} from "../chat/chat-completion.types";

export interface AiProvider {
  name: string;

  createChatCompletion(
    request: ChatCompletionRequest
  ): Promise<ChatCompletionResponse>;
}
