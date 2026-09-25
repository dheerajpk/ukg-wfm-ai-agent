import type {ExecuteHyperfindResponse} from "./hyperfind.types";
import type {HyperfindNonSignedCW} from "./hyperfind.models";

// Maps the UKG API response to the HyperfindNonSignedCW model.
export const mapToHyperfindNonSignedCW = (
  response: ExecuteHyperfindResponse
): HyperfindNonSignedCW => {
  const coWorkerIds =
    response.result?.basePersons.map(person => person?.personId?.toString()) ??
    [];
  return {
    count: response.count,
    coWorkerIds
  };
};
