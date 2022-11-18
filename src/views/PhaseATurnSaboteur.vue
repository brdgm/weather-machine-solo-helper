<template>
  <h1>{{t('turnSaboteur.title')}}</h1>

  <router-link :to="nextButtonRouteTo" class="btn btn-primary btn-lg mt-2">
    {{t('action.next')}}
  </router-link>

  <FooterButtons :backButtonRouteTo="backButtonRouteTo" endGameButtonType="abortGame"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import FooterButtons from '@/components/structure/FooterButtons.vue'
import { useStore } from '@/store'
import { useRoute } from 'vue-router'
import NavigationState from '@/util/NavigationState'

export default defineComponent({
  name: 'PhaseATurnSaboteur',
  components: {
    FooterButtons
  },
  setup() {
    const { t } = useI18n()
    const store = useStore()
    const route = useRoute()

    const navigationState = new NavigationState(route, store.state)
    const round = navigationState.round

    return { t, round }
  },
  computed: {
    nextButtonRouteTo() : string {
      return `/round/${this.round}/phaseBExperiment`
    },
    backButtonRouteTo() : string {
      return `/round/${this.round}/phaseATurnPlayer`
    }
  }
})
</script>
