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
      <button v-else class="btn btn-outline-secondary btn-sm" @click="reselect()" v-html="t('action.reselect')"></button>
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
            <li>
              <span v-html="t('experiment.running.saboteur.takeResearchToken')"></span>
              <div class="decision mt-2" v-if="noWeatherBranchChosen == undefined">
                <span v-html="t('experiment.running.saboteur.researchTokenAvailable')"></span><br/>
                <ChooseWeatherBranch @choose-weather="chooseWeather" @choose-weather-no-match="chooseWeatherNoMatch" class="mt-2"/>
              </div>
              <div v-else-if="weatherBranchChosen" class="mt-2">
                <ResearchTokenIcon :location="location" :weather="weatherBranchChosen"/>
              </div>
            </li>
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
import ChooseWeatherBranch from '../structure/ChooseWeatherBranch.vue'
import Weather from '@/services/enum/Weather'
import ResearchTokenIcon from '../structure/ResearchTokenIcon.vue'
import Location from '@/services/enum/Location'

export default defineComponent({
  name: 'WeatherMachineExperiment',
  components: {
    AppIcon,
    ChooseWeatherBranch,
    ResearchTokenIcon
  },
  emits: {
    experimentPhaseStatus(payload:{completed:boolean}) {
      return payload != undefined
    },
    saboteurResearchTokenGained(payload:{weather:Weather|undefined}) {
      return payload != undefined
    }
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
      experimentRunning: undefined as boolean|undefined,
      weatherBranchChosen: undefined as Weather|undefined,
      noWeatherBranchChosen: undefined as boolean|undefined
    }
  },
  computed: {
    playerOrder() : Player[] {
      return getPrioritizedEnumValues(Player, this.navigationState.lastRoundInitiativePlayer)
    },
    location() : Location {
      return Location.LATIVS_LAB
    }
  },
  methods: {
    runExperiment(isRunning: boolean) : void {
      this.experimentRunning = isRunning
      this.checkExperimentPhaseStatus()
    },
    reselect() : void {
      this.experimentRunning = undefined
      this.weatherBranchChosen = undefined
      this.noWeatherBranchChosen = undefined
      this.checkExperimentPhaseStatus()
    },
    isPlayer(player : Player) : boolean {
      return player == Player.PLAYER
    },
    chooseWeather(payload:{weather:Weather}) : void {
      this.weatherBranchChosen = payload.weather
      this.noWeatherBranchChosen = false
      this.$emit('saboteurResearchTokenGained',{weather:payload.weather})
      this.checkExperimentPhaseStatus()
    },
    chooseWeatherNoMatch() : void {
      this.weatherBranchChosen = undefined
      this.noWeatherBranchChosen = true
      this.$emit('saboteurResearchTokenGained',{weather:undefined})
      this.checkExperimentPhaseStatus()
    },
    checkExperimentPhaseStatus() : void {
      let completed = false
      if (this.experimentRunning != undefined) {
        if (this.experimentRunning) {
          completed = this.noWeatherBranchChosen != undefined
        }
        else {
          completed = true
        }
      }
      this.$emit('experimentPhaseStatus', {completed:completed})
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
.decision {
  span {
    font-weight: bold;
    color: green;
  }
}
</style>
