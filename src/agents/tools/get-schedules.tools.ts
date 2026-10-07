import {ChatCompletionTool} from "../../modules/ai/chat/chat-completion.types";
import {CoWorkerSchedule} from "../../modules/ukg/schedules/schedules.model";
import {SchedulesService} from "../../modules/ukg/schedules/schedules.service";
import {z} from "zod";

// Function-calling schema advertised to the AI model.
export const getCoWorkerSchedulesTool: ChatCompletionTool = {
  type: "function",
  function: {
    name: "getCoWorkerSchedulesHandler",
    description:
      "Fetches the co-worker schedules within the specified date range.",
    parameters: {
      type: "object",
      properties: {
        employeeId: {
          type: "string",
          description:
            "The unique identifier of the employee whose schedules are being fetched."
        },
        startDate: {
          type: "string",
          description:
            "start date in YYYY-MM-DD format. Use when the schedules are date-sensitive."
        },
        endDate: {
          type: "string",
          description:
            "Optional end date in YYYY-MM-DD format. Use when the schedules are date-sensitive."
        }
      },
      required: ["employeeId", "startDate", "endDate"]
    }
  }
};

const ExecuteGetCoWorkerSchedulesInputSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  employeeId: z.string()
});

// Executor invoked when the model calls the getCoWorkerSchedulesHandler tool.
export const getCoWorkerSchedulesHandler = async (args: {
  employeeId: string;
  startDate: string;
  endDate: string;
}): Promise<CoWorkerSchedule | null> => {
  const schedulesService = new SchedulesService();
  return await schedulesService.getSchedules(
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
    const params = ExecuteGetCoWorkerSchedulesInputSchema.parse(args);

    return await getCoWorkerSchedulesHandler({
      employeeId: args.employeeId as string,
      startDate: params.startDate ?? "",
      endDate: params.endDate ?? ""
    });
  } catch (error) {
    return {error: error instanceof Error ? error.message : String(error)};
  }
}
