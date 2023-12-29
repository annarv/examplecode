import { defineComponent } from 'vue';

export default defineComponent({
  setup() {
    return {
      nav: [
        {
          icon: 'projects',
          link: '/projects',
          text: 'Оценка 360',
          active: true,
        },
        {
          icon: 'employees',
          link: '/employees',
          text: 'Компания',
          active: false,
        },
        {
          icon: 'companies',
          link: '/companies',
          text: 'К списку компаний',
          active: false,
        },
      ],
    };
  },
});
