<script lang="ts" src="./ProjectHeader.ts"></script>

<template>
  <VCard :title="projectView.name" :subtitle="'Шкала: ' + projectView.scaleName">
    <template v-slot:append>
      <VBtn style="margin-right: 24px" variant="plain" size="x-small" icon="mdi-pencil" v-if="projectView.canChangeProject"></VBtn>
      <VDialog
        activator="parent"
        width="auto"
        transition="fade-transition"
        @update:model-value="onProjectChanging"
        v-if="projectView.canChangeProject"
      >
        <template v-slot="{ isActive }">
          <VCard title="Изменить проект оценки">
            <template v-slot:append>
              <VBtn variant="plain" icon="mdi-close" @click="isActive.value = false"></VBtn>
            </template>
            <VCardText>
              <VTextField density="compact" variant="solo" label="Название" class="w-320" v-model.trim="projectEdit.name"></VTextField>
              <VSelect
                density="compact"
                label="Шкала"
                v-model="projectEdit.scaleId"
                item-title="name"
                item-value="id"
                variant="solo"
                :items="allScales"
              ></VSelect>
            </VCardText>
            <VCardActions>
              <VBtn
                variant="outlined"
                class="v-btn__primary"
                :disabled="projectEdit.name === '' || projectEdit.scaleId === ''"
                @click="updateProject(isActive)"
              >
                Изменить
              </VBtn>
              <VBtn variant="outlined" class="v-btn__secondary" @click="isActive.value = false">Отмена</VBtn>
            </VCardActions>
          </VCard>
        </template>
      </VDialog>
      <VBtn variant="outlined" class="v-btn__secondary mr-4" :to="{ name: 'route-projects' }">Назад</VBtn>
      <UpwayMenu v-if="!projectView.canChangeProject" />
      <VBtn variant="outlined" class="v-btn__primary" @click="startProject" v-if="projectView.canChangeProject">
        <VIcon icon="mdi-play" color="icon-white"></VIcon>
        Запустить проект
      </VBtn>
      <VBtn variant="outlined" class="v-btn__primary" @click="finishProject" v-if="projectView.canCloseProject">
        <VIcon icon="mdi-stop" color="icon-white"></VIcon>
        Завершить оценку
      </VBtn>
    </template>
    <Statistics />
  </VCard>
</template>
