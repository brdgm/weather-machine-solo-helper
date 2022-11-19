<template>

  <div class="sidebar">
    Next first player: <b>You</b>
  </div>

  <h1>{{t('turnPlayer.title')}}</h1>

  <ol>
    <li v-html="t('turnPlayer.useSubsidyInvestment')"></li>
    <li>
      <span v-html="t('turnPlayer.moveScientist')"></span>
      <LativMovement/>
    </li>
    <li v-html="t('turnPlayer.performActions')"></li>
    <li v-html="t('turnPlayer.placeResearchTokens')"></li>
  </ol>

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
import LativMovement from '@/components/turn/LativMovement.vue'

export default defineComponent({
  name: 'PhaseATurnPlayer',
  components: {
    FooterButtons,
    LativMovement
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
      return `/round/${this.round}/phaseATurnSaboteur`
    },
    backButtonRouteTo() : string {
      if (this.round > 1) {
        return `/round/${this.round-1}/phaseCEndOfRound`
      }
      else {
        return ''
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.sidebar {
  float: right;
  width: 15rem;
  padding: 1rem;
  margin-left: 1rem;
  min-height: 40rem;
  background-color: #f3e7d8;
  border: 4px double #f2d6c5;
  border-radius: 1rem;
}
</style>