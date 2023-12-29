<script lang="ts" src="./Projects.ts"></script>

<template>
  <VCard title="Проекты оценки" subtitle="">
    <template v-slot:append>
      <VBtn variant="outlined" class="v-btn__secondary">Добавить проект оценки</VBtn>
      <VDialog activator="parent" width="auto" transition="fade-transition">
        <template v-slot="{ isActive }">
          <VCard title="Новый проект оценки">
            <template v-slot:append>
              <VBtn variant="plain" icon="mdi-close" @click="closeAndClearCreationProjectDialog(isActive)"></VBtn>
            </template>
            <VCardText>
              <VLabel>Название</VLabel>
              <VTextField
                density="compact"
                variant="solo"
                class="w-320"
                v-model.trim="projectForm.name"
              ></VTextField>
              <VLabel>Шкала</VLabel>
              <VSelect
                density="compact"
                v-model="projectForm.scaleId"
                :items="scales"
                item-title="name"
                item-value="id"
                variant="solo"
              ></VSelect>
            </VCardText>
            <VCardActions>
              <VBtn
                variant="outlined"
                class="v-btn__primary"
                :disabled="projectForm.name === '' || projectForm.scaleId === ''"
                @click="createProject(isActive)"
              >
                Создать
              </VBtn>
              <VBtn variant="outlined" class="v-btn__secondary" @click="closeAndClearCreationProjectDialog(isActive)">
                Отмена
              </VBtn>
            </VCardActions>
          </VCard>
        </template>
      </VDialog>
    </template>
    <div class="info">
      Прежде чем создать проект оценки убедитесь, что внесли в систему список сотрудников,<br />
      шкалы, роли, есть необходимые компетенции и модели
    </div>
    <VDivider></VDivider>
    <VCardText class="mw-400">
      <VTextField
        v-model="searchText"
        v-debounce:500="onSearchInputEvent"
        @click:clear="onSearchInputEvent"
        density="compact"
        variant="solo"
        rounded
        hide-details
        placeholder="Поиск по проектам оценки"
        append-inner-icon="mdi-magnify"
        single-line
        clearable
      ></VTextField>
    </VCardText>
  </VCard>

  <VSheet>
    <VList v-if="projectsPage.entities.length > 0">
      <VListSubheader>Название</VListSubheader>
      <VListItem
        v-for="item in projectsPage.entities"
        :to="{ name: 'route-project-details', params: { id: item.project.id } }"
      >
        <div class="d-flex justify-space-between align-center">
          <!-- Если проект не запущен, то переход на ProjectsDetail, иначе ProjectsDetailRunning -->
          <VListItemTitle class="like-link">{{ item.project.name }}</VListItemTitle>

          <!-- Статусы -->
          <v-chip label size="x-small" :class="['chip', item.view.statusClass]" :variant="item.view.statusVariant">
            {{ item.view.statusName }}
          </v-chip>

          <!--
            <v-chip variant="text" label size="x-small" class="chip">Черновик</v-chip>
          -->
          <!--
          <v-chip variant="text" label size="x-small" class="chip _green">Запущен</v-chip>
          -->
          <!--
          <v-chip variant="text" label size="x-small" class="chip _blue">Завершен</v-chip>
          -->

          <VListItemAction>
            <VBtn
              variant="plain"
              size="x-small"
              icon="mdi-pencil"
              :to="{ name: 'route-project-details', params: { id: item.project.id } }"
            ></VBtn>
            <!-- <VBtn variant="plain" size="x-small" icon="mdi-delete"></VBtn> -->
          </VListItemAction>
        </div>
      </VListItem>
    </VList>
    <VLabel class="label-empty" v-else>Добавленных проектов нет</VLabel>
    <VPagination
      v-if="projectsPage.totalPages > 1"
      v-model="projectsPage.page"
      total-visible="7"
      :length="projectsPage.totalPages"
      @update:model-value="setPage"
    ></VPagination>
  </VSheet>
</template>
