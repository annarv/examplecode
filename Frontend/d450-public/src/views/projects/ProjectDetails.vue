<script lang="ts" src="./ProjectDetails.ts"></script>

<template>
  <ProjectLoader v-if="projectState === 'wait'"/>
  <div v-else>
    <ProjectHeader/>
    <ProjectBody/>
  </div>
</template>
