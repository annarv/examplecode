import { Page } from '@/common/Page';
import { api } from '@/network/apis/api';
import {
  AssignmentChangeRequest,
  AssignmentImportPage,
  AssignmentImportedInfo,
  AssignmentInfo,
  AssignmentPage,
  ImportSummary,
  RespondentChangeRequest,
} from './Models';

export function emptyAssignmentImportPage(): AssignmentImportPage {
  return {
    entities: [],
    page: 0,
    pageSize: 1,
    total: 0,
  };
}

export interface AssignmentApi {
  findAssignments(
    companyId: string,
    search: string,
    page: number,
    pageSize: number,
  ): Promise<MaybeError<AssignmentPage>>;
  getAssignment(companyId: string, assignmentId: string): Promise<MaybeError<AssignmentInfo>>;
  getAssignmentsForProject(
    companyId: string,
    projectId: string,
    page: number,
    pageSize: number,
  ): Promise<MaybeError<Page<AssignmentInfo>>>;
  createAssignment(companyId: string, assignment: AssignmentChangeRequest): Promise<MaybeError<TrueResult>>;
  updateAssignment(
    companyId: string,
    assignmentId: string,
    assignment: AssignmentChangeRequest,
  ): Promise<MaybeError<TrueResult>>;
  removeAssignment(companyId: string, assignmentId: string): Promise<MaybeError<TrueResult>>;
  startRespondent(
    companyId: string,
    assignmentId: string,
    respondentEmployeeId: string,
  ): Promise<MaybeError<TrueResult>>;
  addRespondent(
    companyId: string,
    assignmentId: string,
    respondent: RespondentChangeRequest,
  ): Promise<MaybeError<TrueResult>>;
  changeRespondentRole(
    companyId: string,
    assignmentId: string,
    employeeId: string,
    respondent: RespondentChangeRequest,
  ): Promise<MaybeError<TrueResult>>;
  removeRespondent(companyId: string, assignmentId: string, employeeId: string): Promise<MaybeError<TrueResult>>;
  uploadAssignmentsFile(companyId: string, projectId: string, assignmentsFile: File): Promise<MaybeError<string>>;
  getImportFileId(companyId: string, projectId: string): Promise<MaybeError<string>>;
  getImportedAssignments(
    companyId: string,
    projectId: string,
    page: number,
    pageSize: number,
  ): Promise<MaybeError<AssignmentImportPage>>;
  changeImportAssignment(
    companyId: string,
    projectId: string,
    assignment: AssignmentImportedInfo,
  ): Promise<MaybeError<TrueResult>>;
  getImportSummary(companyId: string, projectId: string): Promise<MaybeError<ImportSummary>>;
  processImport(companyId: string, projectId: string, excelEntityId: string): Promise<MaybeError<boolean>>;
  cancelImport(companyId: string, projectId: string, excelEntityId: string): Promise<MaybeError<boolean>>;
  updateProfileId(companyId: string, projectId: string, profileId: string): Promise<MaybeError<boolean>>;
}

export function useAssignmentApi(): AssignmentApi {
  return {
    getImportSummary: async (companyId, projectId) => {
      try {
        const response = await api.get(`/api/v1/companies/${companyId}/assignments/import/${projectId}/summary`);
        return response.data;
      } catch (error) {
        return { errors: error };
      }
    },
    findAssignments: async (companyId, search, page, pageSize) => {
      try {
        const response = await api.get(`/api/v1/companies/${companyId}/assignments`, {
          params: { search, page, pageSize },
        });
        return response.data;
      } catch (error) {
        return { errors: error };
      }
    },
    getAssignment: async (companyId, assignmentId) => {
      try {
        const response = await api.get(`/api/v1/companies/${companyId}/assignments/${assignmentId}`);
        return response.data;
      } catch (error) {
        return { errors: error };
      }
    },
    getAssignmentsForProject: async (companyId, projectId, page, pageSize) => {
      try {
        const response = await api.get(`/api/v1/companies/${companyId}/assignments/byproject/${projectId}`, {
          params: { page, pageSize },
        });
        return response.data;
      } catch (error) {
        return { errors: error };
      }
    },
    createAssignment: async (companyId, assignment) => {
      try {
        await api.post(`/api/v1/companies/${companyId}/assignments`, assignment);
        return true;
      } catch (error) {
        return <MaybeError<IsError>>{ errors: error };
      }
    },
    updateAssignment: async (companyId, assignmentId, assignment) => {
      try {
        await api.put(`/api/v1/companies/${companyId}/assignments/${assignmentId}`, assignment);
        return true;
      } catch (error) {
        return <MaybeError<IsError>>{ errors: error };
      }
    },
    removeAssignment: async (companyId, assignmentId) => {
      try {
        await api.delete(`/api/v1/companies/${companyId}/assignments/${assignmentId}`);
        return true;
      } catch (error) {
        return <MaybeError<IsError>>{ errors: error };
      }
    },
    startRespondent: async (companyId, assignmentId, respondentEmployeeId) => {
      try {
        await api.put(`/api/v1/companies/${companyId}/assignments/${assignmentId}/start/${respondentEmployeeId}`);
        return true;
      } catch (error) {
        return <MaybeError<IsError>>{ errors: error };
      }
    },
    addRespondent: async (companyId, assignmentId, respondent) => {
      try {
        await api.post(`/api/v1/companies/${companyId}/assignments/${assignmentId}/respondents`, respondent);
        return true;
      } catch (error) {
        return <MaybeError<IsError>>{ errors: error };
      }
    },
    changeRespondentRole: async (companyId, assignmentId, employeeId, respondent) => {
      try {
        await api.put(
          `/api/v1/companies/${companyId}/assignments/${assignmentId}/respondents/${employeeId}`,
          respondent,
        );
        return true;
      } catch (error) {
        return <MaybeError<IsError>>{ errors: error };
      }
    },
    removeRespondent: async (companyId, assignmentId, employeeId) => {
      try {
        await api.delete(`/api/v1/companies/${companyId}/assignments/${assignmentId}/respondents/${employeeId}`);
        return true;
      } catch (error) {
        return <MaybeError<IsError>>{ errors: error };
      }
    },
    uploadAssignmentsFile: async (companyId, projectId, assignmentsFile) => {
      try {
        let formData = new FormData();
        formData.append('assignmentsFile', assignmentsFile);

        const response = await api.post(`/api/v1/companies/${companyId}/assignments/import/${projectId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      } catch (error) {
        return { errors: error };
      }
    },
    getImportFileId: async (companyId, projectId) => {
      try {
        const response = await api.get(`/api/v1/companies/${companyId}/assignments/import/${projectId}`);
        return response.data;
      } catch (error) {
        return { errors: error };
      }
    },
    getImportedAssignments: async (companyId, projectId, page, pageSize) => {
      try {
        const response = await api.get(`/api/v1/companies/${companyId}/assignments/import/${projectId}/assignments`, {
          params: { page, pageSize },
        });
        return response.data;
      } catch (error) {
        return { errors: error };
      }
    },
    changeImportAssignment: async (companyId, projectId, assignment: AssignmentImportedInfo) => {
      try {
        await api.put(`/api/v1/companies/${companyId}/assignments/import/${projectId}`, assignment);
        return true;
      } catch (error) {
        return <MaybeError<IsError>>{ errors: error };
      }
    },
    processImport: async (companyId, projectId, excelEntityId) => {
      try {
        let formData = new FormData();
        formData.append('excelEntityId', excelEntityId);

        const response = await api.post(
          `/api/v1/companies/${companyId}/assignments/import/${projectId}/process`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );
        return response.data;
      } catch (error) {
        return { errors: error };
      }
    },
    cancelImport: async (companyId, projectId, excelEntityId) => {
      try {
        let formData = new FormData();
        formData.append('excelEntityId', excelEntityId);

        const response = await api.post(
          `/api/v1/companies/${companyId}/assignments/import/${projectId}/cancel`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );
        return response.data;
      } catch (error) {
        return { errors: error };
      }
    },
    updateProfileId: async (companyId, projectId, profileId) => {
      try {
        const response = await api.put(
          `/api/v1/companies/${companyId}/assignments/import/${projectId}/profile`,
          profileId,
        );
        return response.data;
      } catch (error) {
        return { errors: error };
      }
    },
  };
}
