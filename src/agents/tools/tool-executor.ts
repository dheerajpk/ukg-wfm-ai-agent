import {ToolCall} from "../../modules/ai/chat/chat-completion.types";
import {executeTool} from "./get-hyperfind.tools";

export async function executeToolCall(toolCall: ToolCall): Promise<unknown> {
  const args = JSON.parse(toolCall.function.arguments || "{}");

  switch (toolCall.function.name) {
    case "getUnsignedCoWorkersInfoHandler":
      return executeTool(args);

    // case "get_timecard":
    //   return getTimecard(args);

    // case "get_people":
    //   return getPeople(args);

    // case "validate_timecard":
    //   return validateTimecard(args);

    default:
      throw new Error(`Unsupported tool: ${toolCall.function.name}`);
  }
}
