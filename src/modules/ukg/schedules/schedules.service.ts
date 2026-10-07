import {CoWorkerSchedule} from "./schedules.model";
import {ScheduleResponse} from "./schedules.types";
import {fetchRequest} from "../ukg.client";
import {mapSchedulesToCowokerScheduleShits} from "./schedules.mapper";

export class SchedulesService {
  public async getSchedules(
    employeeId: string,
    startDate: string,
    endDate: string
  ): Promise<CoWorkerSchedule | null> {
    const requestData = {
      where: {
        employees: {
          dateRange: {
            endDate: endDate,
            startDate: startDate
          },
          employees: {
            qualifiers: [employeeId]
          }
        }
      },
      select: ["SCHEDULEDAYS", "SHIFTS", "PAYCODEEDITS"]
    };

    const responseData = await fetchRequest<ScheduleResponse>(
      `v1/scheduling/schedule/multi_read`,
      {
        method: "POST",
        body: JSON.stringify(requestData)
      }
    );

    return mapSchedulesToCowokerScheduleShits(responseData);
  }
}
