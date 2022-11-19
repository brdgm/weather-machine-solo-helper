<template>
  <TurnSidebar :round="round"
      :player="navigationState.player"
      :current-report="navigationState.currentReport"
      :previous-report="navigationState.previousReport"
      :reports-left="navigationState.cardDeck.deck.length"
      :tokens="tokens"
      :citation-unlock="citationUnlock"
      :initiative-player="initiativePlayer"/>

  <h1>{{t('turnSaboteur.title')}}</h1>

  <ol>
    <li>
      <span v-html="t('turnSaboteur.moveSaboteur')"></span><br/>
      <AgentLocationSelection v-if="!selectedLocation" class="mt-2" :agent="currentReport.agent" :location="currentReport.location" @location-selected="locationSelected"/>
      <template v-else>
        <AgentLocationIcon class="mt-2" :agent="currentReport.agent" :location="selectedLocation" :action-slot="selectedActionSlot"/>
        <button class="btn btn-outline-secondary btn-sm" @click="unselectLocation">{{t('agentLocationSelection.reselect')}}</button>
      </template>
    </li>
    <template v-if="selectedLocation">
      <li v-if="selectedLocation != 'supply'" class="mt-2">
        <span v-html="t('turnSaboteur.raiseTargetValue')"></span><br/>
        <AppIcon name="saboteur-move-raise-target-value" class="saboteur-move-raise-target-value-icon"/>
      </li>
      <li class="mt-2">
        <span v-html="t('turnSaboteur.moveLativ')"></span><br/>
        <LativMovement/>
      </li>
      <li class="mt-2">
        <p v-html="t('turnSaboteur.performNefariousPlan')"></p>
        <NefariousPlanSupply v-if="selectedLocation=='supply'"/>
      </li>
      <li class="mt-2" v-html="t('turnSaboteur.wreakHavoc')"></li>
    </template>
  </ol>

  <button :disabled="!nextButtonEnabled" class="btn btn-primary btn-lg mt-2" @click="next()">
    {{t('action.next')}}
  </button>

  <FooterButtons :backButtonRouteTo="backButtonRouteTo" endGameButtonType="abortGame"/>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import FooterButtons from '@/components/structure/FooterButtons.vue'
import { useStore } from '@/store'
import { useRoute } from 'vue-router'
import NavigationState from '@/util/NavigationState'
import TurnSidebar from '@/components/turn/TurnSidebar.vue'
import LativMovement from '@/components/turn/LativMovement.vue'
import NefariousPlanSupply from '@/components/turn/NefariousPlanSupply.vue'
import Card from '@/services/Card'
import AppIcon from '@/components/structure/AppIcon.vue'
import AgentLocationSelection from '@/components/turn/AgentLocationSelection.vue'
import AgentLocationIcon from '@/components/structure/AgentLocationIcon.vue'
import Location from '@/services/enum/Location'
import ActionSlot from '@/services/enum/ActionSlot'

export default defineComponent({
  name: 'PhaseATurnSaboteur',
  components: {
    FooterButtons,
    TurnSidebar,
    LativMovement,
    AppIcon,
    AgentLocationSelection,
    AgentLocationIcon,
    NefariousPlanSupply
  },
  setup() {
    const { t } = useI18n()
    const store = useStore()
    const route = useRoute()

    const navigationState = new NavigationState(route, store.state)
    const round = navigationState.round
    const tokens = ref(navigationState.tokens)
    const citationUnlock = ref(navigationState.citationUnlock)
    const initiativePlayer = ref(navigationState.initiativePlayer)

    return { t, round, navigationState, tokens, citationUnlock, initiativePlayer }
  },
  data() {
    return {
      selectedLocation: undefined as Location|undefined,
      selectedActionSlot: undefined as ActionSlot|undefined
    }
  },
  computed: {
    nextButtonEnabled() : boolean {
      return this.selectedLocation != undefined
    },
    nextButtonRouteTo() : string {
      return `/round/${this.round}/phaseBExperiment`
    },
    backButtonRouteTo() : string {
      return `/round/${this.round}/phaseATurnPlayer`
    },
    currentReport() : Card {
      return this.navigationState.currentReport
    }
  },
  methods: {
    next() : void {
      this.$router.push(this.nextButtonRouteTo)
    },
    locationSelected(payload: {location:Location, actionSlot?:ActionSlot}) : void {
      this.selectedLocation = payload.location
      this.selectedActionSlot = payload.actionSlot
    },
    unselectLocation() : void {
      this.selectedLocation = undefined
      this.selectedActionSlot = undefined
    }
  }
})
</script>

<style lang="scss" scoped>
.saboteur-move-raise-target-value-icon {
  width: 10rem;
}
</style>