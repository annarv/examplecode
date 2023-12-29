<script lang="ts" src="./ListLeftSide360.ts"></script>

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
