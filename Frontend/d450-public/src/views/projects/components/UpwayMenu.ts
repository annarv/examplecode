import { defineComponent, ref } from 'vue';
import { useProjectsStore } from '@/stores/projects/ProjectsStore';
import { DownloadBlobFile } from '@/common/BlobHelper';
import { useUpwayApi } from '@/network/upway/UpwayApi';
import { useCompanyStore } from '@/stores/CompanyStore';

export default defineComponent({
  setup() {
    const { selectedProject } = useProjectsStore();
    const { selectedCompany } = useCompanyStore();
    const upwayApi = useUpwayApi();
    const isLoading = ref(false);

    const getZipResultsForUpway = async () => {
      if (!selectedCompany || !selectedProject) return;
      const csvBlob = await upwayApi.getResultsForUpway(selectedCompany.id, selectedProject.id);
      if (csvBlob.errors) return;
      DownloadBlobFile(csvBlob, 'D450_project_results_to_Upway.csv');
    }

    const getZipProjectForUpway = async () => {
      if (!selectedCompany || !selectedProject) return;
      const csvBlob = await upwayApi.getProjectForUpway(selectedCompany.id, selectedProject.id);
      if (csvBlob.errors) return;
      DownloadBlobFile(csvBlob, 'D450_project_to_Upway.zip');
    }

    const getZipStatesForUpway = async () => {
      if (!selectedCompany || !selectedProject) return;
      const csvBlob = await upwayApi.getStatesForUpway(selectedCompany.id, selectedProject.id);
      if (csvBlob.errors) return;
      DownloadBlobFile(csvBlob, 'D450_project_states_to_Upway.csv');
    }

    const copyReport = async () => {
      isLoading.value = true;
      setTimeout(() => isLoading.value = false, 5000);
      if (!selectedCompany || !selectedProject) return;
      await upwayApi.copyReportsToPublic(selectedCompany.id, selectedProject.id);
    }

    return {
      isLoading,
      getZipProjectForUpway,
      getZipStatesForUpway,
      getZipResultsForUpway,
      copyReport,
    }
  },
});
