import {CoWorkerTimeCard} from "./timecard.model";
import {GetTimecardDataResponse} from "./timecards.types";
import {fetchRequest} from "../ukg.client";
import {mapTimecardDataToCoWorkerTimeCard} from "./timecards.mapper";

// Service for fetching and processing timecard data from the UKG API.
export class TimecardsService {
  constructor() {}

  public async getTimecards(
    employeeId: string,
    startDate: string,
    endDate: string
  ): Promise<CoWorkerTimeCard[]> {
    const requestData = {
      rollupContext: {
        byDate: true,
        byDateRange: false,
        byEmployee: true,
        byJob: false,
        byLaborCategory: true,
        byOrg: true,
        byPaycode: true
      },
      where: {
        employeeSet: {
          dateRange: {
            endDate: endDate,
            startDate: startDate
          },
          employees: {
            qualifiers: [employeeId]
          }
        }
      },
      select: ["ACTUAL_TOTALS"]
    };

    const responseData = await fetchRequest<GetTimecardDataResponse>(
      `v1/timekeeping/timecard_metrics/multi_read`,
      {
        method: "POST",
        body: JSON.stringify(requestData)
      }
    );

    return mapTimecardDataToCoWorkerTimeCard(responseData);
  }
}
