<template>
  <h1>{{t('setupDifficultyLevel.title')}}</h1>

  <ChallengeCards/>

  <router-link to="/setupGame" class="btn btn-primary btn-lg mt-4">
    {{t('setupGame.title')}}
  </router-link>

  <FooterButtons endGameButtonType="abortGame"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import ChallengeCards from '@/components/setup/ChallengeCards.vue'
import FooterButtons from '@/components/structure/FooterButtons.vue'

export default defineComponent({
  name: 'SetupDifficultyLevel',
  components: {
    ChallengeCards,
    FooterButtons
  },
  setup() {
    const { t } = useI18n()
    return { t }
  }
})
</script>
