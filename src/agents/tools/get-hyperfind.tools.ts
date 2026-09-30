import {ChatCompletionTool} from "../../modules/ai/chat/chat-completion.types";
import type {HyperfindNonSignedCW} from "../../modules/ukg/hyperfind/hyperfind.models";
import {HyperfindService} from "../../modules/ukg/hyperfind/hyperfind.service";
import {z} from "zod";

// Function-calling schema advertised to the AI model.
export const getUnsignedCoWorkersInfoTool: ChatCompletionTool = {
  type: "function",
  function: {
    name: "getUnsignedCoWorkersInfoHandler",
    description:
      "Fetches the count and IDs of co-workers who have not signed off their timecards for the previous pay period.",
    parameters: {
      type: "object",
      properties: {
        startDate: {
          type: "string",
          description:
            "Optional start date in YYYY-MM-DD format. Use when the Hyperfind is date-sensitive."
        },
        endDate: {
          type: "string",
          description:
            "Optional end date in YYYY-MM-DD format. Use when the Hyperfind is date-sensitive."
        }
      },
      required: []
    }
  }
};

const ExecuteHyperfindInputSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional()
});

// Executor invoked when the model calls the get_unsigned_co_workers_info tool.
export const getUnsignedCoWorkersInfoHandler = async (
  _args: Record<string, unknown>
): Promise<HyperfindNonSignedCW> => {
  const hyperfindService = new HyperfindService();
  return await hyperfindService.getUnsignedCoWorkersInfo();
};

/**
 * Executes a tool call requested by the model.
 * @param {string} name - Declared tool name.
 * @param {Object} args - Arguments produced by the model.
 * @return {Promise<Object>} The tool result payload.
 */
export async function executeTool(args: Record<string, unknown>) {
  try {
    const params = ExecuteHyperfindInputSchema.parse(args);

    return await getUnsignedCoWorkersInfoHandler(params);
  } catch (error) {
    return {error: error instanceof Error ? error.message : String(error)};
  }
}
