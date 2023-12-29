export interface EmployeeInfo {
  id: string | null;
  email: string;
  name: string;
  surname: string;
  middleName: string;
}

interface EmployeeFullNameMixin {
  get fullName(): string;
}

export type EmployeeInfoExt = EmployeeInfo & EmployeeFullNameMixin;

export const createEmployee = (info: EmployeeInfo): EmployeeInfoExt => ({
  ...info,
  get fullName() {
    return [this.surname, this.name, this.middleName].join(' ');
  },
});
