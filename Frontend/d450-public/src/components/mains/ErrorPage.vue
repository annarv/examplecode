<script lang="ts" src="./ErrorPage.ts"></script>

<template>
  <VCard v-if="isNotFoundPage" title="Ошибка 404">
    <VDivider></VDivider>
    <VCardText>Страница не найдена</VCardText>
  </VCard>
  <VCard v-else title="Упс!">
    <VDivider></VDivider>
    <VCardText>Что-то пошло не так</VCardText>
  </VCard>
</template>
