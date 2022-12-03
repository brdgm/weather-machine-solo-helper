<template>
  <TurnSidebar :round="round"
      :player="navigationState.player"
      :current-report="navigationState.cardDeck.currentReport"
      :previous-report="navigationState.cardDeck.previousReport"
      :reports-left="navigationState.cardDeck.deck.length"
      :tokens="tokens"
      :citation-unlock="citationUnlock"
      :initiative-player="initiativePlayer"
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

  <router-link :to="nextButtonRouteTo" class="btn btn-primary btn-lg mt-2">
    {{t('action.next')}}
  </router-link>

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

export default defineComponent({
  name: 'PhaseATurnPlayer',
  components: {
    FooterButtons,
    LativMovement,
    TurnSidebar
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
    }
  }
})
</script>
