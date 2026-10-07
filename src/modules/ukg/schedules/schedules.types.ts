export type ScheduleResponse = {
  shifts: Shift[];
  payCodeEdits: PayCodeEdit[];
  leaveEdits: unknown[];
  availabilities: unknown[];
  holidays: unknown[];
  dayLocks: unknown[];
  employees: EmployeeRef[];
  openShifts: unknown[];
  scheduleDayList: ScheduleDay[];
  expandedJobs: unknown[];
  scheduleTags: unknown[];
};

export interface Shift {
  id: number;
  startDateTime: string;
  endDateTime: string;
  version: number;
  label: string;
  employee: EmployeeRef;
  locked: boolean;
  posted: boolean;
  generated: boolean;
  deleted: boolean;
  selfServiced: boolean;
  commentNotes: unknown[];
  segments: Segment[];
  postedNotificationPending: boolean;
  relations: Relation[];
  modifiedDateTime: string;
  open: boolean;
}

export interface Segment {
  id: number;
  segmentTypeRef: QualifiedRef;
  startDateTime: string;
  endDateTime: string;
  transferLaborCategories: boolean;
  orgJobRef: QualifiedRef;
  userEnteredOrgJob: boolean;
  transferOrgJob: boolean;
  primaryOrgJobRef: QualifiedRef;
  costCenter: CostCenterReference;
  primaryCostCenter: CostCenterReference;
  userEnteredCostCenter: boolean;
  transferCostCenter: boolean;
  workruleRef: WorkruleRef;
  userEnteredWorkrule: boolean;
  transferWorkrule: boolean;
  primaryWorkruleRef: WorkruleRef;
  skillCertProfileRefs: unknown[];
  type: string;
}

export interface PayCodeEdit {
  id: number;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  version: number;
  employee: EmployeeRef;
  locked: boolean;
  posted: boolean;
  generated: boolean;
  deleted: boolean;
  payCodeEditRelations: Relation[];
  commentNotes: unknown[];
  payCodeRef: QualifiedRef;
  durationInTime: number;
  durationInDays: number;
  transferString: string;
  transferLaborCategories: boolean;
  orgJobRef: QualifiedRef;
  userEnteredOrgJob: boolean;
  transferOrgJob: boolean;
  primaryOrgJobRef: QualifiedRef;
  costCenter: CostCenterReference;
  primaryCostCenter: CostCenterReference;
  userEnteredCostCenter: boolean;
  transferCostCenter: boolean;
  symbolicValueRef: QualifiedRef;
  overrideAccrual: boolean;
  postedNotificationPending: boolean;
  unavailabilityStartTime: string;
  unavailabilityAmount: string;
  unavailabilityInMinutes: string;
  relations: Relation[];
  modifiedDateTime: string;
}

export interface EmployeeRef {
  id: number;
  qualifier: string;
}

export interface QualifiedRef {
  id: number;
  qualifier: string;
}

export interface WorkruleRef extends QualifiedRef {
  guid: string;
}

export interface CostCenterReference {
  referenceId: number;
  costCenter: QualifiedRef;
}

export interface Relation {
  targetRef: NullableQualifiedRef;
  relationType: string;
  active: boolean;
  from: NullableQualifiedRef;
  type: string;
}

export interface NullableQualifiedRef {
  id: number;
  qualifier: string | null;
}

export interface ScheduleDay {
  employee: EmployeeRef;
  hasShift: boolean;
  hasHoliday: boolean;
  hasPayCodeEdit: boolean;
  day: string;
}
