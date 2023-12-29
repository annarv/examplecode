<script lang="ts" src="./ListLeftSideEmployees.ts"></script>

<template>
  <VSheet class="sidebar">
    <VList>
      <VListItem
        v-for="item in subnav"
        :to="item.link"
        flat
        >{{ item.text }}</VListItem>
      </VList>
  </VSheet>
</template>
