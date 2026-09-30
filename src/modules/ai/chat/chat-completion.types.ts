export type ChatRole = "system" | "user" | "assistant" | "tool";

export type ChatMessage = {
  role: ChatRole;
  content?: string | null;
  tool_call_id?: string;
  name?: string;
  tool_calls?: ToolCall[];
};

export type ToolCall = {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: string;
  };
};

export type ChatCompletionTool = {
  type: "function";
  function: {
    name: string;
    description?: string;
    parameters: Record<string, unknown>;
  };
};

export type ChatCompletionRequest = {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
  tools?: ChatCompletionTool[];
  tool_choice?:
    | "none"
    | "auto"
    | {
        type: "function";
        function: {
          name: string;
        };
      };
};

export type ChatCompletionResponse = {
  id: string;
  object: "chat.completion";
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: ChatMessage;
    finish_reason: "stop" | "length" | "tool_calls" | "content_filter" | null;
  }>;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
};

// /**
//  * OpenAI-compatible message schema
//  */
// const ChatMessageSchema = z.object({
//   role: z.enum(["system", "user", "assistant", "tool"]),
//   content: z.string().nullable().optional(),

//   // Used for tool responses
//   tool_call_id: z.string().optional(),

//   // Optional name field
//   name: z.string().optional(),

//   // Assistant messages may include tool calls
//   tool_calls: z
//     .array(
//       z.object({
//         id: z.string(),
//         type: z.literal("function"),
//         function: z.object({
//           name: z.string(),
//           arguments: z.string()
//         })
//       })
//     )
//     .optional()
// });

// /**
//  * OpenAI-compatible tool schema
//  */
// const ChatCompletionToolSchema = z.object({
//   type: z.literal("function"),
//   function: z.object({
//     name: z.string(),
//     description: z.string().optional(),
//     parameters: z.record(z.string(), z.unknown())
//   })
// });

// /**
//  * OpenAI-compatible chat completion request schema
//  */
// export const ChatCompletionRequestSchema = z.object({
//   model: z.string().optional(),

//   messages: z.array(ChatMessageSchema).min(1),

//   temperature: z.number().min(0).max(2).optional(),

//   max_tokens: z.number().int().positive().optional(),

//   stream: z.boolean().optional(),

//   tools: z.array(ChatCompletionToolSchema).optional(),

//   tool_choice: z
//     .union([
//       z.literal("none"),
//       z.literal("auto"),
//       z.object({
//         type: z.literal("function"),
//         function: z.object({
//           name: z.string()
//         })
//       })
//     ])
//     .optional(),

//   user: z.string().optional()
// });
