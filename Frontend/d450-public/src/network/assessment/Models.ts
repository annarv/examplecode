export interface AssessmentInfo {
  id: string;
  assignmentId: string;
  projectId: string;
  scaleId: string;
  assessedEmployeeId: string;
  profileId: string;
  respondentEmployeeId: string;
  roleId: string;
  values: AssessmentValueInfo[];
}

export interface AssessmentValueInfo {
  profileId: string;
  indicatorId: string;
  value: number;
}
