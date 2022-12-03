<template>
  <TurnSidebar :round="round"
      :player="navigationState.player"
      :current-report="cardDeck.currentReport"
      :previous-report="cardDeck.previousReport"
      :deck="cardDeck.deck"
      :tokens="tokens"
      :citation-unlock="citationUnlock"
      :initiative-player="initiativePlayer"
      @call-security="callSecurity"
      @update-initiative-player="updateInitiativePlayer"
      @update-citation-unlock="updateCitationUnlock"/>

  <h1>{{t('turnPlayer.title')}}</h1>

  <ol>
    <li v-html="t('turnPlayer.useSubsidyInvestment')"></li>
    <li class="mt-2">
      <span v-html="t('turnPlayer.moveScientist')"></span>
      <ul v-if="round==1">
        <li v-html="t('turnPlayer.moveScientistRound1')"></li>
      </ul>
      <LativMovement/>
    </li>
    <li class="mt-2" v-html="t('turnPlayer.performActions')"></li>
    <li class="mt-2" v-html="t('turnPlayer.placeResearchTokens')"></li>
  </ol>

  <ul v-if="challengeOneStepAhead || challengeMoralHighGround || challengePeerReview || challengeIndependentPrototypes || challengeBudgetCuts" class="small">
    <li><ChallengeIcon/> <span v-if="challengeOneStepAhead" v-html="t('turnPlayer.challengeOneStepAhead')"></span></li>
    <li><ChallengeIcon/> <span v-if="challengeMoralHighGround" v-html="t('turnPlayer.challengeMoralHighGround')"></span></li>
    <li><ChallengeIcon/> <span v-if="challengePeerReview" v-html="t('turnPlayer.challengePeerReview')"></span></li>
    <li><ChallengeIcon/> <span v-if="challengeIndependentPrototypes" v-html="t('turnPlayer.challengeIndependentPrototypes')"></span></li>
    <li><ChallengeIcon/> <span v-if="challengeBudgetCuts" v-html="t('turnPlayer.challengeBudgetCuts')"></span></li>
  </ul>

  <router-link :to="nextButtonRouteTo" class="btn btn-primary btn-lg mt-2">
    {{t('action.next')}}
  </router-link>

  <hr/>

  <div class="info-box">
    <AppIcon name="government-run-machine" class="icon"/>
    <p class="small muted mt-2" v-html="t('turnPlayer.infoGovernmentRunMachine')"></p>
  </div>

  <div class="info-box">
    <AppIcon name="rnd-breakthrough" class="icon"/>
    <p class="small mt-2" v-html="t('turnPlayer.infoRndBreakthrough')"></p>
  </div>

  <FooterButtons :backButtonRouteTo="backButtonRouteTo" endGameButtonType="abortGame"/>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import FooterButtons from '@/components/structure/FooterButtons.vue'
import { useStore } from '@/store'
import { useRoute } from 'vue-router'
import NavigationState from '@/util/NavigationState'
import LativMovement from '@/components/turn/LativMovement.vue'
import TurnSidebar from '@/components/turn/TurnSidebar.vue'
import Player from '@/services/enum/Player'
import Weather from '@/services/enum/Weather'
import AppIcon from '@/components/structure/AppIcon.vue'
import { CallSecurityAction } from '@/services/CardDeck'
import ChallengeIcon from '@/components/structure/ChallengeIcon.vue'
import ChallengeCard from '@/services/enum/ChallengeCard'

export default defineComponent({
  name: 'PhaseATurnPlayer',
  components: {
    FooterButtons,
    LativMovement,
    TurnSidebar,
    AppIcon,
    ChallengeIcon
  },
  setup() {
    const { t } = useI18n()
    const store = useStore()
    const route = useRoute()

    const navigationState = new NavigationState(route, store.state)
    const round = navigationState.round
    const cardDeck = ref(navigationState.cardDeck.clone())
    const tokens = navigationState.tokens
    const citationUnlock = ref(navigationState.citationUnlock)
    const initiativePlayer = ref(navigationState.initiativePlayer)
    const lastRoundInitiativePlayer = navigationState.lastRoundInitiativePlayer

    return { t, round, navigationState, cardDeck, tokens, citationUnlock, initiativePlayer, lastRoundInitiativePlayer }
  },
  computed: {
    nextButtonRouteTo() : string {
      if (this.lastRoundInitiativePlayer == Player.SABOTEUR) {
        return `/round/${this.round}/phaseBExperiment`
      }
      else {
        return `/round/${this.round}/phaseATurnSaboteur`
      }
    },
    backButtonRouteTo() : string {
      if (this.lastRoundInitiativePlayer == Player.SABOTEUR) {
        return `/round/${this.round}/phaseATurnSaboteur`
      }
      else if (this.round > 1) {
        return `/round/${this.round-1}/phaseCEndOfRound`
      }
      else {
        return ''
      }
    },
    challengeCards() : ChallengeCard[] {
      return this.$store.state.setup.challengeCards
    },
    challengeOneStepAhead() : boolean {
      return this.challengeCards.includes(ChallengeCard.ONE_STEP_AHEAD)
    },
    challengeMoralHighGround() : boolean {
      return this.challengeCards.includes(ChallengeCard.MORAL_HIGH_GROUND)
    },
    challengePeerReview() : boolean {
      return this.challengeCards.includes(ChallengeCard.PEER_REVIEW)
    },
    challengeIndependentPrototypes() : boolean {
      return this.challengeCards.includes(ChallengeCard.INDEPENDENT_PROTOTYPES)
    },
    challengeBudgetCuts() : boolean {
      return this.challengeCards.includes(ChallengeCard.BUDGET_CUTS)
    }
  },
  methods: {
    updateInitiativePlayer(payload:{player:Player}) : void {
      this.initiativePlayer = payload.player
      this.$store.commit('claimInitiative', {round:this.round, player:payload.player})
    },
    updateCitationUnlock(payload:{citationUnlock:Weather[]}) : void {
      this.citationUnlock = payload.citationUnlock
      this.$store.commit('updateCitation', {round:this.round, citationUnlock:this.citationUnlock})
    },
    callSecurity(payload: CallSecurityAction[]) : void {
      this.cardDeck.callSecurity(payload)
      this.$store.commit('roundCardDeck', {round:this.round, cardDeck:this.cardDeck.toPersistence()})
    }
  }
})
</script>

<style lang="scss" scoped>
.info-box {
  display: inline-block;
  vertical-align: top;
  max-width: 20rem;
  margin-right: 1rem;
}
.icon {
  width: 8rem;
  margin-right: 0.75rem;
}
</style>
