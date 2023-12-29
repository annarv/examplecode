<script lang="ts" src="./ProjectLoader.ts"></script>

<template>
  <VCard class="card-title-pencil" :title="projectView.name" :subtitle="'Шкала: ' + projectView.scaleName">
    <VContainer style="
      display: flex;
      flex-direction: column;
      align-items: center;
    ">
      <VProgressLinear
        indeterminate
        color="black"
        class="mb-0"
        rounded>
      </VProgressLinear>
      <VChip style="margin: 16px">...ожидание...</VChip>
    </VContainer>
  </VCard>
</template>
