// Types for representing timecards and coworker timecards in the UKG system.

export type GetTimecardDataResponse = TimecardData[];

export interface TimecardData {
  employeeId: EntityReference;
  actualTotals: ActualTotal[];
}

export interface EntityReference {
  id: string;
  qualifier: string;
  name: string;
}

export interface ActualTotal {
  uniqueId: string;
  employee: EntityReference;
  payCode: EntityReference | null;
  hoursAmount: number;
  wages: number;
  wagesCurrency: CurrencyAmount;
  daysAmount: number;
  applyDate: string | null;
  job: EntityReference | null;
  jobTransfer: boolean;
  laborTransfer: boolean;
  amountType: "HOUR";
  isFromCorrection: boolean;
  combined: boolean;
  payPeriodNumber: number;
  signedOff: boolean;
  wageAddition: number;
  wageMultiplier: number;
  laborCategories: LaborCategories;
  costCenter: CostCenterReference;
  wageRate?: number;
}

export interface CurrencyAmount {
  amount: number;
  currencyCode: string;
}

export interface LaborCategories {
  referenceId: number;
  laborString: string;
  entries: unknown[];
}

export interface CostCenterReference {
  referenceId: number;
  costCenter: EntityReference;
}
