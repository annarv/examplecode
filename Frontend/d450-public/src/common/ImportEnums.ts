export enum ImportEmployeeState {
  NoAction = 0,
  CreateNewEmployee = 1,
  UpdateNameByEmail = 2,
  UpdateFullByName = 3
}

export enum AssignmentImportAction {
  NoAction = 0,
	Update = 1,
	Create = 2
}

export enum AssignmentImportState {
  None,
  RoleNotFound,
  EmployeeNotFound,
  RespondentNotFound,
  AlreadyExists,
  RoleUpdate,
  NewAssignment
}