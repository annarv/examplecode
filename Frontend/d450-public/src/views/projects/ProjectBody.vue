<script lang="ts" src="./ProjectBody.ts"></script>

<template>
  <VSheet class="grid-list">
    <VTabs v-model="activeTab">
      <VTab :value="recordsTabName" v-if="showRecordsTab">Результаты</VTab>
      <VTab :value="assessmentsTabName" v-if="showAssessmentsTab">Оценки</VTab>
      <VTab :value="assignmentsTabName">Назначения</VTab>
    </VTabs>
    <VWindow v-model="activeTab">
      <VWindowItem :value="recordsTabName">
        <Records />
      </VWindowItem>
      <VWindowItem :value="assessmentsTabName">
        <Assessments />
      </VWindowItem>
      <VWindowItem :value="assignmentsTabName">
        <Assignments :draftMode="draftMode" />
      </VWindowItem>
    </VWindow>
  </VSheet>
</template>
