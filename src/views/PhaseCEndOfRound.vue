<template>
  <h1>{{t('endOfRound.title')}}</h1>

  <ul>
    <li v-html="t(`endOfRound.turnOrder.${initiativePlayer}`)"></li>
    <li>
      <span v-html="t('endOfRound.lativOffice')"></span>
      <ul>
        <li v-html="t('endOfRound.income')"></li>
        <li v-html="t('endOfRound.moveLativSupply')"></li>
      </ul>
    </li>
  </ul>

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

export default defineComponent({
  name: 'PhaseCEndOfRound',
  components: {
    FooterButtons
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
    }
  }
})
</script>
