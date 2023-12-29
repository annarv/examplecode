<script lang="ts" src="./AssignmentPicker.ts"></script>

<template>
  <VDialog width="auto" min-width="600" v-model="assignmentDialog" transition="fade-transition">
    <VCard :title="selectedAssignmentId ? 'Редактирование оцениваемого' : 'Новый оцениваемый'">
      <template v-slot:append>
        <VBtn variant="plain" icon="mdi-close" @click="assignmentDialog = false"></VBtn>
      </template>
      <VCardText>
        <VAutocomplete
          v-if="!selectedAssignmentId"
          clearable
          density="compact"
          label="Список сотрудников"
          placeholder="Поиск"
          no-data-text="Сотрудник не найден"
          v-model="assignmentForm.employeeId"
          v-model:search="employeeSearch"
          :items="employees"
          item-title="name"
          item-value="id"
          variant="solo"
        >
          <template v-if="employees.length == employeesPageSize" v-slot:append-item>
            <div class="option-item">...</div>
          </template>
        </VAutocomplete>
        <VAutocomplete
          clearable
          density="compact"
          label="Выберите МК"
          placeholder="Поиск"
          no-data-text="МК не найдена"
          v-model="assignmentForm.profileId"
          v-model:search="profilesSearch"
          :items="profiles"
          item-title="name"
          item-value="id"
          variant="solo"
        >
          <template v-if="profiles.length === profilesPageSize" v-slot:append-item>
            <div class="option-item">...</div>
          </template>
        </VAutocomplete>
      </VCardText>
      <VAlert
        v-for="error in errors"
        v-text="error"
        type="error"
        variant="tonal"
        style="margin-bottom: 16px"
      ></VAlert>
      <VCardActions>
        <VBtn
          variant="outlined"
          class="v-btn__primary"
          @click="saveAssignmnet"
          :disabled="!assignmentForm.profileId || !assignmentForm.employeeId"
        >
          {{ selectedAssignmentId ? 'Сохранить' : 'Добавить' }}
        </VBtn>
        <VBtn variant="outlined" class="v-btn__secondary" @click="assignmentDialog = false"> Отмена </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
