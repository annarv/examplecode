<script lang="ts" src="./Competences.ts"></script>

<template>
  <VCard title="Список компетенций">
    <template v-slot:append>
      <VBtn variant="outlined" class="v-btn__secondary" :to="{ name: 'route-competence-create' }">
        Добавить компетенцию
      </VBtn>
    </template>
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
        placeholder="Поиск по компетенциям"
        append-inner-icon="mdi-magnify"
        single-line
        clearable
      ></VTextField>
    </VCardText>
  </VCard>

  <VSheet>
    <VList v-if="competencesPage.entities.length > 0">
      <VListSubheader>Название</VListSubheader>
      <VListGroup icon="mdi-menu-down" class="list-group" v-for="item in competencesPage.entities">
        <template v-slot:activator="{ props }">
          <VListItem>
            <div class="d-flex justify-space-between align-center">
              <VListItemTitle v-bind="props" class="list-title-arrow">{{ item.name }}</VListItemTitle>
              <VListItemAction>
                <VBtn
                  variant="plain"
                  size="x-small"
                  icon="mdi-pencil"
                  :to="{ name: 'route-competence-edit', params: { id: item.id } }"
                ></VBtn>
                <!-- <VBtn variant="plain" size="x-small" icon="mdi-delete" @click="dialogDelete = true"></VBtn> -->
              </VListItemAction>
            </div>
          </VListItem>
        </template>
        <VListItem v-if="item.indicators?.length > 0" v-for="indicator in item.indicators">
          <VListItemTitle class="list-title-point">{{ indicator.name }}</VListItemTitle>
        </VListItem>
        <VListItemTitle class="label-empty" v-else>Добавленных индикаторов нет</VListItemTitle>
      </VListGroup>
    </VList>
    <VLabel class="label-empty" v-else>Добавленных компетенций нет</VLabel>
    <VPagination
      v-if="competencesPage.totalPages > 1"
      v-model="competencesPage.page"
      total-visible="7"
      :length="competencesPage.totalPages"
      @update:model-value="setPage"
    ></VPagination>
  </VSheet>

  <!-- <VDialog v-model="dialogDelete" width="auto">
    <VCard title="Удаление компетенции">
      <template v-slot:append>
        <VBtn variant="plain" icon="mdi-close" @click="dialogDelete = false"></VBtn>
      </template>
      <VCardText>
        <p>Вы действительно хотите удалить компетенцию:</p>
        <p><b>Название компетенции</b></p>
      </VCardText>
      <VCardActions>
        <VBtn variant="outlined" class="v-btn__primary">Удалить</VBtn>
        <VBtn variant="outlined" class="v-btn__secondary" @click="dialogDelete = false">Отмена</VBtn>
      </VCardActions>
    </VCard>
  </VDialog> -->
</template>
