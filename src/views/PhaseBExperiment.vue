<template>
  <h1>{{t('experiment.title')}}</h1>

  <WeatherMachineExperiment :navigation-state="navigationState"
      @experiment-phase-status="experimentPhaseStatus" @saboteur-research-token-gained="saboteurResearchTokenGained"/>

  <button class="btn btn-primary btn-lg mt-2" v-if="experimentPhaseCompleted" @click="next()">
    {{t('action.next')}}
  </button>

  <FooterButtons :backButtonRouteTo="backButtonRouteTo" endGameButtonType="abortGame"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import FooterButtons from '@/components/structure/FooterButtons.vue'
import { useStateStore } from '@/store/state'
import { useRoute } from 'vue-router'
import NavigationState from '@/util/NavigationState'
import Player from '@/services/enum/Player'
import WeatherMachineExperiment from '@/components/turn/WeatherMachineExperiment.vue'
import Weather from '@/services/enum/Weather'
import Location from '@/services/enum/Location'

export default defineComponent({
  name: 'PhaseBExperiment',
  components: {
    FooterButtons,
    WeatherMachineExperiment
  },
  setup() {
    const { t } = useI18n()
    const state = useStateStore()
    const route = useRoute()

    const navigationState = new NavigationState(route, state)
    const round = navigationState.round
    const lastRoundInitiativePlayer = navigationState.lastRoundInitiativePlayer

    return { t, state, round, lastRoundInitiativePlayer, navigationState }
  },
  data() {
    return {
      experimentPhaseCompleted: false,
      researchTokenGained: undefined as Weather|undefined
    }
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
  },
  methods: {
    next() : void {
      let token = undefined
      if (this.researchTokenGained != undefined) {
        token = {location:Location.LATIVS_LAB,weather:this.researchTokenGained}
      }
      this.state.roundWeatherExperimentToken({round:this.round+1,token})
      this.$router.push(this.nextButtonRouteTo)
    },
    experimentPhaseStatus(payload:{completed:boolean}) : void {
      this.experimentPhaseCompleted = payload.completed
    },
    saboteurResearchTokenGained(payload:{weather:Weather|undefined}) : void {
      this.researchTokenGained = payload.weather
    }
  }
})
</script>
