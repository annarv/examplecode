import { create } from 'domain';

<script lang="ts" src="./ChooseCompany.ts"></script>

<template>
  <VCard title="Список компаний" class="mw-1024">
    <template v-slot:append>
      <VBtn variant="outlined" class="v-btn__secondary">
        Создать компанию
        <VDialog activator="parent" width="auto" transition="fade-transition">
          <template v-slot="{ isActive }">
            <VCard title="Новая компания">
              <template v-slot:append>
                <VBtn variant="plain" icon="mdi-close" @click="isActive.value = false"></VBtn>
              </template>
              <VCardText>
                <VLabel>Название</VLabel>
                <VTextField
                  v-model.trim="nameCompany"
                  density="compact"
                  variant="solo"
                  class="w-320"
                  hide-details="auto"
                ></VTextField>
              </VCardText>
              <VCardActions>
                <VBtn variant="outlined" class="v-btn__primary" @click="create(isActive)">Создать</VBtn>
                <VBtn variant="outlined" class="v-btn__secondary" @click="isActive.value = false">Отмена</VBtn>
              </VCardActions>
            </VCard>
          </template>
        </VDialog>
      </VBtn>
    </template>
    <VDivider></VDivider>
    <VCardText class="mw-400">
      <VTextField
        v-model="searchText"
        v-debounce:300="onSearchInputEvent"
        @click:clear="onSearchInputEvent"
        density="compact"
        variant="solo"
        rounded
        hide-details
        placeholder="Поиск по компаниям"
        append-inner-icon="mdi-magnify"
        single-line
        clearable
      ></VTextField>
    </VCardText>
  </VCard>

  <VSheet class="mw-1024">
    <VList>
      <VListSubheader>Название</VListSubheader>
      <VListItem v-for="item in companies" :key="item.value" :value="item">
        <div class="d-flex justify-space-between align-center">
          <VListItemTitle v-text="item.title" @click="choose(item.value)"></VListItemTitle>
          <VListItemAction>
            <VBtn variant="plain" size="x-small" icon="mdi-pencil" @click="editGet(item.value)"></VBtn>
            <VBtn variant="plain" size="x-small" icon="mdi-delete" @click="dialogDelete = true"></VBtn>
          </VListItemAction>
        </div>
      </VListItem>
    </VList>
    <VPagination
      v-if="isVisiblePaging()"
      v-model="page"
      :length="totalPage"
      total-visible="7"
    ></VPagination>
  </VSheet>

  <VDialog v-model="dialogEdit" width="auto" transition="fade-transition">
    <VCard title="Редактирование компании">
      <template v-slot:append>
        <VBtn variant="plain" icon="mdi-close" @click="dialogEdit = false"></VBtn>
      </template>
      <VCardText>
        <VLabel>Название</VLabel>
        <VTextField
          density="compact"
          variant="solo"
          v-model.trim="nameCompany"
          class="w-320"
        ></VTextField>
      </VCardText>
      <VCardActions>
        <VBtn variant="outlined" class="v-btn__primary" @click="editPost">Изменить</VBtn>
        <VBtn variant="outlined" class="v-btn__secondary" @click="dialogEdit = false">Отмена</VBtn>
      </VCardActions>
    </VCard>
  </VDialog>

  <VDialog v-model="dialogDelete" width="auto" transition="fade-transition">
    <VCard title="Удаление компании">
      <template v-slot:append>
        <VBtn variant="plain" icon="mdi-close" @click="dialogDelete = false"></VBtn>
      </template>
      <VCardText>
        <p>Вы действительно хотите удалить компанию:</p>
        <p><b>Название компании</b></p>
      </VCardText>
      <VCardActions>
        <VBtn variant="outlined" class="v-btn__primary">Удалить</VBtn>
        <VBtn variant="outlined" class="v-btn__secondary" @click="dialogDelete = false">Отмена</VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
