import { defineStore } from 'pinia';
import { useCompanyStore } from '../CompanyStore';
import { AssignmentChangeRequest, RespondentChangeRequest } from './models/Models';
import { useAssignmentApi } from '@/network/assignment/AssignmentApi';
import { Page, TransformPage, emptyPage } from '@/common/Page';
import { useProjectsStore } from '../projects/ProjectsStore';
import { AssignmentInfo } from '@/network/assignment/Models';

export const emptyAssignmentItem = () =>
  ({
    id: '',
    projectId: '',
    employeeId: '',
    profileId: '',
    respondents: [],
  }) as AssignmentInfo;

export interface AssignmentStoreState {
  assignmentsPage: Page<AssignmentInfo>;
}

export const useAssignmentsStore = defineStore('assignments', {
  state: (): AssignmentStoreState => ({
    assignmentsPage: emptyPage<AssignmentInfo>(),
  }),

  actions: {
    async loadPagedProjectAssignments(currentPage: number, pageSize: number) {
      const apiAssignment = useAssignmentApi();
      const { selectedCompany } = useCompanyStore();
      const { selectedProject } = useProjectsStore();

      if (!selectedProject.id) return [];

      const result = await apiAssignment.getAssignmentsForProject(
        selectedCompany!.id,
        selectedProject!.id,
        currentPage - 1,
        pageSize,
      );

      if (!result.errors) this.assignmentsPage = TransformPage(result, true, (a) => a);

      return result.errors || [];
    },

    async createAssignment(model: AssignmentChangeRequest) {
      const apiAssignment = useAssignmentApi();
      const { selectedCompany } = useCompanyStore();
      const { selectedProject } = useProjectsStore();

      if (!selectedCompany) return [];

      const result = await apiAssignment.createAssignment(selectedCompany.id, {
        projectId: selectedProject.id,
        employeeId: model.employeeId,
        profileId: model.profileId,
      });

      return result.errors || [];
    },

    async updateAssignment(assignmentId: string, model: AssignmentChangeRequest) {
      const apiAssignment = useAssignmentApi();
      const { selectedCompany } = useCompanyStore();
      const { selectedProject } = useProjectsStore();

      if (!selectedCompany) return [];

      const result = await apiAssignment.updateAssignment(selectedCompany.id, assignmentId, {
        projectId: selectedProject.id,
        employeeId: model.employeeId,
        profileId: model.profileId,
      });

      return result.errors || [];
    },

    async removeAssignment(assignmentId: string) {
      const apiAssignment = useAssignmentApi();
      const { selectedCompany } = useCompanyStore();

      if (!selectedCompany) return [];

      const result = await apiAssignment.removeAssignment(selectedCompany.id, assignmentId);

      return result.errors || [];
    },

    async startRespondent(assignmentId: string, respondentEmployeeId: string) {
      const apiAssignment = useAssignmentApi();
      const { selectedCompany } = useCompanyStore();

      if (!selectedCompany) return [];

      const result = await apiAssignment.startRespondent(selectedCompany.id, assignmentId, respondentEmployeeId);

      return result.errors || [];
    },

    async addRespondent(assignmentId: string, respondent: RespondentChangeRequest) {
      const apiAssignment = useAssignmentApi();
      const { selectedCompany } = useCompanyStore();

      if (!selectedCompany) return [];

      const result = await apiAssignment.addRespondent(selectedCompany.id, assignmentId, respondent);

      return result.errors || [];
    },

    async removeRespondent(assignmentId: string, employeeId: string) {
      const apiAssignment = useAssignmentApi();
      const { selectedCompany } = useCompanyStore();

      if (!selectedCompany) return [];

      const result = await apiAssignment.removeRespondent(selectedCompany.id, assignmentId, employeeId);

      return result.errors || [];
    },

    async changeRespondentRole(assignmentId: string, respondent: RespondentChangeRequest) {
      const apiAssignment = useAssignmentApi();
      const { selectedCompany } = useCompanyStore();

      if (!selectedCompany) return [];

      const result = await apiAssignment.changeRespondentRole(
        selectedCompany.id,
        assignmentId,
        respondent.employeeId,
        respondent,
      );

      return result.errors || [];
    },
  },
});
