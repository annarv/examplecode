import { Page } from '@/common/Page';
import { api } from '@/network/apis/api';
import { ProjectChangeRequest, ProjectBrief, ProjectSetScaleRequest, ProjectStats, ProjectDetails } from './Models';

export interface ProjectApi {
  findProjects(companyId: string, search: string, page: number, pageSize: number): Promise<MaybeError<Page<ProjectBrief>>>;
  getProject(companyId: string, projectId: string): Promise<MaybeError<ProjectDetails>>;
  createProject(companyId: string, project: ProjectChangeRequest): Promise<MaybeError<ProjectBrief>>;
  updateProject(companyId: string, projectId: string, project: ProjectChangeRequest): Promise<MaybeError<TrueResult>>;
  setScale(companyId: string, projectId: string, scale: ProjectSetScaleRequest): Promise<MaybeError<TrueResult>>;
  startProject(companyId: string, projectId: string): Promise<MaybeError<TrueResult>>;
  finishProject(companyId: string, projectId: string): Promise<MaybeError<TrueResult>>;
  getProjectStats(companyId: string, projectId: string): Promise<MaybeError<ProjectStats>>;
}

export function useProjectApi(): ProjectApi {
  return {
    findProjects: async (companyId, search, page, pageSize) => {
      try {
        const response = await api.get(`/api/v1/companies/${companyId}/projects`, {
          params: { search, page, pageSize },
        });
        return response.data;
      } catch (error) {
        return { errors: error };
      }
    },
    getProject: async (companyId, projectId) => {
      try {
        const response = await api.get(`/api/v1/companies/${companyId}/projects/${projectId}`);
        return response.data;
      } catch (error) {
        return { errors: error };
      }
    },
    createProject: async (companyId, project) => {
      try {
        const response = await api.post(`/api/v1/companies/${companyId}/projects`, project);

        const location = response.headers.location;
        if (!location) return null;

        const createdCompetence = await api.get(location);
        return createdCompetence.data;
      } catch (error) {
        return { errors: error };
      }
    },
    updateProject: async (companyId, projectId, project) => {
      try {
        await api.put(`/api/v1/companies/${companyId}/projects/${projectId}`, project);
        return true;
      } catch (error) {
        return <MaybeError<IsError>>{ errors: error };
      }
    },
    setScale: async (companyId, projectId, scale) => {
      try {
        await api.put(`/api/v1/companies/${companyId}/projects/${projectId}/setscale`, scale);
        return true;
      } catch (error) {
        return <MaybeError<IsError>>{ errors: error };
      }
    },
    startProject: async (companyId, projectId) => {
      try {
        await api.put(`/api/v1/companies/${companyId}/projects/${projectId}/start`);
        return true;
      } catch (error) {
        return <MaybeError<IsError>>{ errors: error };
      }
    },
    finishProject: async (companyId, projectId) => {
      try {
        await api.put(`/api/v1/companies/${companyId}/projects/${projectId}/finish`);
        return true;
      } catch (error) {
        return <MaybeError<IsError>>error;
      }
    },
    getProjectStats: async (companyId, projectId) => {
      try {
        const response = await api.put(`/api/v1/companies/${companyId}/projects/${projectId}/stats`);
        return response.data;
      } catch (error) {
        return { errors: error };
      }
    },
  };
}
