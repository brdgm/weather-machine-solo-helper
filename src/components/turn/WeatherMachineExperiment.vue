<template>
  <div class="icon-text">
    <div>
      <AppIcon name="phase-b-weather-experiment" class="icon me-3 mt-2"/>
    </div>
    <div>
      <p v-html="t('experiment.checkRunning.runsIfBoth')"></p>
      <ul>
        <li v-html="t('experiment.checkRunning.atLeastOneTile')"></li>
        <li v-html="t('experiment.checkRunning.allBots')"></li>
      </ul>
      <template v-if="experimentRunning == undefined">
        <button class="btn btn-success me-2" @click="runExperiment(true)" v-html="t('experiment.running.title')"></button>
        <button class="btn btn-danger" @click="runExperiment(false)" v-html="t('experiment.notRunning.title')"></button>
      </template>
      <button v-else class="btn btn-outline-secondary btn-sm" @click="runExperiment(undefined)" v-html="t('action.reselect')"></button>
    </div>
  </div>
  <div class="mt-3" v-if="experimentRunning==true">
    <h3 v-html="t('experiment.running.title')"></h3>
    <ul>
      <template v-for="player of playerOrder" :key="player">
        <li v-if="isPlayer(player)">
          <b>{{t('experiment.running.player.title')}}</b>
          <ol>
            <li v-html="t('experiment.running.player.returnBots')"></li>
            <li v-html="t('experiment.running.player.ifVouchersPayed')"></li>
            <ol>
              <li v-html="t('experiment.running.player.gainCP')"></li>
              <li v-html="t('experiment.running.player.gainBenefit')"></li>
              <li v-html="t('experiment.running.player.takeResearchToken')"></li>
            </ol>
          </ol>
        </li>
        <li v-else>
          <b>{{t('experiment.running.saboteur.title')}}</b>
          <ol>
            <li v-html="t('experiment.running.saboteur.returnBots')"></li>
            <li v-html="t('experiment.running.saboteur.takeResearchToken')"></li>
          </ol>
        </li>
      </template>
    </ul>
  </div>
  <div class="mt-3" v-if="experimentRunning==true">
    <h3 v-html="t('experiment.afterExperiment.title')"></h3>
    <ul>
      <li v-html="t('experiment.afterExperiment.lativBotRemoveResearchToken')"></li>
      <li v-html="t('experiment.afterExperiment.returnLativBots')"></li>
      <li v-html="t('experiment.afterExperiment.takeExtremeWeatherTile')"></li>
    </ul>
  </div>
  <div class="mt-3" v-if="experimentRunning==false">
    <h3 v-html="t('experiment.notRunning.title')"></h3>
    <ul>
      <li v-html="t('experiment.notRunning.returnPlayerBots')"></li>
      <li v-html="t('experiment.notRunning.saboteurBotExtremeWeather')"></li>
      <li v-html="t('experiment.notRunning.returnLativBots')"></li>
    </ul>
  </div>
  <div class="mt-3" v-if="experimentRunning != undefined">
    <h3 v-html="t('experiment.prepareNext.title')"></h3>
    <ul>
      <li v-html="t('experiment.prepareNext.removeExperimentTile')"></li>
      <li v-html="t('experiment.prepareNext.moveLativAssistant')"></li>
    </ul>
  </div>

</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppIcon from '../structure/AppIcon.vue'
import NavigationState from '@/util/NavigationState'
import { useI18n } from 'vue-i18n'
import getPrioritizedEnumValues from 'brdgm-commons/src/util/enum/getPrioritizedEnumValues'
import Player from '@/services/enum/Player'

export default defineComponent({
  name: 'WeatherMachineExperiment',
  components: {
    AppIcon
  },  
  setup() {
    const { t } = useI18n()
    return { t }
  },
  props: {
    navigationState: {
      type: NavigationState,
      required: true
    }
  },
  data() {
    return {
      experimentRunning: undefined as boolean|undefined
    }
  },
  computed: {
    playerOrder() : Player[] {
      return getPrioritizedEnumValues(Player, this.navigationState.lastRoundInitiativePlayer)
    }
  },
  methods: {
    runExperiment(isRunning: boolean|undefined) : void {
      this.experimentRunning= isRunning
    },
    isPlayer(player : Player) : boolean {
      return player == Player.PLAYER
    }
  }
})
</script>

<style lang="scss" scoped>
.icon-text div {
  display: inline-block;
  vertical-align: top;
}
.icon {
  height: 4rem;  
}
</style>
