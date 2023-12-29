<script lang="ts" src="./ProfileDetails.ts"></script>

<template>
  <VCard title="Профиль оценки" class="card-title">

  <template v-slot:append>
    <VBtn variant="outlined" class="v-btn__secondary mr-4" @click="cancel">Отмена</VBtn>
    <VBtn variant="outlined" class="v-btn__primary" :disabled="!isValidProfile || !isSaveActive" @click="saveProfile">Сохранить</VBtn>
  </template>
  <VDivider></VDivider>
    <VCardText>
      <VLabel>Название</VLabel>
      <VTextField
          v-model.trim="selectedProfile.name"
          :rules="profileNameValidation"
          hide-details="auto"
          density="compact"
          variant="solo"
      ></VTextField>
    </VCardText>
  </VCard>
  <VCard title="Компетенции">
    <template v-slot:append>
      <VBtn variant="outlined" class="v-btn__secondary">
        Выбрать компетенции
        <VDialog activator="parent" width="auto" scrollable @update:model-value="addDialogOpen">
          <template v-slot="{ isActive }">
            <VCard title="Выбор компетенции в профиль">
              <template v-slot:append>
                <VBtn variant="plain" icon="mdi-close" @click="isActive.value = false"></VBtn>
              </template>
              <VCardText>
                <p>Выберите из списка существующих компетенций. Если Вы не нашли необходимую - создайте в
                <router-link tag="span" :to="{ name: 'route-competences-list' }">библиотеке компетенций</router-link>.
                </p>
                <VList class="list-checkbox" v-if="competencesPage.entities.length > 0">
                  <VListSubheader>Компетенция</VListSubheader>
                  <VListGroup icon="mdi-menu-down" class="list-group" v-for="item in competencesPage.entities">
                    <template v-slot:activator="{ props }">
                      <VListItem>
                        <div class="d-flex justify-space-between align-center">
                          <VListItemAction>
                            <VCheckboxBtn
                              :model-value="containedInProfileCompetences(item)"
                              @click="toggleCompetenceInProfile(item)"
                            ></VCheckboxBtn>
                          </VListItemAction>
                          <VListItemTitle v-bind="props">{{ item.name }}</VListItemTitle>
                        </div>
                      </VListItem>
                    </template>
                  </VListGroup>
                </VList>
                <VLabel class="label-empty" v-else>Добавленных компетенций нет</VLabel>
                <VPagination
                  v-if="competencesPage.totalPages > 1"
                  :v-model="competencesPage.page + 1"
                  @update:model-value="onSetPage"
                  :length="competencesPage.totalPages"
                  :total-visible="7"
                ></VPagination>
              </VCardText>
              <VCardActions>
                <VBtn variant="outlined" class="v-btn__secondary"
                  @click="() => { isActive.value = false; applyCompetencies() }"
                >Применить</VBtn>
              </VCardActions>
            </VCard>
          </template>
        </VDialog>
      </VBtn>
    </template>

    <VList v-if="selectedProfileCompetences.length > 0">
      <VListSubheader>Название</VListSubheader>
      <VListGroup icon="mdi-menu-down" class="list-group" v-for="(item, idx) in selectedProfileCompetences" :key="idx">
        <template v-slot:activator="{ props }">
          <VListItem>
            <div class="d-flex justify-space-between align-center">
              <VListItemTitle v-bind="props">{{ item.name }}</VListItemTitle>
              <VListItemAction>
                <VBtn variant="plain" size="x-small" icon="mdi-delete" @click="removeCompetenceInProfile(item)"></VBtn>
              </VListItemAction>
            </div>
          </VListItem>
        </template>
      </VListGroup>
    </VList>
    <VLabel v-else class="label-empty">Необходимо добавить компетенции</VLabel>
  </VCard>
</template>
