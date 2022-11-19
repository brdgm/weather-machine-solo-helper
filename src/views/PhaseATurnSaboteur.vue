<template>
  <TurnSidebar :navigationState="navigationState"/>

  <h1>{{t('turnSaboteur.title')}}</h1>

  <ol>
    <li>
      <span v-html="t('turnSaboteur.moveSaboteur')"></span><br/>
      <AgentLocationIcon :agent="currentReport.agent" :location="currentReport.location" :show-alternative-locations="true" class="mt-2"/>      
    </li>
    <li v-if="currentReport.location != 'supply'" class="mt-2">
      <span v-html="t('turnSaboteur.raiseTargetValue')"></span><br/>
      <AppIcon name="saboteur-move-raise-target-value" class="saboteur-move-raise-target-value-icon"/>
    </li>
    <li class="mt-2">
      <span v-html="t('turnSaboteur.moveLativ')"></span><br/>
      <LativMovement/>
    </li>
    <li class="mt-2" v-html="t('turnSaboteur.performNefariousPlan')"></li>
    <li class="mt-2" v-html="t('turnSaboteur.wreakHavoc')"></li>
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
import TurnSidebar from '@/components/turn/TurnSidebar.vue'
import LativMovement from '@/components/turn/LativMovement.vue'
import AgentLocationIcon from '@/components/structure/AgentLocationIcon.vue'
import Card from '@/services/Card'
import AppIcon from '@/components/structure/AppIcon.vue'

export default defineComponent({
  name: 'PhaseATurnSaboteur',
  components: {
    FooterButtons,
    TurnSidebar,
    LativMovement,
    AgentLocationIcon,
    AppIcon
  },
  setup() {
    const { t } = useI18n()
    const store = useStore()
    const route = useRoute()

    const navigationState = new NavigationState(route, store.state)
    const round = navigationState.round

    return { t, round, navigationState }
  },
  computed: {
    nextButtonRouteTo() : string {
      return `/round/${this.round}/phaseBExperiment`
    },
    backButtonRouteTo() : string {
      return `/round/${this.round}/phaseATurnPlayer`
    },
    currentReport() : Card {
      return this.navigationState.currentReport
    }
  }
})
</script>

<style lang="scss" scoped>
.saboteur-move-raise-target-value-icon {
  width: 10rem;
}
</style>