import {GetTimecardDataResponse, TimecardData} from "./timecards.types";

import type {CoWorkerTimeCard} from "./timecard.model";

export const mapTimecardDataToCoWorkerTimeCard = (
  timecardDatas: GetTimecardDataResponse
): CoWorkerTimeCard[] => {
  return timecardDatas.map((timecardData: TimecardData) => ({
    employeeId: timecardData.employeeId.id,
    timeCards: timecardData.actualTotals.map((actualTotal: any) => ({
      payCodeId: actualTotal.payCode?.id,
      payCodeName: actualTotal.payCode?.name,
      hoursAmount: actualTotal.hoursAmount,
      daysAmount: actualTotal.daysAmount,
      jobName: actualTotal.job?.name,
      amountType: actualTotal.amountType,
      costCenter: actualTotal.costCenter?.costCenter?.name,
      applyDate: actualTotal.applyDate ? new Date(actualTotal.applyDate) : null
    }))
  }));
};
