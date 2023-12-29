import { useEmployeeStore } from '@/stores/employees/EmployeesStore';
import { computed, defineComponent, ref } from 'vue';
import { createEmployee, EmployeeInfo } from '@/stores/employees/models/EmployeeInfo';
import { dialogRefState, refState } from '@/common/RefState';
import { vue3Debounce } from 'vue-debounce';
import { useTextStore } from '@/stores/texts/TextStore';

interface ErrorInterface {
  [key: string]: string[]
}

export default defineComponent({
  directives: {
    debounce: vue3Debounce({
      lock: true,
      fireOnEmpty: true,
      listenTo: 'input',
    }),
  },
  setup() {
    const employeeStore = useEmployeeStore();
    const textStore = useTextStore();
    const pageSize = 10;
    const searchText = ref('');
    const [editableEmpl, resetEditableEmpl] = refState<EmployeeInfo>({
      id: null,
      email: '',
      name: '',
      surname: '',
      middleName: '',
    });
    const createUpdateDialog = dialogRefState(false, () => {
      resetEditableEmpl();
      erorrsReset();
    });
    const errors = ref(<ErrorInterface>{
      createUpdateEmployee: [],
    });

    const employees = computed(() => employeeStore.employeesPage.entities.map((e) => createEmployee(e)));

    const page = computed({
      get() {
        return employeeStore.employeesPage.page + 1;
      },
      async set(page: number) {
        await employeeStore.loadPagedEmployees(searchText.value, page - 1, pageSize);
      },
    });

    const totalPage = computed(() => {
      return Math.ceil(employeeStore.employeesPage.total / employeeStore.employeesPage.pageSize);
    });

    employeeStore.loadPagedEmployees(searchText.value, 0, pageSize);

    const isVisiblePaging = () => employeeStore.employeesPage.total > pageSize;
    const onSearchInputEvent = () => {
      employeeStore.loadPagedEmployees(searchText.value, 0, pageSize);
    };

    const openEmployeeForUpdate = (idx: number) => {
      const selectedScale = employeeStore.employeesPage.entities[idx];

      if (!selectedScale) return;

      editableEmpl.value = JSON.parse(JSON.stringify(selectedScale));
      createUpdateDialog.value = true;
    };

    const updateOrCreate = async () => {
      let operationErrors: string[] = [];

      if (editableEmpl.value.id === null) {
        operationErrors = await employeeStore.createEmployee(editableEmpl.value);
      } else {
        operationErrors = await employeeStore.updateEmployee(editableEmpl.value);
      }
      if (operationErrors.length > 0) {
        erorrsReset();
        errors.value.createUpdateEmployee = operationErrors.map((error) => textStore.getErrorText(error));
        return;
      }

      employeeStore.loadPagedEmployees(searchText.value, 0, pageSize);

      createUpdateDialog.value = false;
      resetEditableEmpl();
    };

    const erorrsReset = () => {
      errors.value.createUpdateEmployee = [];
    }

    return {
      searchText,
      page,
      totalPage,
      editableEmpl,
      createUpdateDialog,
      errors,

      employees,

      resetEditableEmpl,
      isVisiblePaging,
      onSearchInputEvent,
      openEmployeeForUpdate,
      updateOrCreate,
    };
  },
});
