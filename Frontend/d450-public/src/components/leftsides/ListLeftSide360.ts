import { defineComponent } from 'vue';

export default defineComponent({
  setup() {
    return {
      subnav: [
        {
          link: '/projects',
          text: 'Проекты оценки',
          active: false,
        },
        {
          link: '/profiles/list',
          text: 'Профили оценки',
          active: false,
        },
        {
          link: '/competences',
          text: 'Компетенции',
          active: false,
        },
        {
          link: '/scales',
          text: 'Шкалы',
          active: false,
        },
        {
          link: '/roles',
          text: 'Роли',
          active: false,
        },
        {
          link: '/branding#',
          text: 'Брендирование',
          active: false,
        },
      ],
    };
  },
});
