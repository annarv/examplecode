import { ref, Ref, watch } from 'vue';

/**  generic refState for reset to default value by call reset function */
export function refState<T>(defaultValue: T): [Ref<T>, () => void] {
  const value: Ref<T> = ref(JSON.parse(JSON.stringify(defaultValue))) as Ref<T>;

  const reset = () => {
    value.value = JSON.parse(JSON.stringify(defaultValue));
  };

  return [value, reset];
}

/**  refState for handle state if dialog is closed in callback function */
export function dialogRefState(defaultValue: boolean, callback: () => void): Ref<boolean> {
  const value = ref(defaultValue);
  watch(value, (newValue) => {
    if (!newValue) {
      callback();
    }
  });
  return value;
}
