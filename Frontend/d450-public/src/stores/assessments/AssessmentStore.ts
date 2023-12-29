import { Page, TransformPage, emptyPage } from '@/common/Page';
import { useAssessmentApi } from '@/network/assessment/AssessmentApi';
import { AssessmentInfo } from '@/network/assessment/Models';
import { defineStore } from 'pinia';
import { useCompanyStore } from '../CompanyStore';
import { useProjectsStore } from '../projects/ProjectsStore';

export interface AssessmentStoreState {
  assessmentsPage: Page<AssessmentInfo>;
}

export const useAssessmentStore = defineStore('assessment', {
  state: (): AssessmentStoreState => ({
    assessmentsPage: emptyPage<AssessmentInfo>(),
  }),

  actions: {
    async loadPagedProjectAssessments(currentPage: number, pageSize: number) {
      const apiAssessment = useAssessmentApi();
      const { selectedCompany } = useCompanyStore();
      const { selectedProject } = useProjectsStore();

      var res = await apiAssessment.findAssessmentsForProject(
        selectedCompany!.id,
        selectedProject.id,
        currentPage - 1,
        pageSize,
      );

      if (!res.errors)
        this.assessmentsPage = TransformPage(res, true, (a) => a);
    },
  },
});
