import {
  ChatCompletionRequest,
  ChatCompletionResponse,
  ChatCompletionTool,
  ChatMessage,
  ToolCall
} from "../chat/chat-completion.types";
import type {
  Content,
  FunctionCall,
  GenerateContentResponse,
  GenerateContentResponseUsageMetadata,
  Part,
  Tool
} from "@google/genai";

import {AiProvider} from "./ai-provider.interface";
import {GoogleGenAI} from "@google/genai";
import {cloudConfig} from "../../../config/clound.config";

export class GeminiProvider implements AiProvider {
  name = "gemini";

  private readonly client: GoogleGenAI;
  private readonly defaultModel: string;

  constructor() {
    this.client = new GoogleGenAI({
      vertexai: true,
      project: cloudConfig.gcpProject,
      location: cloudConfig.vertexLocation
    });

    this.defaultModel = cloudConfig.defaultGeminiModel;
  }

  async createChatCompletion(
    request: ChatCompletionRequest
  ): Promise<ChatCompletionResponse> {
    const model = this.defaultModel;

    const {systemInstruction, contents} = this.mapMessagesToGeminiContents(
      request.messages
    );

    const tools = this.mapOpenAiToolsToGeminiTools(request.tools);

    const response = await this.client.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction,
        temperature: request.temperature,
        maxOutputTokens: request.max_tokens,
        tools
      }
    });

    return this.mapGeminiResponseToOpenAiResponse(response, model);
  }

  private mapMessagesToGeminiContents(messages: ChatMessage[]): {
    systemInstruction?: string;
    contents: Content[];
  } {
    const contents: Content[] = [];
    const toolCallNameById = new Map<string, string>();

    let systemInstruction: string | undefined;

    for (const message of messages) {
      switch (message.role) {
        case "system":
          if (message.content) {
            systemInstruction = systemInstruction
              ? `${systemInstruction}\n\n${message.content}`
              : message.content;
          }

          break;

        case "user":
          contents.push({
            role: "user",
            parts: [
              {
                text: message.content ?? ""
              }
            ]
          });

          break;

        case "assistant": {
          const parts: Part[] = [];

          if (message.content) {
            parts.push({
              text: message.content
            });
          }

          if (message.tool_calls?.length) {
            for (const toolCall of message.tool_calls) {
              toolCallNameById.set(toolCall.id, toolCall.function.name);

              parts.push({
                functionCall: {
                  name: toolCall.function.name,
                  args: this.safeJsonParse(toolCall.function.arguments)
                }
              });
            }
          }

          if (parts.length > 0) {
            contents.push({
              role: "model",
              parts
            });
          }

          break;
        }

        case "tool": {
          const toolName =
            message.name ||
            (message.tool_call_id
              ? toolCallNameById.get(message.tool_call_id)
              : undefined) ||
            "tool_result";

          contents.push({
            role: "user",
            parts: [
              {
                functionResponse: {
                  name: toolName,
                  response: this.safeJsonParse(message.content ?? "{}")
                }
              }
            ]
          });

          break;
        }
      }
    }

    return {
      systemInstruction,
      contents
    };
  }

  private mapOpenAiToolsToGeminiTools(
    tools?: ChatCompletionTool[]
  ): Tool[] | undefined {
    if (!tools || tools.length === 0) {
      return undefined;
    }

    return [
      {
        functionDeclarations: tools.map(tool => ({
          name: tool.function.name,
          description: tool.function.description,
          parameters: tool.function.parameters
        }))
      }
    ];
  }

  private mapGeminiResponseToOpenAiResponse(
    response: GenerateContentResponse,
    model: string
  ): ChatCompletionResponse {
    const functionCalls = response.functionCalls ?? [];

    const message: ChatMessage =
      functionCalls.length > 0
        ? {
            role: "assistant",
            content: null,
            tool_calls: this.mapFunctionCallsToToolCalls(functionCalls)
          }
        : {
            role: "assistant",
            content: response.text ?? ""
          };

    return {
      id: `chatcmpl_gemini_${Date.now()}`,
      object: "chat.completion",
      created: Math.floor(Date.now() / 1000),
      model,
      choices: [
        {
          index: 0,
          message,
          finish_reason: functionCalls.length > 0 ? "tool_calls" : "stop"
        }
      ],
      usage: this.mapUsage(response.usageMetadata)
    };
  }

  private mapFunctionCallsToToolCalls(
    functionCalls: FunctionCall[]
  ): ToolCall[] {
    return functionCalls.map((functionCall, index) => ({
      id: `call_gemini_${Date.now()}_${index}`,
      type: "function",
      function: {
        name: functionCall.name ?? "",
        arguments: JSON.stringify(functionCall.args ?? {})
      }
    }));
  }

  private mapUsage(
    usageMetadata?: GenerateContentResponseUsageMetadata
  ): ChatCompletionResponse["usage"] {
    if (!usageMetadata) {
      return undefined;
    }

    return {
      prompt_tokens: usageMetadata.promptTokenCount,
      completion_tokens: usageMetadata.candidatesTokenCount,
      total_tokens: usageMetadata.totalTokenCount
    };
  }

  private safeJsonParse(value: string): Record<string, unknown> {
    try {
      return JSON.parse(value);
    } catch {
      return {
        value
      };
    }
  }
}
