<script lang="ts" src="./ProjectImport.ts"></script>

<template>
  <VCard v-if="allDataLoaded" title="Импорт назначений">
    <template v-slot:append>
      <VBtn variant="outlined" class="v-btn__secondary mr-4" @click="showCancelModal = true" v-if="importedFileId"
        >Отменить импорт</VBtn
      >
      <VBtn
        variant="outlined"
        class="v-btn__primary"
        @click="beforeSave"
        :disabled="!importedFileId || !selectedProfileId"
        v-if="importedFileId"
        >Сохранить</VBtn
      >
      <VDialog v-model="showSaveModal" persistent width="auto" transition="fade-transition">
        <VCard title="Подтверждение импорта">
          <VCardText>
            <p class="mb-4">
              <b>{{ summary?.toBeProcessed }} из {{ summary?.total }}</b> назначений будет добавлено.
            </p>
            <p>Назначения, у которых есть конфликты и не выбрано действие - импортированы не будут.</p>
          </VCardText>

          <VCardActions>
            <VBtn class="v-btn__primary" variant="text" @click="save"> Сохранить </VBtn>
            <VBtn class="v-btn__secondary mr-4" variant="text" @click="showSaveModal = false"> Отмена </VBtn>
          </VCardActions>
        </VCard>
      </VDialog>
      <VDialog v-model="showCancelModal" persistent width="auto" transition="fade-transition">
        <VCard title="Подтверждение отмены импорта">
          <VCardText>
            <p class="mb-4">Несохраненные данные будут утеряны.</p>
          </VCardText>

          <VCardActions>
            <VBtn class="v-btn__primary" variant="text" @click="cancelImport"> Отменить </VBtn>
            <VBtn class="v-btn__secondary mr-4" variant="text" @click="showCancelModal = false"> Не отменять </VBtn>
          </VCardActions>
        </VCard>
      </VDialog>
    </template>
    <VDivider></VDivider>

    <VCardText v-if="!importedFileId">
      <div class="d-flex justify-space-between">
        <VFileInput
          clearable
          label="Загрузить файл"
          density="compact"
          variant="outlined"
          class="mr-8"
          v-model="assignmentsFile"
          @change="onFileChanged"
        ></VFileInput>

        <VBtn variant="text" href="../../files/Шаблон импорта назначений.xlsx" class="excel"> Скачать шаблон </VBtn>
      </div>

      <!-- Блок для вывода ошибок
      <VAlert
        title="Заголовок ошибки"
        text="действия которые нужно предпринять для устранения ошибки"
        type="error"
        variant="tonal"
      ></VAlert>-->
    </VCardText>
    <VCardText v-else>
      <div class="d-flex align-center">
        <div class="mr-6">
          Всего записей: <b>{{ summary?.total }}</b>
        </div>
        <div class="mr-6">
          Конфликтов: <b>{{ summary?.conflictsTotal }}</b>
        </div>
        <div>
          Готовы к добавлению: <b>{{ summary?.toBeProcessed }}</b>
        </div>
      </div>
    </VCardText>
  </VCard>

  <VSheet v-if="allDataLoaded" class="grid-list">
    <VLabel v-if="!importedFileId" class="label-empty">Загрузите файл для предпросмотра</VLabel>

    <VRow v-if="importedFileId && !selectedProfileId">
      <VCol>
        <VLabel>Необходимо выбрать модель компетенций для импорта</VLabel>
      </VCol>
    </VRow>
    <VRow v-if="importedFileId">
      <VCol cols="4">
        <VSelect
          :items="profiles"
          v-model="selectedProfileId"
          density="compact"
          label="Выберите модель компетенций"
          variant="outlined"
          single-line
          persistent-hint
          hide-details="auto"
          @update:model-value="changeProfile"
        ></VSelect>
      </VCol>
    </VRow>
    <VList v-if="importedFileId && selectedProfileId">
      <VListSubheader>
        <VRow no-gutters class="align-items">
          <VCol cols="3">Оцениваемый</VCol>
          <VCol cols="3">Респондент</VCol>
          <VCol cols="2">Роль</VCol>
          <VCol cols="4">Действия</VCol>
        </VRow>
      </VListSubheader>
      <VListItem v-for="(asmnt, idx) in assignments">
        <VRow no-gutters class="align-items">
          <VCol cols="3" style="padding-bottom: 0px">{{ asmnt.employeeEmail }}</VCol>
          <VCol cols="3" style="padding-bottom: 0px">{{ asmnt.respondentEmail }}</VCol>
          <VCol cols="2" style="padding-bottom: 0px">{{ asmnt.roleName }}</VCol>
          <VCol cols="4" style="padding-bottom: 0px">
            <VSelect
              :items="asmnt.possibleActionsAdapter"
              :disabled="asmnt.hasWarning"
              v-model="asmnt.selectedActionAdapter"
              density="compact"
              label="Выберите действие"
              variant="outlined"
              single-line
              persistent-hint
              @update:model-value="() => (asmnt.hasConflict = true)"
            ></VSelect>
          </VCol>
        </VRow>
        <VRow no-gutters class="align-items">
          <VCol style="padding-top: 0px">
            <VAlert
              style="padding-top: 0px"
              v-if="asmnt.hasWarning"
              :text="statesToText(asmnt.state)"
              type="warning"
              variant="text"
            ></VAlert>
          </VCol>
          <VCol style="padding-right: 16px">
            <div style="display: flex; width: 100%; flex-direction: row; justify-content: flex-end">
              <VBtn
                v-if="asmnt.hasConflict"
                variant="outlined"
                class="v-btn__secondary ml-4"
                @click="acceptAction(asmnt)"
                >OK</VBtn
              >
            </div>
          </VCol>
        </VRow>
      </VListItem>
    </VList>

    <VPagination
      v-if="importedFileId && selectedProfileId && isVisiblePaging"
      v-model="page"
      :length="totalPage"
      :total-visible="7"
    ></VPagination>
  </VSheet>

  <v-dialog v-model="isLoading" :scrim="true" persistent width="10%">
    <v-card>
      <v-progress-linear indeterminate color="black" class="mb-0"> </v-progress-linear>
    </v-card>
  </v-dialog>
</template>
