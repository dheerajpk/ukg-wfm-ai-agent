import {ExecuteHyperfindResponse} from "./hyperfind.types";
import type {HyperfindNonSignedCW} from "./hyperfind.models";
import {UKGConfig} from "../../../config/ukg.config";
import {fetchRequest} from "../ukg.client";
import {mapToHyperfindNonSignedCW} from "./hyperfind.mapper";

// Service for interacting with the Hyperfind API in the UKG WFM AI Agent.
export class HyperfindService {
  constructor() {}

  // Fetches information about unsigned co-workers from the Hyperfind API.
  async getUnsignedCoWorkersInfo(params: any): Promise<HyperfindNonSignedCW> {
    const {startDate, endDate} = params;
    const dateRange =
      startDate && endDate
        ? {startDate, endDate}
        : {symbolicPeriod: {qualifier: "Previous_Payperiod"}};

    const response = await fetchRequest<ExecuteHyperfindResponse>(
      "v1/commons/hyperfind/execute",
      {
        method: "POST",
        body: JSON.stringify({
          dateRange: dateRange,
          hyperfind: {
            id: UKGConfig.hyperfindId["NON-SIGNED-OFF-CO-WORKERS"]
          },
          threshold: 10
        })
      } as RequestInit
    );

    const unsignedCoWorkersInfo = mapToHyperfindNonSignedCW(response);

    return unsignedCoWorkersInfo;
  }
}
