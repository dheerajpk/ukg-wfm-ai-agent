import {ChatCompletionTool} from "../../modules/ai/chat/chat-completion.types";
import type {HyperfindNonSignedCW} from "../../modules/ukg/hyperfind/hyperfind.models";
import {HyperfindService} from "../../modules/ukg/hyperfind/hyperfind.service";

// Function-calling schema advertised to the AI model.
export const getUnsignedCoWorkersInfoTool: ChatCompletionTool = {
  type: "function",
  function: {
    name: "getUnsignedCoWorkersInfoHandler",
    description:
      "Fetches the count and IDs of co-workers who have not signed off their timecards for the previous pay period.",
    parameters: {
      type: "object",
      properties: {},
      required: []
    }
  }
};

// Executor invoked when the model calls the get_unsigned_co_workers_info tool.
export const getUnsignedCoWorkersInfoHandler =
  async (): Promise<HyperfindNonSignedCW> => {
    const hyperfindService = new HyperfindService();
    return await hyperfindService.getUnsignedCoWorkersInfo();
  };

/**
 * Executes a tool call requested by the model.
 * @param {string} name - Declared tool name.
 * @param {Object} args - Arguments produced by the model.
 * @return {Promise<Object>} The tool result payload.
 */
export async function executeTool() {
  try {
    return await getUnsignedCoWorkersInfoHandler();
  } catch (error) {
    return {error: error instanceof Error ? error.message : String(error)};
  }
}
