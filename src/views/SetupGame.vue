<template>
  <h1>{{t('setupGame.title')}}</h1>

  <SetupGameInstructions/>

  <router-link to="/setupGame" class="btn btn-primary btn-lg mt-2">
    {{t('action.startGame')}}
  </router-link>

  <FooterButtons backButtonRouteTo="/setupDifficultyLevel" endGameButtonType="abortGame"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import FooterButtons from '@/components/structure/FooterButtons.vue'
import SetupGameInstructions from '@/components/setup/SetupGameInstructions.vue'

export default defineComponent({
  name: 'SetupGame',
  components: {
    FooterButtons,
    SetupGameInstructions
  },
  setup() {
    const { t } = useI18n()
    return { t }
  }
})
</script>
