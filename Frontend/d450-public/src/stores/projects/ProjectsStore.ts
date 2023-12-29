import { defineStore } from 'pinia';
import { useCompanyStore } from '../CompanyStore';
import { useProjectApi } from '@/network/project/ProjectApi';
import { Page, TransformPage, emptyPage } from '@/common/Page';
import { ProjectBrief, ProjectDetails, ProjectStats } from '@/network/project/Models';

const emptyProjectDetail = () =>
  ({
    id: '',
    name: '',
    description: '',
    scaleId: '',
    isCalculated: false,
    publicState: 'notactivated',
    closedState: 'notactivated',
    calculation: { competenceCalculations: [] },
    content: { scale: { original: '', options: [], hasNonsense: false }, competences: [], profiles: [], roles: [] },
  }) as ProjectDetails;

export interface EmployeeStoreState {
  projectsPage: Page<ProjectBrief>;
  selectedProject: ProjectDetails;
  statistics: ProjectStats;
}

const emptyProjectStats = () =>
  ({
    progressPercentage: 0,
    assignmentsCount: 0,
    assessmentsCount: 0,
    finishedAssignmentsCount: 0,
    assessmentsClosedCount: 0,
    assessmentsOpenedCount: 0,
    assignmentsWithOpenSelfRoleCount: 0,
  }) as ProjectStats;

export const useProjectsStore = defineStore('projects', {
  state: (): EmployeeStoreState => ({
    projectsPage: emptyPage<ProjectBrief>(),
    selectedProject: emptyProjectDetail(),
    statistics: emptyProjectStats(),
  }),

  getters: {
    selectedProjectId: (state) => state.selectedProject.id,
  },

  actions: {
    async selectProject(projectId: string) {
      if (this.selectedProjectId !== projectId) {
        this.selectedProject.id = projectId;
        await this.loadSelectedProject();
      }
    },

    async loadSelectedProject() {
      const { selectedCompany } = useCompanyStore();

      if (!this.selectedProjectId) {
        this.selectedProject = emptyProjectDetail();
        return;
      }

      const apiProject = useProjectApi();

      const result = await apiProject.getProject(selectedCompany!.id, this.selectedProjectId);
      if (!result.errors) this.selectedProject = result;

      this.loadProjectStats();
    },

    async loadPagedProjects(searchText: string, currentPage: number, pageSize: number) {
      const apiProject = useProjectApi();
      const { selectedCompany } = useCompanyStore();

      if (!selectedCompany) return;

      const res = await apiProject.findProjects(selectedCompany.id, searchText, currentPage - 1, pageSize);
      if (!res.errors) this.projectsPage = TransformPage(res, true, (p) => p);
    },

    async createProjectWithScale(name: string, description: string, scaleId: string) {
      const apiProject = useProjectApi();
      const { selectedCompany } = useCompanyStore();

      if (!scaleId) return;

      const project = await apiProject.createProject(selectedCompany!.id, { name, description });
      if (!project.errors) await apiProject.setScale(selectedCompany!.id, project.id, { scaleId });
    },

    async updateProject(name: string, description: string, scaleId: string) {
      const apiProject = useProjectApi();
      const { selectedCompany } = useCompanyStore();

      await apiProject.updateProject(selectedCompany!.id, this.selectedProjectId, { name, description });
      await apiProject.setScale(selectedCompany!.id, this.selectedProjectId, { scaleId });
    },

    async startProject() {
      const apiProject = useProjectApi();
      const { selectedCompany } = useCompanyStore();

      await apiProject.startProject(selectedCompany!.id, this.selectedProject.id);
    },

    async finishProject() {
      const apiProject = useProjectApi();
      const { selectedCompany } = useCompanyStore();

      await apiProject.finishProject(selectedCompany!.id, this.selectedProject.id);
    },

    async loadProjectStats() {
      const apiProject = useProjectApi();
      const { selectedCompany } = useCompanyStore();

      const stats = await apiProject.getProjectStats(selectedCompany!.id, this.selectedProject.id);
      if (!stats.errors) this.statistics = stats;
    },
  },
});
