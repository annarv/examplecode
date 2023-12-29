<script lang="ts" src="./Roles.ts"></script>

<template>
  <VCard title="Список ролей">
    <template v-slot:append>
      <VBtn variant="outlined" class="v-btn__secondary">
        Добавить роль
        <VDialog activator="parent" width="auto" transition="fade-transition">
          <template v-slot="{ isActive }">
            <VCard title="Новая роль">
              <template v-slot:append>
                <VBtn variant="plain" icon="mdi-close" @click="isActive.value = false"></VBtn>
              </template>
              <VCardText>
                <VLabel>Название</VLabel>
                <VTextField v-model.trim="roleName" density="compact" variant="solo" class="w-320"></VTextField>
              </VCardText>
              <VCardActions>
                <VBtn variant="outlined" class="v-btn__primary" @click="create(isActive)">Создать</VBtn>
                <VBtn variant="outlined" class="v-btn__secondary" @click="isActive.value = false">Отмена</VBtn>
              </VCardActions>
            </VCard>
          </template>
        </VDialog>
      </VBtn>
    </template>
  </VCard>

  <VSheet>
    <VList v-if="roles.length > 0" class="mw-400">
      <VListSubheader>Название</VListSubheader>
      <VListItem v-for="item in roles" :key="item.value" :value="item">
        <div class="d-flex justify-space-between align-center">
          <VListItemTitle v-text="item.title"></VListItemTitle>
          <VListItemAction>
            <VBtn variant="plain" size="x-small">
              <VIcon icon="mdi-pencil"></VIcon>
              <VDialog activator="parent" width="auto" transition="fade-transition">
                <template v-slot:default="{ isActive }">
                  <VCard title="Изменить роль">
                    <template v-slot:append>
                      <VBtn variant="plain" icon="mdi-close" @click="isActive.value = false"></VBtn>
                    </template>
                    <VCardText>
                      <VLabel>Название</VLabel>
                      <VTextField density="compact" variant="solo" class="w-320" v-model.trim="item.title"></VTextField>
                    </VCardText>
                    <VCardActions>
                      <VBtn class="v-btn__primary" variant="outlined" @click="edit(isActive, item.value, item.title)">Изменить</VBtn>
                      <VBtn class="v-btn__secondary" @click="isActive.value = false">Отменить</VBtn>
                    </VCardActions>
                  </VCard>
                </template>
              </VDialog>
            </VBtn>
            <VBtn variant="plain" size="x-small" icon="mdi-delete"></VBtn>
          </VListItemAction>
        </div>
      </VListItem>
    </VList>
    <VLabel class="label-empty" v-else>Добавленных ролей нет</VLabel>
  </VSheet>
</template>
