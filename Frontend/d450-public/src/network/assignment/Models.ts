import { ThreePosState } from '../ThreePosState';

export interface AssignmentPage {
  entities: AssignmentInfo[];
  page: number;
  pageSize: number;
  total: number;
}

export interface AssignmentInfo {
  id: string;
  projectId: string;
  employeeId: string;
  profileId: string;
  respondents: RespondentListItem[];
}

export interface RespondentListItem {
  employeeId: string;
  roleId: string;
  publicState: ThreePosState;
}

export interface AssignmentChangeRequest {
  projectId: string;
  employeeId: string;
  profileId: string;
}

export interface RespondentChangeRequest {
  employeeId: string;
  roleId: string;
}

export interface AssignmentImportPage {
  entities: AssignmentImportedInfo[];
  page: number;
  pageSize: number;
  total: number;
}

export interface AssignmentImportedInfo {
  id: string;
  respondentEmail: string;
  employeeEmail: string;
  roleName: string;
  profileId: string;
  state: string[];
  possibleActions: string[];
  action: string;
  hasConflict: boolean;
  isProcessed: boolean;

  hasWarning: boolean;
  possibleActionsAdapter: { title: string; value: number }[];
  selectedActionAdapter: number;
}

export interface ImportSummary {
  conflictsTotal: number;
  toBeProcessed: number;
  processedTotal: number;
  total: number;
}
