<script lang="ts" src="./Profiles.ts"></script>

<template>
  <VCard title="Список профилей оценки">
    <template v-slot:append>
      <VBtn variant="outlined" class="v-btn__secondary" @click="createProfile">Добавить профиль</VBtn>
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
        placeholder="Поиск профиля оценки"
        append-inner-icon="mdi-magnify"
        single-line
        clearable
      ></VTextField>
    </VCardText>
  </VCard>

  <VSheet>
    <VList v-if="profilesPage.entities.length > 0">
      <VListSubheader>Название</VListSubheader>
      <VListItem v-for="item in profilesPage.entities">
        <div class="d-flex justify-space-between align-center">
          <VListItemTitle v-text="item.name"></VListItemTitle>
          <VListItemAction>
            <VBtn
              variant="plain"
              size="x-small"
              icon="mdi-pencil"
              :to="{ name: 'route-profile-details', params: { id: item.id } }"
            ></VBtn>
            <!--
            <VBtn variant="plain" size="x-small" icon="mdi-delete"></VBtn>
            -->
          </VListItemAction>
        </div>
      </VListItem>
    </VList>
    <VLabel class="label-empty" v-else>Профилей пока нет</VLabel>
    <VPagination
      v-if="profilesPage.totalPages > 1"
      v-model="profilesPage.page"
      total-visible="7"
      :length="profilesPage.totalPages"
      @update:model-value="setPage"
    ></VPagination>
  </VSheet>
</template>
