<script lang="ts" src="./Assessments.ts"></script>

<template>
  <VList>
    <VListSubheader>
      <VRow no-gutters>
        <VCol cols="3">Оцениваемый</VCol>
        <VCol cols="3">Респондент</VCol>
        <VCol cols="2">Роль</VCol>
        <VCol cols="2">Статус</VCol>
        <VCol cols="2"></VCol>
      </VRow>
    </VListSubheader>
    <VListItem v-for="assessment in assessmentPage.entities">
      <VRow no-gutters class="align-items">
        <VCol cols="3">
          {{ assessment.assessedName }}
          <span class="title-small">{{ assessment.assessedEmail }}</span>
        </VCol>
        <VCol cols="3">
          {{ assessment.respondentName }}
          <span class="title-small">{{ assessment.respondentEmail }}</span>
        </VCol>
        <VCol cols="2"
          >{{ assessment.role }} <span class="title-small">{{ assessment.profile }}</span></VCol
        >
        <VCol cols="2">
          <span :class="assessment.statusClass">{{ assessment.statusText }}</span>
        </VCol>
        <VCol cols="2">
          <VListItemAction class="justify-end item-action">
            <VBtn variant="plain" size="x-small" icon="mdi-pencil" disabled></VBtn>
            <VBtn variant="plain" size="x-small" icon="mdi-delete" disabled></VBtn>
          </VListItemAction>
        </VCol>
      </VRow>
    </VListItem>
  </VList>
  <VPagination
    v-if="assessmentPage.totalPages > 1"
    v-model="assessmentPage.page"
    total-visible="7"
    :length="assessmentPage.totalPages"
    @update:model-value="setAssessmentPage"
  ></VPagination>
</template>