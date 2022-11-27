<template>
  <TurnSidebar :round="round"
      :player="navigationState.player"
      :current-report="currentReport"
      :previous-report="previousReport"
      :reports-left="cardDeck.deck.length"
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
          <li v-for="(actionStep,index) of saboteurActions.actionSteps" :key="index" class="mb-3">
            <component :is="actionStep.action"
                :action-step="actionStep"
                :action-context-params="actionContextParams"
                @choose-weather-branch="chooseWeatherBranch"
                @choose-weather-branch-no-match="chooseWeatherBranchNoMatch"
                @alternative-action="doAlternativeAction"/>
          </li>
        </ol>
      </li>
    </template>
  </ol>

  <button v-if="nextButtonEnabled" class="btn btn-primary btn-lg mt-2" @click="next()">
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
import Action from '@/services/enum/Action'
import ActionSlot from '@/services/enum/ActionSlot'
import Player from '@/services/enum/Player'
import SaboteurActions from '@/services/SaboteurActions'
import ClaimInitiative from '@/components/turn/actions/ClaimInitiative.vue'
import DiscardResearchTokens from '@/components/turn/actions/DiscardResearchTokens.vue'
import DrawSecurityReport from '@/components/turn/actions/DrawSecurityReport.vue'
import DiscardSecurityReport from '@/components/turn/actions/DiscardSecurityReport.vue'
import GetAwardToken from '@/components/turn/actions/GetAwardToken.vue'
import GovernmentFlipSubsidy from '@/components/turn/actions/GovernmentFlipSubsidy.vue'
import GovernmentGetResearchToken from '@/components/turn/actions/GovernmentGetResearchToken.vue'
import GovernmentPlaceBotResearchPriority from '@/components/turn/actions/GovernmentPlaceBotResearchPriority.vue'
import GovernmentPlaceGearRemoveSubsidy from '@/components/turn/actions/GovernmentPlaceGearRemoveSubsidy.vue'
import GovernmentRunMachine from '@/components/turn/actions/GovernmentRunMachine.vue'
import IncreaseTargetValue from '@/components/turn/actions/IncreaseTargetValue.vue'
import IncreaseTargetValueOrDiscardSecurityReport from '@/components/turn/actions/IncreaseTargetValueOrDiscardSecurityReport.vue'
import LativsLabPlaceBotResearchPriority from '@/components/turn/actions/LativsLabPlaceBotResearchPriority.vue'
import RndGetResearchToken from '@/components/turn/actions/RndGetResearchToken.vue'
import RndPlaceBotPreviousReportPriority from '@/components/turn/actions/RndPlaceBotPreviousReportPriority.vue'
import RndPlaceBotResearchPriority from '@/components/turn/actions/RndPlaceBotResearchPriority.vue'
import RndChemicalAvailable from '@/components/turn/actions/RndChemicalAvailable.vue'
import RndPlaceChemical from '@/components/turn/actions/RndPlaceChemical.vue'
import TakeChemical from '@/components/turn/actions/TakeChemical.vue'
import TakeExtremeWeatherTile from '@/components/turn/actions/TakeExtremeWeatherTile.vue'
import UnlockCitation from '@/components/turn/actions/UnlockCitation.vue'
import Weather from '@/services/enum/Weather'
import ActionContextParams from '@/services/ActionContextParams'
import TokenCollector from '@/services/TokenCollector'

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
    DiscardResearchTokens,
    DrawSecurityReport,
    DiscardSecurityReport,
    GetAwardToken,
    GovernmentFlipSubsidy,
    GovernmentGetResearchToken,
    GovernmentPlaceBotResearchPriority,
    GovernmentPlaceGearRemoveSubsidy,
    GovernmentRunMachine,
    IncreaseTargetValue,
    IncreaseTargetValueOrDiscardSecurityReport,
    LativsLabPlaceBotResearchPriority,
    RndGetResearchToken,
    RndPlaceBotPreviousReportPriority,
    RndPlaceBotResearchPriority,
    RndChemicalAvailable,
    RndPlaceChemical,    
    TakeChemical,
    TakeExtremeWeatherTile,
    UnlockCitation
  },
  setup() {
    const { t } = useI18n()
    const store = useStore()
    const route = useRoute()

    const navigationState = new NavigationState(route, store.state)
    const round = navigationState.round
    const cardDeck = ref(navigationState.cardDeck.clone())
    const tokens = ref(navigationState.tokens)
    const citationUnlock = ref(navigationState.citationUnlock)
    const initiativePlayer = ref(navigationState.initiativePlayer)
    const lastRoundInitiativePlayer = navigationState.lastRoundInitiativePlayer

    return { t, round, navigationState, cardDeck, tokens, citationUnlock, initiativePlayer, lastRoundInitiativePlayer }
  },
  data() {
    return {
      selectedLocation: undefined as Location|undefined,
      selectedActionSlot: undefined as ActionSlot|undefined,
      saboteurActions: undefined as SaboteurActions|undefined,
      endOfTurnDrawSecurityReportAdded: false,
      endOfTurnResearchTokenSetAdded: false
    }
  },
  computed: {
    nextButtonEnabled() : boolean {
      return this.selectedLocation != undefined
          && this.saboteurActions != undefined
          && this.saboteurActions.allDecisionsResolved
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
      return this.cardDeck.currentReport
    },
    previousReport() : Card {
      return this.cardDeck.previousReport
    },
    actionContextParams() : ActionContextParams {
      return {
        selectionPriority: this.previousReport.selectionPriority,
        weatherPriority: this.previousReport.weather,
        citationUnlock: this.citationUnlock,
        tokens: this.tokens
      }
    }
  },
  methods: {
    next() : void {
      this.$store.commit('claimInitiative', {round:this.round, player:this.initiativePlayer})
      this.$store.commit('round', {round: this.round+1,
          cardDeck: this.cardDeck.toPersistence(),
          tokens: this.tokens,
          citationUnlock: this.citationUnlock})
      this.$router.push(this.nextButtonRouteTo)
    },
    locationSelected(payload: {location:Location, actionSlot?:ActionSlot}) : void {
      this.selectedLocation = payload.location
      this.selectedActionSlot = payload.actionSlot
      this.saboteurActions = new SaboteurActions({location:this.selectedLocation,
          actionSlot:this.selectedActionSlot, initiativePlayer:this.initiativePlayer,
          citationUnlock:this.citationUnlock})
      this.processSaboteurActions()
    },
    unselectLocation() : void {
      this.cardDeck = this.navigationState.cardDeck.clone()
      this.selectedLocation = undefined
      this.selectedActionSlot = undefined
      this.tokens = this.navigationState.tokens
      this.citationUnlock = this.navigationState.citationUnlock
      this.initiativePlayer = this.navigationState.initiativePlayer
      this.saboteurActions = undefined
      this.endOfTurnDrawSecurityReportAdded = false
      this.endOfTurnResearchTokenSetAdded = false
    },
    chooseWeatherBranch(payload:{weatherBranchChosen:Weather}) : void {
      if (!this.saboteurActions) {
        return
      }
      this.saboteurActions.chooseWeatherBranch(payload.weatherBranchChosen)
      this.processSaboteurActions()
    },
    chooseWeatherBranchNoMatch() : void {
      this.saboteurActions?.chooseWeatherBranchNoMatchSkipSteps()
      this.processSaboteurActions()
    },
    doAlternativeAction(payload:{alternativeActionsTaken:boolean}) : void {
      if (!this.saboteurActions) {
        return
      }
      this.saboteurActions.takeAlternativeAction(payload.alternativeActionsTaken)
      this.processSaboteurActions()
    },
    processSaboteurActions() : void {
      if (!this.saboteurActions) {
        return
      }
      this.tokens = this.saboteurActions.processTokens(this.navigationState.tokens)
      this.citationUnlock = this.saboteurActions.processCitationUnlock(this.navigationState.citationUnlock)
      this.initiativePlayer = this.saboteurActions.processInitiativePlayer(this.navigationState.initiativePlayer)
      this.cardDeck = this.navigationState.cardDeck.clone()
      this.saboteurActions.processSecurityReport().forEach(action => {
        if (action==Action.DRAW_SECURITY_REPORT) {
          this.cardDeck.draw()
        }
        else if (action==Action.DISCARD_SECURITY_REPORT) {
          this.cardDeck.discardFromDeck()
        }
      })
      if (!this.saboteurActions.allDecisionsResolved) {
        return
      }
      if (!this.endOfTurnDrawSecurityReportAdded) {
        // draw next security report card
        this.saboteurActions.addDrawSecurityReport()
        this.endOfTurnDrawSecurityReportAdded = true
        this.processSaboteurActions()
      }
      if (!this.endOfTurnResearchTokenSetAdded) {
        // check if saboteurs can complete one token set
        const tokenCollector = new TokenCollector(this.tokens, this.citationUnlock, this.currentReport.weather)
        const researchTokenSets = tokenCollector.getValidResearchTokenSets()
        if (researchTokenSets.length > 0) {
          const researchTokenSet = researchTokenSets[0]
          this.saboteurActions.addResearchTokenSetActions(researchTokenSet)
          this.endOfTurnResearchTokenSetAdded = true
          this.processSaboteurActions()
        }
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.saboteur-move-raise-target-value-icon {
  width: 10rem;
}
</style>