import {ChatCompletionTool} from "../../modules/ai/chat/chat-completion.types";
import {CoWorkerTimeCard} from "../../modules/ukg/timecards/timecard.model";
import {TimecardsService} from "../../modules/ukg/timecards/timecards.service";
import {z} from "zod";

// Function-calling schema advertised to the AI model.
export const getCoWorkerTimeCardsTool: ChatCompletionTool = {
  type: "function",
  function: {
    name: "getCoWorkerTimeCardsHandler",
    description:
      "Fetches the co-worker timecards within the specified date range.",
    parameters: {
      type: "object",
      properties: {
        employeeId: {
          type: "string",
          description:
            "The unique identifier of the employee whose timecards are being fetched."
        },
        startDate: {
          type: "string",
          description:
            "start date in YYYY-MM-DD format. Use when the timecards are date-sensitive."
        },
        endDate: {
          type: "string",
          description:
            "Optional end date in YYYY-MM-DD format. Use when the timecards are date-sensitive."
        }
      },
      required: ["employeeId", "startDate", "endDate"]
    }
  }
};

const ExecuteGetCoWorkerTimeCardsInputSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  employeeId: z.string()
});

// Executor invoked when the model calls the getCoWorkerTimeCardsHandler tool.
export const getCoWorkerTimeCardsHandler = async (args: {
  employeeId: string;
  startDate: string;
  endDate: string;
}): Promise<CoWorkerTimeCard[]> => {
  const timecardsService = new TimecardsService();
  return await timecardsService.getTimecards(
    args.employeeId,
    args.startDate,
    args.endDate
  );
};

/**
 * Executes a tool call requested by the model.
 * @param {string} name - Declared tool name.
 * @param {Object} args - Arguments produced by the model.
 * @return {Promise<Object>} The tool result payload.
 */
export async function executeTool(args: Record<string, unknown>) {
  try {
    const params = ExecuteGetCoWorkerTimeCardsInputSchema.parse(args);

    return await getCoWorkerTimeCardsHandler({
      employeeId: args.employeeId as string,
      startDate: params.startDate ?? "",
      endDate: params.endDate ?? ""
    });
  } catch (error) {
    return {error: error instanceof Error ? error.message : String(error)};
  }
}
