import { defineComponent } from 'vue';

export default defineComponent({
  setup() {
    return {
      subnav: [
        {
          link: '/employees',
          text: 'Сотрудники',
          active: false
        },
        {
          link: '#',
          text: 'Оргструктура',
          active: false
        },
        {
          link: '/integrations',
          text: 'Интеграции',
          active: false
        }
      ]
    };
  },
});
