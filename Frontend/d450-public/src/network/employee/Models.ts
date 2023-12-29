export interface EmployeePage {
  entities: EmployeeInfo[];
  page: number;
  pageSize: number;
  total: number;
}

export interface EmployeeInfo {
  id: string;
  email: string;
  name: string;
  surname: string;
  middleName: string;
}

export interface EmployeeChangeRequest {
  email: string;
  name: string;
  surname: string;
  middleName: string;
}

export interface EmployeeImportedInfo {
  id: string;
  email: string;
  name: string;
  lastName: string;
  middleName: string;
  actionState: number;
  hasConflict: boolean;
  isProcessed: boolean;
  referenceEmployeeId: string;
  possibleActions: { title: string, value: number }[];
  selectedAction: number;
}

export interface ImportSummary {
  conflictsTotal: number;
  toBeProcessed: number;
  processedTotal: number;
  total: number;
}

export interface EmployeeImportPage {
  entities: EmployeeImportedInfo[];
  page: number;
  pageSize: number;
  total: number;
}