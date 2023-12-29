<script lang="ts" src="./Employees.ts"></script>

<template>
  <VCard title="Список сотрудников">
    <template v-slot:append>
      <VBtn variant="outlined" class="v-btn__secondary mr-4" to="/employees/import"
        >Импортировать</VBtn
      >
      <VBtn variant="outlined" class="v-btn__secondary" @click="createUpdateDialog = true"
        >Добавить</VBtn
      >
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
        placeholder="Поиск сотрудника"
        append-inner-icon="mdi-magnify"
        single-line
        clearable
      ></VTextField>
    </VCardText>
  </VCard>

  <VSheet class="grid-list">
    <VList v-if="employees.length > 0">
      <VListSubheader>
        <VRow no-gutters>
          <VCol cols="5">Сотрудник</VCol>
          <VCol cols="5">Email</VCol>
          <VCol cols="2"></VCol>
        </VRow>
      </VListSubheader>
      <VListItem v-for="(empl, idx) in employees">
        <VRow no-gutters class="align-items">
          <VCol cols="5">{{ empl.fullName }}</VCol>
          <VCol cols="5">{{ empl.email }}</VCol>
          <VCol cols="2">
            <VListItemAction class="justify-end no-padding">
              <VBtn
                variant="plain"
                size="x-small"
                icon="mdi-pencil"
                @click="openEmployeeForUpdate(idx)"
              ></VBtn>
              <!-- <VBtn variant="plain" size="x-small" icon="mdi-delete"></VBtn> -->
            </VListItemAction>
          </VCol>
        </VRow>
      </VListItem>
    </VList>
    <VLabel class="label-empty" v-else>Добавленных сотрудников нет</VLabel>
    <VPagination
      v-if="isVisiblePaging()"
      v-model="page"
      :length="totalPage"
      :total-visible="7"
    ></VPagination>
  </VSheet>

  <VDialog v-model="createUpdateDialog" width="auto" transition="fade-transition">
    <VCard :title="editableEmpl.id ? 'Редактирование сотрудника' : 'Новый сотрудник'">
      <template v-slot:append>
        <VBtn variant="plain" icon="mdi-close" @click="createUpdateDialog = false"></VBtn>
      </template>
      <VCardText>
        <VLabel>Фамилия</VLabel>
        <VTextField
          density="compact"
          variant="solo"
          class="w-320"
          v-model="editableEmpl.surname"
        ></VTextField>
        <VLabel>Имя</VLabel>
        <VTextField
          density="compact"
          variant="solo"
          class="w-320"
          v-model="editableEmpl.name"
        ></VTextField>
        <VLabel>Отчество</VLabel>
        <VTextField
          density="compact"
          variant="solo"
          class="w-320"
          v-model="editableEmpl.middleName"
        ></VTextField>
        <VLabel>Email</VLabel>
        <VTextField
          density="compact"
          variant="solo"
          class="w-320"
          v-model.trim="editableEmpl.email"
        ></VTextField>
      </VCardText>
      <VAlert
        v-for="error in errors.createUpdateEmployee"
        v-text="error"
        type="error"
        variant="tonal"
      ></VAlert>
      <VCardActions>
        <VBtn variant="outlined" class="v-btn__primary" @click="updateOrCreate()">
          {{ editableEmpl.id === null ? "Создать" : "Обновить" }}
        </VBtn>
        <VBtn
          variant="outlined"
          class="v-btn__secondary"
          @click="createUpdateDialog = false"
        >
          Отмена
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
