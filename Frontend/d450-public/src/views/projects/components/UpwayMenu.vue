<script lang="ts" src="./UpwayMenu.ts"></script>

<template>
  <VMenu location="bottom">
    <template v-slot:activator="{ props }">
      <VBtn v-bind="props" variant="outlined" class="v-btn__secondary mr-4">
        Upway
      </VBtn>
    </template>

    <VList>
      <VListItem v-if="isLoading">
        <VListItemTitle style="justify-content: center; display: flex">
          <VProgressCircular
            indeterminate
            color="primary"/>
        </VListItemTitle>
      </VListItem>
      <VListItem v-else>
        <VListItemTitle>
          <VBtn width="100%" variant="outlined" class="v-btn__secondary mr-4" @click="copyReport">Копировать отчёты</VBtn>
        </VListItemTitle>
        <VListItemTitle>
          <VBtn width="100%" variant="outlined" class="v-btn__secondary mr-4" @click="getZipResultsForUpway">Upway CSV результаты</VBtn>
        </VListItemTitle>
        <VListItemTitle>
          <VBtn width="100%" variant="outlined" class="v-btn__secondary mr-4" @click="getZipProjectForUpway">Upway CSV проект</VBtn>
        </VListItemTitle>
        <VListItemTitle>
          <VBtn width="100%" variant="outlined" class="v-btn__secondary mr-4" @click="getZipStatesForUpway">Upway CSV статусы</VBtn>
        </VListItemTitle>
      </VListItem>
    </VList>
  </VMenu>
</template>
