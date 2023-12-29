<script lang="ts" src="./EmployeesImport.ts"></script>

<template>
  <VCard title="Импорт сотрудников">
    <template v-slot:append>
      <VBtn variant="outlined" class="v-btn__secondary mr-4" @click="showCancelModal = true" v-if="importedFileExists">Отменить импорт</VBtn>
      <VBtn @click="beforeSave" variant="outlined" class="v-btn__primary" :disabled="!importedFileExists" v-if="importedFileExists">Сохранить</VBtn>
      <VDialog
        v-model="showSaveModal"
        persistent
        width="auto"
        transition="fade-transition"
      >
        <VCard title="Подтверждение импорта">
          <VCardText>
            <p class="mb-4"><b>{{ summary?.toBeProcessed }} из {{ summary?.total }}</b> сотрудников будет добавлено.</p>
            <p>Сотрудники, у которых есть конфликты и не выбрано действие - импортированы не будут. </p>
          </VCardText>

          <VCardActions>
            <VBtn
              class="v-btn__primary"
              variant="text"
              @click="save"
            >
              Сохранить
            </VBtn>
            <VBtn
              class="v-btn__secondary mr-4"
              variant="text"
              @click="showSaveModal = false"
            >
              Отмена
            </VBtn>
          </VCardActions>
        </VCard>
      </VDialog>
      <VDialog
        v-model="showCancelModal"
        persistent
        width="auto"
        transition="fade-transition"
      >
        <VCard title="Подтверждение отмены импорта">
          <VCardText>
            <p class="mb-4">Несохраненные данные будут утеряны.</p>
          </VCardText>

          <VCardActions>
            <VBtn
              class="v-btn__primary"
              variant="text"
              @click="cancelImport"
            >
              Отменить
            </VBtn>
            <VBtn
              class="v-btn__secondary mr-4"
              variant="text"
              @click="showCancelModal = false"
            >
              Не отменять
            </VBtn>
          </VCardActions>
        </VCard>
      </VDialog>
    </template>

    <VDivider></VDivider>

    <VCardText v-if="!importedFileExists">
      <VLabel>Загрузить файл</VLabel>
      <VFileInput
        clearable
        density="compact"
        variant="outlined"
        v-model="employeeFile"
        @change="onFileChanged"
        prepend-icon=""
      ></VFileInput>
      <VBtn variant="text" href="../../files/Шаблон импорта сотрудников.xlsx" class="excel"> Скачать шаблон </VBtn>
    </VCardText>
    <VCardText v-else>
      <div class="d-flex align-center">
        <div class="mr-6">Всего записей: <b>{{ summary?.total }}</b></div>
        <div class="mr-6">Конфликтов: <b>{{ summary?.conflictsTotal }}</b></div>
        <div>Готовы к добавлению: <b>{{ summary?.toBeProcessed }}</b></div>
      </div>
    </VCardText>
  </VCard>

  <VSheet class="grid-list">
    <VLabel v-if="!importedFileExists" class="label-empty">Загрузите файл для предпросмотра</VLabel>

    <VList v-if="importedFileExists">
      <VListSubheader>
        <VRow no-gutters>
          <VCol cols="4">Сотрудник</VCol>
          <VCol cols="4">Email</VCol>
          <VCol cols="4">Выберите действие</VCol>
        </VRow>
      </VListSubheader>

      <VListItem v-for="(empl, idx) in employees" :class="{ 'item-attention': empl.hasConflict }">
        <VRow no-gutters class="align-center">
          <VCol cols="4">{{ `${empl.lastName} ${empl.name} ${empl.middleName}` }}</VCol>
          <VCol cols="4">{{ empl.email }}</VCol>
          <VCol cols="4" class="select-min">
            <VSelect
              :items="empl.possibleActions"
              v-model="empl.selectedAction"
              variant="outlined"
              density="compact"
              hide-details
              @update:model-value="() => empl.hasConflict = true"
            ></VSelect>
            <VBtn v-if="empl.hasConflict" variant="outlined" class="v-btn__secondary ml-2" @click="acceptAction(empl.id)">OK</VBtn>
          </VCol>
        </VRow>
      </VListItem>
    </VList>

    <VPagination v-if="importedFileExists && isVisiblePaging" v-model="page" :length="totalPage" :total-visible="7"></VPagination>
  </VSheet>

  <VDialog
    v-model="isLoading"
    :scrim="true"
    persistent
    width="10%">
    <VCard>
      <VProgressLinear
        indeterminate
        color="black"
        class="mb-0">
      </VProgressLinear>
    </VCard>
  </VDialog>
</template>
