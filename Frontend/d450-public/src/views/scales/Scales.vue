<script lang="ts" src="./Scales.ts"></script>

<template>
  <VCard title="Список шкал">
    <template v-slot:append>
      <VBtn variant="outlined" class="v-btn__secondary" @click="openCreateUpdateDialog">
        Создать шкалу
      </VBtn>
    </template>
  </VCard>
  <VSheet>
    <VList v-if="scales.length > 0" class="mw-400">
      <VListSubheader>Название</VListSubheader>
      <VListItem v-for="(item, idx) in scales" :key="item.value" :value="item">
        <div class="d-flex justify-space-between align-center">
          <VListItemTitle v-text="item.title"></VListItemTitle>
          <VListItemAction>
            <VBtn
              variant="plain"
              size="x-small"
              icon="mdi-pencil"
              @click="openScaleForUpdate(idx)"
            ></VBtn>
            <!-- <VBtn variant="plain" size="x-small" icon="mdi-delete"></VBtn> -->
          </VListItemAction>
        </div>
      </VListItem>
    </VList>
    <VLabel class="label-empty" v-else>Добавленных шкал нет</VLabel>
  </VSheet>

  <VDialog v-model="createUpdateDialog" width="auto" scrollable  transition="fade-transition">
    <VCard :title="editableScale.id ? 'Редактирование шкалы' : 'Новая шкала'">
      <template v-slot:append>
        <VBtn variant="plain" icon="mdi-close" @click="createUpdateDialog = false"></VBtn>
      </template>
      <VCardText>
        <VLabel>Название</VLabel>
        <VTextField
          v-model="editableScale.name"
          density="compact"
          variant="solo"
          class="w-400"
        ></VTextField>
        <VList>
          <VListSubheader>
            <VRow>
              <VCol cols="9">Текст</VCol>
              <VCol cols="1">Вес</VCol>
              <VCol cols="2"></VCol>
            </VRow>
          </VListSubheader>
          <VListItem class="no-border">
            <VRow>
              <VCol cols="9">
                <VRow>
                  <VCol cols="9" class="pt-8">
                    <VTextField
                      density="compact"
                      variant="solo"
                      v-model="editableScale.nonsense.value"
                      :disabled="!editableScale.nonsense.isActive"
                    ></VTextField>
                  </VCol>
                  <VCol cols="3" class="pt-6">
                    <VSwitch
                      color="info"
                      :value="true"
                      v-model.trim="editableScale.nonsense.isActive"
                      inset
                      hide-details
                    ></VSwitch>
                  </VCol>
                </VRow>
              </VCol>
              <VCol cols="1"><span class="span-na">N/A</span></VCol>
              <VCol cols="2"></VCol>
            </VRow>
          </VListItem>
          <VListItem v-for="(_, idx) in editableScale.labels" :key="idx" class="no-border">
            <VRow>
              <VCol cols="9">
                <VTextField
                  density="compact"
                  variant="solo"
                  v-model="editableScale.labels[idx]"
                ></VTextField>
              </VCol>
              <VCol cols="1" class="align-center pt-6 text-nowrap">{{ idx + 1 }}</VCol>
              <VCol cols="2" class="pt-4">
                <VBtn
                  variant="plain"
                  size="x-small"
                  icon="mdi-delete"
                  @click="removeScaleItem(idx)"
                ></VBtn>
              </VCol>
            </VRow>
          </VListItem>
          <VListItem class="no-border">
            <VRow>
              <VCol cols="12">
                <VBtn variant="plain" size="x-small" @click="addScaleItem()">
                  <VIcon start icon="mdi-plus" size="x-small" ></VIcon> Добавить </VBtn>
              </VCol>
            </VRow>
          </VListItem>
        </VList>
      </VCardText>
      <VAlert
        v-for="error in errors.createUpdateScale"
        v-text="error"
        type="error"
        variant="tonal"
      ></VAlert>
      <VCardActions>
        <VBtn variant="outlined" class="v-btn__primary" @click="updateOrCreate()">
          {{ editableScale.id === null ? 'Создать' : 'Изменить' }}
        </VBtn>
        <VBtn variant="outlined" class="v-btn__secondary" @click="createUpdateDialog = false">
          Отмена
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
