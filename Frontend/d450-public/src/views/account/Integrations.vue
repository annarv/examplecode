<script lang="ts" src="./Integrations.ts"></script>

<template>
  <VCard title="Интеграции" />

  <template v-for="adapter in adapters">
    <VCard :title="adapter.title">
      <VCardText>
        <VLabel>AccountId</VLabel>
        <VTextField
          density="compact"
          variant="solo"
          class="w-320"
          :disabled="adapter.connected"
          v-model="adapter.accountId"
        ></VTextField>
        <VLabel>SecretKey</VLabel>
        <VTextField
          v-if="!adapter.connected"
          density="compact"
          variant="solo"
          v-model="adapter.secretKey"
        ></VTextField>
        <VBtn
          variant="outlined"
          class="v-btn__primary"
          v-if="!adapter.connected"
          @click="setAdapter(adapter)"
        >
          Подключить аккаунт {{ adapter.title }}
        </VBtn>
      </VCardText>
    </VCard>
  </template>
</template>
