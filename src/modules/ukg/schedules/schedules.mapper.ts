import type {
  CoWorkerSchedule,
  ScheduleDays,
  ScheduleShift
} from "./schedules.model";
import {ScheduleDay, ScheduleResponse, Shift} from "./schedules.types";

import {logger} from "../../../common/logger";

export const mapSchedulesToCowokerScheduleShits = (
  scheduleData: ScheduleResponse
): CoWorkerSchedule | null => {
  let coWorkerSchedule: CoWorkerSchedule | null = null;

  if (
    !scheduleData ||
    !scheduleData.scheduleDayList ||
    scheduleData.scheduleDayList.length === 0
  ) {
    logger.info("No schedule data available");
    return null;
  }

  const employeeId = scheduleData.scheduleDayList[0].employee.qualifier;

  let schDays: ScheduleDays[] = [];
  scheduleData.scheduleDayList.forEach((sch: ScheduleDay) => {
    let schedulElement: ScheduleDays = {
      hasShift: sch.hasShift,
      hasHoliday: sch.hasHoliday,
      hasPayCodeEdit: sch.hasPayCodeEdit,
      scheduleDate: sch.day,
      shifts: mapScheduleDayToShift(sch.day, scheduleData.shifts)
    };
    schDays.push(schedulElement);
  });

  coWorkerSchedule = {
    employeeId: employeeId,
    schedules: schDays
  };

  return coWorkerSchedule;
};

const mapScheduleDayToShift = (
  dateString: string,
  shifts: Shift[]
): ScheduleShift[] => {
  const filteredShifts = shifts.filter(x =>
    x.startDateTime.startsWith(dateString)
  );

  return filteredShifts.map(shift => ({
    id: shift.id,
    startDateTime: shift.startDateTime,
    endDateTime: shift.endDateTime,
    segments:
      shift.segments?.map(segment => ({
        id: segment.id,
        startDateTime: segment.startDateTime,
        endDateTime: segment.endDateTime,
        primaryJob: segment.primaryOrgJobRef?.qualifier,
        costCenter: segment.costCenter?.costCenter?.qualifier,
        type: segment.type
      })) || [],
    open: shift.open,
    deleted: shift.deleted
  }));
};
