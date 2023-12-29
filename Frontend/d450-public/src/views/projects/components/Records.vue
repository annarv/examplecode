<script lang="ts" src="./Records.ts"></script>
<template>
  <VSheet>
    <VList class="mt-2">
      <VListSubheader>
        <VRow no-gutters>
          <VCol cols="4">Оцениваемый</VCol>
          <VCol cols="3">Оценка</VCol>
          <VCol cols="3">Отчёт</VCol>
          <VCol cols="2">Сформирован</VCol>
        </VRow>
      </VListSubheader>
      <VListItem v-for="(employeeRecord, ind) in employeeRecordPage.entities">
        <VRow no-gutters class="align-items">
          <VCol cols="4">
            {{ employeeRecord.employeeName }}
            <span class="title-small">{{ employeeRecord.employeeEmail }}</span>
          </VCol>
          <VCol cols="3">
            {{ employeeRecord.valueInfo }}
            <!-- <div class="flex__block flex__block-center">
              <VProgressLinear model-value="40" rounded :height="8" class="progress-option"></VProgressLinear>
              <span class="ml-2">3/5</span>
            </div> -->
          </VCol>
          <VCol cols="3">
            <VTooltip v-if="employeeRecord.hasPersonalReportFailed" text="Отчет не удалось построить">
              <VIcon icon="mdi-alert" color="red"></VIcon>
            </VTooltip>
            <VBtn
              class="icon-pdf"
              variant="text"
              @click="downloadPersonalReport(ind)"
              :disabled="!employeeRecord.hasPersonalReport"
            ></VBtn>
            <VBtn
              class="icon-regenerate"
              variant="text"
              @click.once="requestReport(ind)"
              :disabled="employeeRecord.hasPersonalReportRequested"
            ></VBtn>
          </VCol>
          <VCol cols="2"></VCol>
        </VRow>
      </VListItem>
    </VList>
    <VPagination
      v-if="employeeRecordPage.totalPages > 1"
      v-model="employeeRecordPage.page"
      total-visible="7"
      :length="employeeRecordPage.totalPages"
      @update:model-value="setEmployeeRecordPage"
    ></VPagination>
  </VSheet>
</template>
