import { defineComponent, ref } from 'vue';

export default defineComponent({
  props: {
    errorCode: {
      type: Number,
    },
  },
  setup(props) {
    const isNotFoundPage = ref(!props.errorCode || props.errorCode == 404);

    return { isNotFoundPage };
  },
});
