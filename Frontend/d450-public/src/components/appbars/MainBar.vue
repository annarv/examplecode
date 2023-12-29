<script lang="ts" src="./MainBar.ts"></script>

<template>

  <header>
    <VContainer fluid class="d-flex">
    <div class="logo"></div>
    <div class="menu d-flex justify-start">
      <VBtn
        v-for="item in nav"
        :to="item.link"
        class="icon"
        flat
        ><span class="icon" :class="item.icon"></span>{{ item.text }}</VBtn>
    </div>
    </VContainer>
  </header>
</template>
