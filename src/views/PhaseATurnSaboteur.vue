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
      <li class="mt-2" v-if="saboteurActions">
        <p v-html="t('turnSaboteur.saboteurActions')"></p>
        <ol type="i">
          <li v-for="(actionStep,index) of saboteurActions.actionSteps" :key="index" class="mb-2">
            <component :is="actionStep.action" :action-step="actionStep"/>
          </li>
        </ol>
      </li>
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
import Card from '@/services/Card'
import AppIcon from '@/components/structure/AppIcon.vue'
import AgentLocationSelection from '@/components/turn/AgentLocationSelection.vue'
import AgentLocationIcon from '@/components/structure/AgentLocationIcon.vue'
import Location from '@/services/enum/Location'
import ActionSlot from '@/services/enum/ActionSlot'
import Player from '@/services/enum/Player'
import SaboteurActions from '@/services/SaboteurActions'
import ClaimInitiative from '@/components/turn/actions/ClaimInitiative.vue'
import GetAwardToken from '@/components/turn/actions/GetAwardToken.vue'
import GovernmentFlipSubsidy from '@/components/turn/actions/GovernmentFlipSubsidy.vue'
import GovernmentGetResearchToken from '@/components/turn/actions/GovernmentGetResearchToken.vue'
import GovernmentPlaceBotResearchPriority from '@/components/turn/actions/GovernmentPlaceBotResearchPriority.vue'
import GovernmentPlaceGearRemoveSubsidy from '@/components/turn/actions/GovernmentPlaceGearRemoveSubsidy.vue'
import GovernmentRunMachine from '@/components/turn/actions/GovernmentRunMachine.vue'
import IncreaseTargetValue from '@/components/turn/actions/IncreaseTargetValue.vue'
import LativsLabPayChemical from '@/components/turn/actions/LativsLabPayChemical.vue'
import LativsLabPlaceBotResearchPriority from '@/components/turn/actions/LativsLabPlaceBotResearchPriority.vue'
import RndGetResearchToken from '@/components/turn/actions/RndGetResearchToken.vue'
import RndPlaceBotPreviousReportPriority from '@/components/turn/actions/RndPlaceBotPreviousReportPriority.vue'
import RndPlaceBotResearchPriority from '@/components/turn/actions/RndPlaceBotResearchPriority.vue'
import RndPlaceChemical from '@/components/turn/actions/RndPlaceChemical.vue'
import TakeChemical from '@/components/turn/actions/TakeChemical.vue'
import UnlockCitation from '@/components/turn/actions/UnlockCitation.vue'

export default defineComponent({
  name: 'PhaseATurnSaboteur',
  components: {
    FooterButtons,
    TurnSidebar,
    LativMovement,
    AppIcon,
    AgentLocationSelection,
    AgentLocationIcon,
    ClaimInitiative,
    GetAwardToken,
    GovernmentFlipSubsidy,
    GovernmentGetResearchToken,
    GovernmentPlaceBotResearchPriority,
    GovernmentPlaceGearRemoveSubsidy,
    GovernmentRunMachine,
    IncreaseTargetValue,
    LativsLabPayChemical,
    LativsLabPlaceBotResearchPriority,
    RndGetResearchToken,
    RndPlaceBotPreviousReportPriority,
    RndPlaceBotResearchPriority,
    RndPlaceChemical,    
    TakeChemical,
    UnlockCitation
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
    const lastRoundInitiativePlayer = navigationState.lastRoundInitiativePlayer

    return { t, round, navigationState, tokens, citationUnlock, initiativePlayer, lastRoundInitiativePlayer }
  },
  data() {
    return {
      selectedLocation: undefined as Location|undefined,
      selectedActionSlot: undefined as ActionSlot|undefined,
      saboteurActions: undefined as SaboteurActions|undefined
    }
  },
  computed: {
    nextButtonEnabled() : boolean {
      return this.selectedLocation != undefined
    },
    nextButtonRouteTo() : string {
      if (this.lastRoundInitiativePlayer == Player.PLAYER) {
        return `/round/${this.round}/phaseBExperiment`
      }
      else {
        return `/round/${this.round}/phaseATurnPlayer`
      }
    },
    backButtonRouteTo() : string {
      if (this.lastRoundInitiativePlayer == Player.PLAYER) {
        return `/round/${this.round}/phaseATurnPlayer`
      }
      else if (this.round > 1) {
        return `/round/${this.round-1}/phaseCEndOfRound`
      }
      else {
        return ''
      }
    },
    currentReport() : Card {
      return this.navigationState.currentReport
    },
    previousReport() : Card {
      return this.navigationState.previousReport
    }
  },
  methods: {
    next() : void {
      this.$store.commit('claimInitiative', {round:this.round, player:this.initiativePlayer})
      this.$store.commit('round', {round: this.round+1,
          cardDeck: this.navigationState.cardDeck.toPersistence(),
          tokens: this.tokens,
          citationUnlock: this.citationUnlock})
      this.$router.push(this.nextButtonRouteTo)
    },
    locationSelected(payload: {location:Location, actionSlot?:ActionSlot}) : void {
      this.selectedLocation = payload.location
      this.selectedActionSlot = payload.actionSlot
      this.saboteurActions = new SaboteurActions({location:this.selectedLocation,
          actionSlot:this.selectedActionSlot, tokens:this.tokens, initiativePlayer:this.initiativePlayer,          
          selectionPriority:this.previousReport.selectionPriority,weatherPriority:this.previousReport.weather,
          citationUnlock:this.citationUnlock})
    },
    unselectLocation() : void {
      this.selectedLocation = undefined
      this.selectedActionSlot = undefined
      this.tokens = this.navigationState.tokens
      this.citationUnlock = this.navigationState.citationUnlock
      this.initiativePlayer = this.navigationState.initiativePlayer
      this.saboteurActions = undefined
    }
  }
})
</script>

<style lang="scss" scoped>
.saboteur-move-raise-target-value-icon {
  width: 10rem;
}
</style>