import {
  ChatCompletionRequest,
  ChatCompletionResponse,
  ChatMessage
} from "../modules/ai/chat/chat-completion.types";

import {UKG_AGENT_HYPERFIND_UNSIGNED_COWORKERS_PROMPT} from "./prompts/hyperfind.prompt";
import {UKG_AGENT_SYSTEM_PROMPT} from "./prompts/system.prompt";
import {UKG_AGENT_TIME_CARD_PROMPT} from "./prompts/timecard.prompt";
import {aiService} from "../modules/ai/ai.module";
import {executeToolCall} from "./tools/tool-executor";
import {getUkgToolDefinitions} from "./tools/tool-registry";

const SIGNOFF_INTENT_PATTERN = /sign[\s-]?off|unsigned/i;
const TIMECARD_INTENT_PATTERN = /timecard/i;

// Picks the task prompt matching the latest user message's intent, falling back to both when unclear.
function resolveTaskPrompt(messages: ChatMessage[]): string {
  const lastUserMessage = [...messages]
    .reverse()
    .find(message => message.role === "user");
  const text = lastUserMessage?.content ?? "";

  const mentionsSignoff = SIGNOFF_INTENT_PATTERN.test(text);
  const mentionsTimecard = TIMECARD_INTENT_PATTERN.test(text);

  if (mentionsSignoff) {
    return UKG_AGENT_HYPERFIND_UNSIGNED_COWORKERS_PROMPT;
  }

  if (mentionsTimecard) {
    return UKG_AGENT_TIME_CARD_PROMPT;
  }

  return `${UKG_AGENT_HYPERFIND_UNSIGNED_COWORKERS_PROMPT} \n ${UKG_AGENT_TIME_CARD_PROMPT}`;
}

export class UkgAgent {
  async createChatCompletion(
    request: ChatCompletionRequest
  ): Promise<ChatCompletionResponse> {
    const taskPrompt = resolveTaskPrompt(request.messages);
    const messages = [
      {
        role: "system" as const,
        content: `${UKG_AGENT_SYSTEM_PROMPT} \n ${taskPrompt}`
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
