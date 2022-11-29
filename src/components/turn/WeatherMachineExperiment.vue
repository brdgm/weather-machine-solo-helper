<template>
  <div class="icon-text">
    <div>
      <AppIcon name="phase-b-weather-experiment" class="icon me-3 mt-2"/>
    </div>
    <div>
      <p>The experiment runs if <b>both</b> conditions are met:</p>
      <ul>
        <li>There is at least one Experiment tile in the display matching the weather of the active branch.</li>
        <li>There is a Bot on every space in the active branch.</li>
      </ul>
      <template v-if="experimentRunning == undefined">
        <button class="btn btn-success me-2" @click="runExperiment(true)">Experiment is running</button>
        <button class="btn btn-danger" @click="runExperiment(false)">Experiment is <i>not</i> running</button>
      </template>
      <button v-else class="btn btn-outline-secondary btn-sm" @click="runExperiment(undefined)">Reselect</button>
    </div>
  </div>
  <div class="mt-3" v-if="experimentRunning==true">
    <h3>Experiment is running</h3>
    <ul>
      <li>The Experiment tile in the display matching the weather of the <b>active branch</b> is known as the active Experiment tile. If there is more than one matching tile, the rightmost tile is the active one.</li>
      <template v-for="player of playerOrder" :key="player">
        <li v-if="isPlayer(player)">
          You:
          <ol>
            <li>Return your Bots from the active branch to your Workshop. If you do not have space for a Bot, return it to any empty space in the top two sections of your Assembly Line.</li>
            <li>You may pay the number of Science Vouchers as depicted on the active Experiment tile. If you do:</li>
            <ol>
              <li>Gain CP as depicted on the Experiment tile for each Bot you just returned.</li>
              <li>Gain one of the two benefits depicted on the tile (no matter how many Bots you had in the branch).</li>
              <li>Take a Research token from below the active branch (if available).</li>
            </ol>
          </ol>
        </li>
        <li v-else>
          The Saboteurs:
          <ol>
            <li>For each of the Saboteurs Bots in the active branch, return that Bot to the Hideout and raise the Target Value by the CP depicted on the Experiment tile.</li>
            <li>Take a Research token from below the active branch (if available). <b>QUESTION</b></li>
          </ol>
        </li>
      </template>
    </ul>
  </div>
  <div class="mt-3" v-if="experimentRunning==true">
    <h3>After the Experiment</h3>
    <ul>
      <li>If there is one of Lativ’s Bots on the branch, remove from the game 1 Research token from below the active branch, if able.</li>
      <li>Return any of Lativ’s Bots on the active branch to the side of the Lab.</li>
      <li>Take the top Extreme Weather tile from the stack matching the type of weather and place it on the corresponding space in R&D, covering any tile already there. Any Breakthrough markers on the existing tile are returned to the box, and any Government markers are returned to the Government area.</li>
    </ul>
  </div>
  <div class="mt-3" v-if="experimentRunning==false">
    <h3>Experiment is <i>not</i> running</h3>
    <ul>
      <li>You may choose to return your bots from the active branch to your Workshop.</li>
      <li>If the Saboteurs have at least on Bot present in the active branch: Place a new Extreme Weather tile. The Bots stay in the branch.</li>
      <li>Return any of Lativ’s Bots on the active branch to the side of the Lab.</li>
    </ul>
  </div>
  <div class="mt-3" v-if="experimentRunning != undefined">
    <h3>Prepare for the next experiment</h3>
    <ul>
      <li>Remove from the game the rightmost Experiment tile in the display matching the weather of the active branch (if any). Slide any other tiles in the display to the right to refill any gaps, then place the tile below the deck to the leftmost space in the display, and finally, place the top tile of the deck on the space below the deck, if able.</li>
      <li>Move Lativ’s Assistant to the next branch. If already in the Snow branch, move them to the Rain branch.</li>
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
