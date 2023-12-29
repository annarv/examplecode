import { computed, defineComponent, ref } from 'vue';

import { ScaleModel, useScaleStore } from '@/stores/ScaleStore';
import { dialogRefState, refState } from '@/common/RefState';
import { useTextStore } from '@/stores/texts/TextStore';

interface ErrorInterface {
  [key: string]: string[]
}

export default defineComponent({
  setup() {
    const textStore = useTextStore();
    const scaleStore = useScaleStore();
    scaleStore.loadScales();
    
    const errors = ref(<ErrorInterface>{
      createUpdateScale: [],
    });

    const createUpdateDialog = dialogRefState(false, () => {
      resetEditableScale();
    });

    const scales = computed(() => {
      return scaleStore.allScales.map((r) => <ListItem>{ value: r.id, title: r.name });
    });

    const [editableScale, resetEditableScale] = refState<ScaleModel>({
      id: null,
      labels: [],
      name: '',
      nonsense: { isActive: true, value: 'Не могу оценить' },
    });

    const openScaleForUpdate = (idx: number) => {
      const selectedScale = scaleStore.allScales[idx];

      if (!selectedScale) return;

      editableScale.value.id = selectedScale.id;
      editableScale.value.name = selectedScale.name;
      editableScale.value.nonsense = {
        isActive: selectedScale.hasNonsense,
        value: selectedScale.hasNonsense ? selectedScale.options[0].label : 'Не могу оценить',
      };
      editableScale.value.labels = selectedScale.hasNonsense
        ? selectedScale.options.slice(1).map((x) => x.label)
        : selectedScale.options.map((x) => x.label);

      openCreateUpdateDialog();
    };

    const openCreateUpdateDialog = () => {
      erorrsReset();
      createUpdateDialog.value = true;
    };

    const addScaleItem = () => {
      editableScale.value.labels.push('');
    };

    const removeScaleItem = (idx: number) => {
      editableScale.value.labels.splice(idx, 1);
    };

    const updateOrCreate = async () => {
      let operationErrors: string[] = [];

      if (editableScale.value.id === null) {
        operationErrors = await scaleStore.createScale(editableScale.value);
      } else {
        operationErrors = await scaleStore.updateScale(editableScale.value);
      }
      if (operationErrors.length > 0) {
        erorrsReset();
        errors.value.createUpdateScale = operationErrors.map((error) => textStore.getErrorText(error));
        return;
      }
      
      createUpdateDialog.value = false;

      await scaleStore.loadScales();
      resetEditableScale();
    }

    const erorrsReset = () => {
      errors.value.createUpdateScale = [];
    }

    return {
      createUpdateDialog,
      scales,
      editableScale,
      errors,

      openScaleForUpdate,
      addScaleItem,
      removeScaleItem,
      updateOrCreate,
      openCreateUpdateDialog,
    };
  },
});

//TODO: to common models
interface ListItem {
  value: string;
  title: string;
}
