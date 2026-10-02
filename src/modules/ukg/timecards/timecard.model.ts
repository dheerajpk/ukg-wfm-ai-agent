export type CoWorkerTimeCard = {
  employeeId: string;
  timeCards: TimeCard[];
};

export type TimeCard = {
  payCodeId: string;
  payCodeName: string;
  hoursAmount: number;
  daysAmount: number;
  jobName: string;
  amountType: string;
  costCenter: string;
  applyDate: Date | null;
};
