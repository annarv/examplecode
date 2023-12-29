<script lang="ts" src="./Assignments.ts"></script>

<template>
  <AssignmentPicker ref="assignmentPicker"/>
  <RespondentPicker ref="respondentPicker"/>
  <VSheet class="no-shadow">
    <VBtn variant="outlined" @click="addAssignment" class="v-btn__secondary mr-4">Добавить оцениваемого</VBtn>
    <VBtn
      v-if="draftMode"
      variant="outlined"
      class="v-btn__secondary"
      :to="{ name: 'route-project-import', params: { id: projectId } }"
      >Импортировать назначения</VBtn
    >
    <VList class="project-list" v-if="assignmentPage.entities.length !== 0">
      <VListSubheader>
        <div class="d-flex justify-space-between align-center">
          <div>Оцениваемых: {{ assignmentPage.total }}</div>
          <!-- <div>Назначений: 6</div> -->
        </div>
      </VListSubheader>

      <VListItem v-for="assigment in assignmentPage.entities">
        <div class="d-flex justify-space-between align-start">
          <div class="project-list-left">
            <VListItemTitle>{{ assigment.name }}</VListItemTitle>
            <VListItemSubtitle>{{ assigment.email }}</VListItemSubtitle>
            <VListItemSubtitle>
              <span>Модель компетенции:</span>
              {{ assigment.profileModel }}
            </VListItemSubtitle>
            <VListItemAction>
              <VBtn
                v-if="assigment.isDraft()"
                variant="plain"
                size="x-small"
                icon="mdi-pencil"
                @click="editAssignment(assigment.id)"
              ></VBtn>
              <VBtn v-if="assigment.isDraft()" variant="plain" size="x-small">
                <VIcon icon="mdi-delete"></VIcon>
                <VDialog activator="parent" width="auto" transition="fade-transition">
                  <template v-slot="{ isActive }">
                    <VCard title="Удаление назначения">
                      <template v-slot:append>
                        <VBtn variant="plain" icon="mdi-close" @click="isActive.value = false"></VBtn>
                      </template>
                      <VCardText>
                        <p>Вы действительно хотите удалить назначение?</p>
                      </VCardText>
                      <VCardActions>
                        <VBtn
                          variant="outlined"
                          class="v-btn__primary"
                          @click="removeAssignment(isActive, assigment.id)"
                        >
                          Удалить
                        </VBtn>
                        <VBtn variant="outlined" class="v-btn__secondary" @click="isActive.value = false">
                          Отмена
                        </VBtn>
                      </VCardActions>
                    </VCard>
                  </template>
                </VDialog>
              </VBtn>
            </VListItemAction>
            <VListItemAction v-if="!draftMode && assigment.isDraft() && assigment.respondents.length > 0">
              <VProgressLinear
                v-if="startingAssignments.find((i) => i.id === assigment.id)"
                rounded
                indeterminate
                class="mb-0"
              >
              </VProgressLinear>
              <VBtn v-else variant="outlined" class="v-btn__primary" @click="startAssignment(assigment.id)">
                <VIcon icon="mdi-play" color="icon-white"></VIcon>
                Запустить
              </VBtn>
            </VListItemAction>
          </div>
          <div class="project-list-right">
            <VList>
              <VListItem v-for="respondent in assigment.respondents">
                <div class="d-flex justify-space-between align-center">
                  <VListItemTitle>
                    {{ respondent.name }}
                    <span class="title-email">{{ respondent.email }}</span>
                  </VListItemTitle>
                  <VListItemSubtitle>{{ respondent.role }}</VListItemSubtitle>
                  <VListItemAction v-if="!startingAssignments.find((i) => i.id === assigment.id)">
                    <VBtn
                      v-if="respondent.isDraft && !assigment.isDraft()"
                      variant="outlined"
                      class="v-btn__primary"
                      @click="startRespondent(assigment.id, respondent.employeeId)"
                    >
                      <VIcon icon="mdi-play" color="icon-white"></VIcon>
                      Запустить
                    </VBtn>
                    <VBtn
                      v-if="respondent.isDraft"
                      variant="plain"
                      size="x-small"
                      icon="mdi-pencil"
                      @click="editRespondent(assigment.id, respondent.employeeId)"
                    ></VBtn>
                    <VBtn v-if="respondent.isDraft" variant="plain" size="x-small">
                      <VIcon icon="mdi-delete"></VIcon>
                      <VDialog activator="parent" width="auto" transition="fade-transition">
                        <template v-slot="{ isActive }">
                          <VCard title="Удаление респондента">
                            <template v-slot:append>
                              <VBtn variant="plain" icon="mdi-close" @click="isActive.value = false"></VBtn>
                            </template>
                            <VCardText>
                              <p>Вы действительно хотите удалить респондента?</p>
                            </VCardText>
                            <VCardActions>
                              <VBtn
                                variant="outlined"
                                class="v-btn__primary"
                                @click="removeRespondent(isActive, assigment.id, respondent.employeeId)"
                              >
                                Удалить
                              </VBtn>
                              <VBtn variant="outlined" class="v-btn__secondary" @click="isActive.value = false">
                                Отмена
                              </VBtn>
                            </VCardActions>
                          </VCard>
                        </template>
                      </VDialog>
                    </VBtn>
                  </VListItemAction>
                </div>
              </VListItem>
            </VList>
            <VBtn
              variant="plain"
              size="x-small"
              icon="mdi-plus"
              class="btn-plus"
              @click="addRespondent(assigment.id)"
            ></VBtn>
          </div>
        </div>
      </VListItem>
    </VList>
    <VPagination
      v-if="assignmentPage.totalPages > 1"
      v-model="assignmentPage.page"
      total-visible="7"
      :length="assignmentPage.totalPages"
      @update:model-value="setAssignmentPage"
    ></VPagination>
  </VSheet>
</template>
