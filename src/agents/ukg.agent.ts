import {
  ChatCompletionRequest,
  ChatCompletionResponse
} from "../modules/ai/chat/chat-completion.types";

import {UKG_AGENT_HYPERFIND_UNSIGNED_COWORKERS_PROMPT} from "./prompts/hyperfind.prompt";
import {UKG_AGENT_SYSTEM_PROMPT} from "./prompts/system.prompt";
import {aiService} from "../modules/ai/ai.module";
import {executeToolCall} from "./tools/tool-executor";
import {getUkgToolDefinitions} from "./tools/tool-registry";

export class UkgAgent {
  async createChatCompletion(
    request: ChatCompletionRequest
  ): Promise<ChatCompletionResponse> {
    const messages = [
      {
        role: "system" as const,
        content: `${UKG_AGENT_SYSTEM_PROMPT} \n ${UKG_AGENT_HYPERFIND_UNSIGNED_COWORKERS_PROMPT}`
      },
      ...request.messages
    ];

    const firstResponse = await aiService.chatCompletion({
      ...request,
      messages,
      tools: getUkgToolDefinitions(),
      tool_choice: "auto"
    });

    const assistantMessage = firstResponse.choices[0]?.message;
    const toolCalls = assistantMessage?.tool_calls ?? [];

    if (toolCalls.length === 0) {
      return firstResponse;
    }

    messages.push(assistantMessage);

    for (const toolCall of toolCalls) {
      const toolResult = await executeToolCall(toolCall);

      messages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: JSON.stringify(toolResult)
      });
    }

    return aiService.chatCompletion({
      ...request,
      messages,
      tools: getUkgToolDefinitions()
    });
  }
}

export const ukgAgent = new UkgAgent();
