import {getCoWorkerTimeCardsTool} from "./get-timecards.tools";
import {getUnsignedCoWorkersInfoTool} from "./get-hyperfind.tools";

export function getUkgToolDefinitions() {
  return [getUnsignedCoWorkersInfoTool, getCoWorkerTimeCardsTool];
}
