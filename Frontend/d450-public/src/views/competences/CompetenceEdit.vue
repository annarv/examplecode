<script lang="ts" src="./CompetenceEdit.ts"></script>

<template>
  <VCard :title="isNew ? 'Создание компетенции' : 'Редактирование компетенции'">
    <template v-slot:append>
      <VBtn variant="outlined" class="v-btn__primary" :disabled="!isSaveEnabled" @click="save">Сохранить</VBtn>
    </template>
    <VDivider></VDivider>
    <VLabel>Название компетенции</VLabel>
    <VTextField
      variant="solo"
      v-model.trim="editCompetence.name"
      density="compact"
      :rules="[(v) => !!v || 'Название должно быть заполнено']"
    ></VTextField>
    <VLabel>Описание компетенции</VLabel>
    <VTextarea
      variant="solo"
      no-resize
      v-model.trim="editCompetence.description"
      clearable
      density="compact"
    ></VTextarea>
  </VCard>

  <VCard title="Индикаторы">
    <VDivider></VDivider>
    <VList>
      <VListItem v-for="(item, idx) in editCompetence.indicators" :key="idx">
        <div class="d-flex justify-space-between align-center">
          <VListItemTitle class="list-title-point edit">
            <VTextarea
              :rules="[(v) => !!v || 'Название должно быть заполнено']"
              label=""
              rows="3"
              v-model.trim="item.name"
              variant="outlined"
              density="compact"
              hide-details="auto"
            ></VTextarea>
          </VListItemTitle>
          <VListItemAction>
            <VBtn variant="plain" size="x-small" icon="mdi-delete" @click="removeIndicator(idx)"></VBtn>
          </VListItemAction>
        </div>
      </VListItem>
      <VListItem>
        <VListItemTitle class="edit">
          <VBtn variant="plain" size="x-small" icon="mdi-plus" class="btn-plus" @click="createIndicator()"></VBtn>
        </VListItemTitle>
      </VListItem>
    </VList>
  </VCard>
</template>
