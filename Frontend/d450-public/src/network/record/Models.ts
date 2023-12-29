// export interface ScopeRecordInfo {
//   id: string;
//   projectId: string;
//   isCalculated: boolean;
//   competenceCalculations: ScopeCompetenceCalculationInfo[];
// }

// export interface ScopeCompetenceCalculationInfo {
//   competenceId: string;
//   averageValue: number | null;
// }

export interface EmployeeRecordInfo {
  id: string;
  employeeId: string;
  // projectId: string;
  // scaleId: string;
  isCalculated: boolean;
  hasPersonalReport: boolean;
  hasPersonalReportRequested: boolean;
  hasFailedLastReportRequest: boolean;
  competenceCalculations: EmployeeCompetenceCalculationInfo[];
}

export interface EmployeeCompetenceCalculationInfo {
  competenceId: string;
  selfValue: number | null;
  otherValue: number | null;
}

// export interface EmployeeScopeRecord {
//   scopeRecordId: string;
//   hasPersonalReport: boolean;
//   hasPersonalReportRequested: boolean;
//   hasFailedLastReportRequest: boolean;
// }
