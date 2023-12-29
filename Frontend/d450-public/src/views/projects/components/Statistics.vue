<script lang="ts" src="./Statistics.ts"></script>

<template>
  <VDivider></VDivider>
  <div style="
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-content: center;
    align-items: center">
    <div style="
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: space-between;
      width: 20%;
    ">
      Прогресс оценки
      <VProgressCircular :rotate="360" :size="70" :width="8" :model-value="stats.progressPercentage" label="Прогресс оценки" style="margin: 5px;">
        <template v-slot:default> {{ stats.progressPercentage }} % </template>
      </VProgressCircular>
    </div>
    <VList style="width: 80%;">
      <VListItem>
        <VRow>
          <VCol cols="3">Оцениваемых</VCol><VCol cols="3">{{ stats.assignmentsCount }}</VCol>
          <VCol cols="3">Назначений</VCol><VCol cols="3">{{ stats.assessmentsCount }}</VCol>
        </VRow>
        <VRow>
          <VCol cols="3">Оценка завершена</VCol><VCol cols="3">{{ stats.finishedAssignmentsCount }}</VCol>
          <VCol cols="3">Пройдено</VCol><VCol cols="3">{{ stats.assessmentsClosedCount }}</VCol>
        </VRow>
        <VRow>
          <VCol cols="3">Нет самооценки</VCol><VCol cols="3">{{ stats.assignmentsWithOpenSelfRoleCount }}</VCol>
          <VCol cols="3">Не пройдено</VCol><VCol cols="3">{{ stats.assessmentsOpenedCount }}</VCol>
        </VRow>
      </VListItem>
    </VList>
  </div>
</template>
