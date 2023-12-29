<script lang="ts" src="./RespondentPicker.ts"></script>

<template>
  <VDialog v-model="respondentDialog" width="auto" min-width="600" transition="fade-transition">
    <VCard :title="selectedRespondentId ? 'Редактирование респондента' : 'Новый респондент'">
      <template v-slot:append>
        <VBtn variant="plain" icon="mdi-close" @click="respondentDialog = false"></VBtn>
      </template>
      <VCardText>
        <VSelect
          density="compact"
          label="Выберите роль"
          v-model="respondentForm.roleId"
          @update:model-value="changeAssignmentRole"
          :items="selectedRespondentId ? filteredRoles : allRoles"
          item-title="name"
          item-value="id"
          variant="solo"
        ></VSelect>
        <VAutocomplete
          v-if="!selectedRespondentId"
          density="compact"
          clearable
          label="Список сотрудников"
          placeholder="Поиск"
          no-data-text="Сотрудник не найден"
          v-model="respondentForm.employeeId"
          v-model:search="employeeSearch"
          :items="employees"
          item-title="name"
          item-value="id"
          variant="solo"
        >
          <template v-if="employees.length === employeesPageSize" v-slot:append-item>
            <div class="option-item">...</div>
          </template>
        </VAutocomplete>
      </VCardText>
      <VCardActions>
        <VBtn variant="outlined" class="v-btn__primary" @click="saveRespondent">
          {{ selectedRespondentId ? 'Сохранить' : 'Добавить' }}
        </VBtn>
        <VBtn variant="outlined" class="v-btn__secondary" @click="respondentDialog = false">Отмена</VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
