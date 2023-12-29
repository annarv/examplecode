import { useAuthStore } from '@/stores/AuthStore';
import { useCompanyStore } from '@/stores/CompanyStore';
import { useProfileStore } from '@/stores/profiles/ProfileStore';
import { useCompetenceStore } from '@/stores/competences/CompetencesStore';
import { useProjectsStore } from '@/stores/projects/ProjectsStore';
import { createRouter, createWebHistory, RouteLocationNormalized, RouteRecordRaw } from 'vue-router';
import ErrorPage from '@/components/mains/ErrorPage.vue';
import { useRecordStore } from '@/stores/records/RecordStore';

const selectedCompanyCheck = () => {
  const companyStore = useCompanyStore();
  if (!companyStore.selectedCompany) {
    return { name: 'route-choose-company' };
  }
};

const selectProject = async (to: RouteLocationNormalized) => {
  await useProjectsStore().selectProject(<string>to.params.id);
  // await useRecordStore().loadScopeByProject();
};
const selectProfile = async (to: RouteLocationNormalized) => await useProfileStore().selectProfile(<string>to.params.id);
const selectCompetence = async (to: RouteLocationNormalized) => await useCompetenceStore().selectCompetence(<string>to.params.id);

const routes: RouteRecordRaw[] = [
  {
    name: 'route-choose-company',
    path: '/companies',
    components: {
      default: () => import('@/views/companies/ChooseCompany.vue'),
    },
  },
  {
    name: 'route-root',
    path: '/',
    components: {
      default: () => import('@/components/mains/EmptyMain.vue'),
      AppBar: () => import('@/components/appbars/MainBar.vue'),
      LeftSide: () => import('@/components/leftsides/ListLeftSide360.vue'),
    },
    redirect: { name: 'route-projects-list' },
    beforeEnter: selectedCompanyCheck,
    children: [
      // projects
      {
        name: 'route-projects',
        path: 'projects',
        redirect: { name: 'route-projects-list' },
        children: [
          {
            name: 'route-projects-list',
            path: '',
            component: () => import('@/views/projects/Projects.vue'),
          },
          {
            name: 'route-project',
            path: ':id',
            redirect: { name: 'route-project-details' },
            beforeEnter: selectProject,
            children: [
              {
                name: 'route-project-details',
                path: 'details',
                component: () => import('@/views/projects/ProjectDetails.vue'),
              },
              {
                name: 'route-project-import',
                path: 'import',
                component: () => import('@/views/projects/ProjectImport.vue'),
              },
            ],
          },
        ],
      },
      // competence models
      {
        name: 'route-profiles',
        path: 'profiles',
        redirect: { name: 'route-profiles-list' },
        children: [
          {
            name: 'route-profiles-list',
            path: 'list',
            component: () => import('@/views/profiles/Profiles.vue'),
          },
          {
            name: 'route-profile',
            path: ':id?',
            redirect: { name: 'route-profile-details' },
            beforeEnter: selectProfile,
            children: [
              {
                name: 'route-profile-details',
                path: 'details',
                component: () => import('@/views/profiles/ProfileDetails.vue'),
              },
            ],
          },
        ],
      },
      // competences
      {
        name: 'route-competences',
        path: 'competences',
        redirect: { name: 'route-competences-list' },
        children: [
          {
            name: 'route-competences-list',
            path: '',
            component: () => import('@/views/competences/Competences.vue'),
          },
          {
            name: 'route-competence-create',
            path: 'create',
            component: () => import('@/views/competences/CompetenceEdit.vue'),
          },
          {
            name: 'route-competence',
            path: ':id',
            redirect: { name: 'route-competence-edit' },
            beforeEnter: selectCompetence,
            children: [
              {
                name: 'route-competence-edit',
                path: 'details',
                component: () => import('@/views/competences/CompetenceEdit.vue'),
              },
            ],
          },
        ],
      },
      // roles
      {
        name: 'route-roles',
        path: 'roles',
        component: () => import('@/views/roles/Roles.vue'),
      },
      // scales
      {
        name: 'route-scales',
        path: 'scales',
        component: () => import('@/views/scales/Scales.vue'),
      },
      // branding
      {
        name: 'route-branding',
        path: 'branding',
        component: () => import('@/views/branding/Branding.vue'),
      },
    ],
  },
  {
    //name: 'route-employees',
    path: '/employees',
    beforeEnter: selectedCompanyCheck,
    components: {
      default: () => import('@/components/mains/EmptyMain.vue'),
      AppBar: () => import('@/components/appbars/MainBar.vue'),
      LeftSide: () => import('@/components/leftsides/ListLeftSideEmployees.vue'),
    },
    children: [
      {
        name: 'route-employees',
        path: '',
        component: () => import('@/views/employees/Employees.vue'),
      },
      {
        name: 'route-employees-import',
        path: 'import',
        component: () => import('@/views/employees/EmployeesImport.vue'),
      },
    ],
  },
  {
    name: 'route-integrations',
    path: '/integrations',
    beforeEnter: selectedCompanyCheck,
    components: {
      default: () => import('@/views/account/Integrations.vue'),
      AppBar: () => import('@/components/appbars/MainBar.vue'),
      LeftSide: () => import('@/components/leftsides/ListLeftSideEmployees.vue'),
    },
  },
  {
    name: 'route-errors',
    path: '/:pathMatch(.*)*',
    redirect: { name: 'page-not-found' },
    components: {
      default: () => import('@/components/mains/EmptyMain.vue'),
      AppBar: () => import('@/components/appbars/MainBar.vue'),
      LeftSide: () => import('@/components/leftsides/ListLeftSide360.vue'),
    },
    children: [
      {
        name: 'page-not-found',
        path: '',
        component: ErrorPage,
        props: { errorCode: 404 },
      },
      {
        name: 'error-page',
        path: '',
        component: ErrorPage,
        props: { errorCode: 500 },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, _from) => {
  const authStore = useAuthStore();
  if (to.path === '/login' && (await authStore.handleLoginRedirect())) {
    return { path: authStore.initialUrl, replace: true, force: true };
  }

  if (authStore.isAuthenticated) return;

  authStore.startLogin(to.path);
  return false;
});

export default router;
