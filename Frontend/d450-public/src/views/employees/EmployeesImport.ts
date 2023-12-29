import { computed, defineComponent, ref } from 'vue';
import { useImportEmployeeStore } from '@/stores/employees/ImportEmployeesStore';
import { ImportEmployeeState } from '@/common/ImportEnums';
import { ImportSummary } from '@/network/employee/Models';
import router from '@/routers';

export default defineComponent({
  setup() {
    const employeeStore = useImportEmployeeStore();
    const employeeFile = ref<File[]>();
    const importedFileExists = ref();
    const pageSize = 10;
    const isLoading = ref(false);
    const showSaveModal = ref(false);
    const showCancelModal = ref(false);
    const summary = ref<ImportSummary>();

    const employees = computed(() => employeeStore.employeesPage.entities.map(employee => {
      let noAction = { title: 'Без действий', value: ImportEmployeeState.NoAction };
      switch (employee.actionState) {
        case ImportEmployeeState.NoAction:
          employee.possibleActions =[{ title: 'Без действий', value: ImportEmployeeState.NoAction }];
          employee.selectedAction = ImportEmployeeState.NoAction;
          break;
        case ImportEmployeeState.CreateNewEmployee:
          employee.possibleActions =[
            noAction,
            { title: 'Создать нового сотрудника', value: ImportEmployeeState.CreateNewEmployee },
          ];
          employee.selectedAction = ImportEmployeeState.CreateNewEmployee;
          break;
        case ImportEmployeeState.UpdateNameByEmail:
          employee.possibleActions =[
            noAction,
            { title: 'Обновление ФИО по email', value: ImportEmployeeState.UpdateNameByEmail },
          ];
          employee.selectedAction = ImportEmployeeState.UpdateNameByEmail;
          break;
        case ImportEmployeeState.UpdateFullByName:
          employee.possibleActions =[
            noAction,
            { title: 'Создать нового сотрудника', value: ImportEmployeeState.CreateNewEmployee },
            { title: 'Обновление ФИО и email', value: ImportEmployeeState.UpdateFullByName },
          ];
          employee.selectedAction = ImportEmployeeState.UpdateFullByName;
          break;
      }
      return employee;
    }));

    const checkFileAndLoad = async () => {
      const timeoutId = setTimeout(() => isLoading.value = true, 300);
      if (!importedFileExists.value)
        importedFileExists.value = await employeeStore.importedFileExists();
      if (importedFileExists.value) {
        await loadEmployees();
        await getSummary();
      }
      clearTimeout(timeoutId);
      isLoading.value = false;
    }

    const onFileChanged = async () => {
      isLoading.value = true;
      employeeFile.value && await employeeStore.uploadEmployeeFile(employeeFile.value[0]);
      isLoading.value = false;
      checkFileAndLoad();
    }

    const loadEmployees = async (page: number = 0, useLoading: boolean = false) => {
      let timeoutId: any;
      if (useLoading)
        timeoutId = setTimeout(() => isLoading.value = true, 300);
      await employeeStore.loadPagedEmployees(page, pageSize);
      if (useLoading) {
        clearTimeout(timeoutId);
        isLoading.value = false;
      }
    }

    const page = computed({
      get() {
        return employeeStore.employeesPage.page + 1;
      },
      async set(page: number) {
        await loadEmployees(page - 1, true);
      },
    });

    const totalPage = computed(() => Math.ceil(employeeStore.employeesPage.total / employeeStore.employeesPage.pageSize));

    const isVisiblePaging = computed(() => employeeStore.employeesPage.total > pageSize);

    const acceptAction = async (employeeId: string) => {
      const employee = employees.value.find(empl => empl.id === employeeId);
      if (employee) {
        employee.hasConflict = false;
        employee.actionState = employee.selectedAction;
        await employeeStore.changeImportEmployee(employee);
        await getSummary();
      }
    }

    const beforeSave = async () => {
      const timeoutId = setTimeout(() => isLoading.value = true, 300);
      await getSummary();
      clearTimeout(timeoutId);
      isLoading.value = false;
      showSaveModal.value = true;
    }

    const getSummary = async () => {
      const result = await employeeStore.getImportSummary();
      if (result)
        summary.value = result;
    }

    const save = async () => {
      showSaveModal.value = false;
      isLoading.value = true;
      const result = await employeeStore.processImport(importedFileExists.value);
      isLoading.value = false;
      if (result)
        await router.push({ name: 'route-employees' });
      else
        await loadEmployees();
    }

    const cancelImport = async () => {
      showCancelModal.value = false;
      const timeoutId = setTimeout(() => isLoading.value = true, 300);
      const result = await employeeStore.cancelImport(importedFileExists.value);
      clearTimeout(timeoutId);
      isLoading.value = false;
      if (result)
        await router.push({ name: 'route-employees' });
    }

    checkFileAndLoad();

    return {
      importedFileExists,
      employeeFile,
      employees,
      isLoading,
      page,
      totalPage,
      isVisiblePaging,
      showSaveModal,
      showCancelModal,
      summary,

      onFileChanged,
      acceptAction,
      beforeSave,
      save,
      cancelImport,
    }
  }
});
