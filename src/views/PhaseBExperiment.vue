<template>
  <h1>{{t('experiment.title')}}</h1>

  <WeatherMachineExperiment :navigation-state="navigationState"/>

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
import Player from '@/services/enum/Player'
import WeatherMachineExperiment from '@/components/turn/WeatherMachineExperiment.vue'

export default defineComponent({
  name: 'PhaseBExperiment',
  components: {
    FooterButtons,
    WeatherMachineExperiment
  },
  setup() {
    const { t } = useI18n()
    const store = useStore()
    const route = useRoute()

    const navigationState = new NavigationState(route, store.state)
    const round = navigationState.round
    const lastRoundInitiativePlayer = navigationState.lastRoundInitiativePlayer

    return { t, round, lastRoundInitiativePlayer, navigationState }
  },
  computed: {
    nextButtonRouteTo() : string {
      return `/round/${this.round}/phaseCEndOfRound`
    },
    backButtonRouteTo() : string {
      if (this.lastRoundInitiativePlayer == Player.PLAYER) {
        return `/round/${this.round}/phaseATurnSaboteur`
      }
      else {
        return `/round/${this.round}/phaseATurnPlayer`
      }
    }
  }
})
</script>
