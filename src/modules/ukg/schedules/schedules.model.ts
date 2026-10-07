// Types for representing coworker schedules, schedule days, shifts, and segments in the UKG WFM system.
export type CoWorkerSchedule = {
  employeeId: string;
  schedules: ScheduleDays[];
};

export type ScheduleDays = {
  hasShift: boolean;
  hasHoliday: boolean;
  hasPayCodeEdit: boolean;
  scheduleDate: string;
  shifts: ScheduleShift[];
};

export type ScheduleShift = {
  id: number;
  startDateTime: string;
  endDateTime: string;
  segments: ScheduleSegment[];
  open: boolean;
  deleted: boolean;
};

export type ScheduleSegment = {
  id: number;
  startDateTime: string;
  endDateTime: string;
  primaryJob: string;
  costCenter: string;
  type: string;
};
