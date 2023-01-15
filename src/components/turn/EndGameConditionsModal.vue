<template>
  <ModalDialog id="modalEndeGameConditions" :title="t('endGameConditions.title')"
      :size-lg="true" :scrollable="true">
    <template #body>

      <ul v-if="nobelLaureate || onlyOverachieversApply || publishOrPerish">
        <li v-if="nobelLaureate"><ChallengeIcon/> <span v-html="t('endGameConditions.challengeCard.nobelLaureate')"></span></li>
        <li v-if="onlyOverachieversApply"><ChallengeIcon/> <span v-html="t('endGameConditions.challengeCard.onlyOverachieversApply')"></span></li>
        <li v-if="publishOrPerish"><ChallengeIcon/> <span v-html="t('endGameConditions.challengeCard.publishOrPerish')"></span></li>
      </ul>

      <div class="accordion" id="accordionCondition">
        <div class="accordion-item">

          <h2 class="accordion-header" id="headingOne">
            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#accordionConditionItem1" aria-controls="accordionConditionItem1">
              {{t('endGameConditions.immediateWin.title')}}
            </button>
          </h2>
          <div id="accordionConditionItem1" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionCondition">
            <div class="accordion-body">
              <p v-html="t('endGameConditions.immediateWin.intro')"></p>
              <ul>
                <li>
                  <AppIcon name="end-game-target-value-higher" class="icon target-value-higher"/>
                  <span v-html="t('endGameConditions.immediateWin.targetValueHigher')"></span>
                </li>
                <li>
                  <AppIcon name="end-game-goal-tiles" class="icon goal-tiles"/>
                  <span v-html="t('endGameConditions.immediateWin.goalTiles')"></span>
                </li>
                <li>
                  <AppIcon name="end-game-funding-tracks" class="icon funding-tracks"/>
                  <span v-html="t('endGameConditions.immediateWin.fundingTracks')"></span>
                </li>
              </ul>
              <p v-html="t('endGameConditions.immediateWin.outro')"></p>
              <button data-bs-dismiss="modal" class="btn btn-success btn mt-2" @click="goToEndOfGame">
                {{t('endGameConditions.goToEndOfGame')}}
              </button>
            </div>
          </div>
        </div>

        <div class="accordion-item">
          <h2 class="accordion-header" id="headingTwo">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#accordionConditionItem2" aria-expanded="false" aria-controls="accordionConditionItem2">
              {{t('endGameConditions.standardEnding.title')}}
            </button>
          </h2>
          <div id="accordionConditionItem2" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionCondition">
            <div class="accordion-body">
              <p v-html="t('endGameConditions.standardEnding.intro')"></p>
              <ul>
                <li v-html="t('endGameConditions.standardEnding.nobelPrize')"></li>
                <li v-html="t('endGameConditions.standardEnding.lastExperimentTile')"></li>
                <li v-html="t('endGameConditions.standardEnding.governmentMachine')"></li>
                <li v-html="t('endGameConditions.standardEnding.researchFull')"></li>
              </ul>
              <p v-html="t('endGameConditions.standardEnding.outro')"></p>
              <button data-bs-dismiss="modal" class="btn btn-success btn mt-2" @click="goToEndOfGame">
                {{t('endGameConditions.goToEndOfGame')}}
              </button>
            </div>
          </div>
        </div>

        <div class="accordion-item">
          <h2 class="accordion-header" id="headingThree">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#accordionConditionItem3" aria-expanded="false" aria-controls="accordionConditionItem3">
              {{t('endGameConditions.fail.title')}}
            </button>
          </h2>
          <div id="accordionConditionItem3" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionCondition">
            <div class="accordion-body">
              <p v-html="t('endGameConditions.fail.intro')"></p>
              <ul>
                <li>
                  <AppIcon name="end-game-extreme-weather" class="icon extreme-weather"/>
                  <span v-html="t('endGameConditions.fail.extremeWeather')"></span>
                </li>
                <li>
                  <AppIcon name="end-game-deck-empty" class="icon deck-empty"/>
                  <span v-html="t('endGameConditions.fail.deckEmpty')"></span>
                </li>
              </ul>
              <p v-html="t('endGameConditions.fail.outro')"></p>
              <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#endGameModal">{{t('action.abortGame')}}</button>
            </div>
          </div>
        </div>

      </div>
    </template>
  </ModalDialog>
</template>

<script lang="ts">
import ChallengeCard from '@/services/enum/ChallengeCard'
import { useStore } from '@/store'
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import AppIcon from '../structure/AppIcon.vue'
import ChallengeIcon from '../structure/ChallengeIcon.vue'
import ModalDialog from 'brdgm-commons/src/components/structure/ModalDialog.vue'

export default defineComponent({
  name: 'EndGameConditionsModal',
  components: {
    AppIcon,
    ChallengeIcon,
    ModalDialog
  },
  setup() {
    const { t } = useI18n()
    useStore()
    return { t }
  },
  computed: {
    challengeCards() : ChallengeCard[] {
      return this.$store.state.setup.challengeCards
    },
    nobelLaureate() : boolean {
      return this.challengeCards.includes(ChallengeCard.NOBEL_LAUREATE)
    },
    onlyOverachieversApply() : boolean {
      return this.challengeCards.includes(ChallengeCard.NOBEL_LAUREATE)
    },
    publishOrPerish() : boolean {
      return this.challengeCards.includes(ChallengeCard.PUBLISH_OR_PERISH)
    }
  },
  methods: {
    goToEndOfGame() : void {
      this.$router.push("/endOfGame")
    }
  }
})
</script>

<style lang="scss" scoped>
.icon {
  width: 5rem;
  margin-right: 1rem;
  margin-bottom: 0.5rem;
  float: left;
  &.target-value-higher {
    width: 5rem;
  }
  &.goal-tiles {
    width: 3rem;
  }
  &.funding-tracks {
    width: 8rem;
  }
  &.extreme-weather {
    width: 2.5rem;
  }
  &.deck-empty {
    width: 4rem;
  }
}
li, p {
  clear: both;
}
</style>