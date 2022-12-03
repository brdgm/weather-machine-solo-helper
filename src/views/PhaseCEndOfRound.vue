<template>
  <h1>{{t('endOfRound.title')}}</h1>

  <ul>
    <li v-html="t(`endOfRound.turnOrder.${initiativePlayer}`)"></li>
    <li>
      <span v-html="t('endOfRound.lativOffice')"></span>
      <ul>
        <li v-html="t('endOfRound.income')"></li>
        <li v-if="challengeJammingDevices"><ChallengeIcon/> <span v-html="t('endOfRound.challengeJammingDevices')"></span></li>
        <li v-if="challengeCreativeAccounting"><ChallengeIcon/> <span v-html="t('endOfRound.challengeCreativeAccounting')"></span></li>
        <li v-html="t('endOfRound.moveLativSupply')"></li>
      </ul>
    </li>
  </ul>

  <router-link :to="nextButtonRouteTo" class="btn btn-primary btn-lg mt-2">
    {{t('action.next')}}
  </router-link>

  <button class="btn btn-outline-secondary btn-sm mt-2 ms-3" data-bs-toggle="modal" data-bs-target="#modalEndeGameConditions">
    {{t('endGameConditions.title')}}
  </button>

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
import ChallengeCard from '@/services/enum/ChallengeCard'
import ChallengeIcon from '@/components/structure/ChallengeIcon.vue'

export default defineComponent({
  name: 'PhaseCEndOfRound',
  components: {
    FooterButtons,
    ChallengeIcon
  },
  setup() {
    const { t } = useI18n()
    const store = useStore()
    const route = useRoute()

    const navigationState = new NavigationState(route, store.state)
    const round = navigationState.round
    const initiativePlayer = navigationState.initiativePlayer

    return { t, round, initiativePlayer }
  },
  computed: {
    nextButtonRouteTo() : string {
      if (this.initiativePlayer==Player.PLAYER) {
        return `/round/${this.round+1}/phaseATurnPlayer`
      }
      else {
        return `/round/${this.round+1}/phaseATurnSaboteur`
      }
    },
    backButtonRouteTo() : string {
      return `/round/${this.round}/phaseBExperiment`
    },
    challengeCards() : ChallengeCard[] {
      return this.$store.state.setup.challengeCards
    },
    challengeJammingDevices() : boolean {
      return this.challengeCards.includes(ChallengeCard.JAMMING_DEVICE)
    },
    challengeCreativeAccounting() : boolean {
      return this.challengeCards.includes(ChallengeCard.CREATIVE_ACCOUNTING)
    }
  }
})
</script>
