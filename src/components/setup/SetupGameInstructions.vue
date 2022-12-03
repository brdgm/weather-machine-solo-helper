<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12 col-md-11 col-lg-9">
        <ul>
          <li v-html="t('setupGame.lativBots')"></li>
          <li v-html="t('setupGame.researchTokens')"></li>
          <li v-html="t('setupGame.goalTiles')"></li>
          <ol>
            <li>
              <img src="@/assets/goal-tiles.png" class="goal-tiles">
              <span v-html="t('setupGame.goalTilesStep1')"></span>
            </li>
            <li v-html="t('setupGame.goalTilesStep2')"></li>
            <li v-html="t('setupGame.goalTilesStep3')"></li>
          </ol>
          <li v-html="t('setupGame.anotherPlayerColor')"></li>
          <li>
            <ChallengeIcon v-if="startingTargetValue < 35"/>
            <span v-html="t('setupGame.scoringMarker',{startingTargetValue:startingTargetValue})"></span>
          </li>
          <li v-html="t('setupGame.turnOrder')"></li>
          <li v-html="t('setupGame.hideout')"></li>
          <ul>
            <li v-html="t('setupGame.hideoutBots')"></li>
            <li>
              <ChallengeIcon v-if="initialChemicals.length > 2"/>
              <span v-html="t('setupGame.hideoutChemicals')"></span>
              <div class="text-center">
                <AppIcon v-for="(chemical,index) of initialChemicals" :key="index" type="chemical" :name="chemical" class="chemical"/>
              </div>
            </li>
            <li v-if="awardTokens > 0">
              <ChallengeIcon />
              <span v-html="t('setupGame.hideoutAward')"></span>
              <div class="text-center">
                <AppIcon v-for="index of awardTokens" :key="index" name="award-token" class="token"/>
              </div>
            </li>
          </ul>
          <li v-for="(card,index) of setupCards" :key="index">
            <span v-html="t(sameLocationsSetupCard(index) ? 'setupGame.placeAgentRightPosition' : 'setupGame.placeAgentMiddlePosition', {agent:t(`agent.${card.agent}`),location:t(`location.${card.location}`)})"></span>
            <span>&nbsp;</span>
            <span v-html="t('setupGame.takeWeatherToken', {weather:t(`weather.${card.weather}`)})"></span>
            <div class="text-center mt-2 mb-2">
              <AgentLocationIcon :agent="card.agent" :location="card.location"/>
              <ResearchTokenIcon :location="card.location" :weather="card.weather" class="ms-5"/>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from '@/store'
import AppIcon from '../structure/AppIcon.vue'
import ChallengeIcon from '../structure/ChallengeIcon.vue'
import ChallengeCard from '@/services/enum/ChallengeCard'
import Chemical from '@/services/enum/Chemical'
import randomEnum from 'brdgm-commons/src/util/random/randomEnum'
import Card from '@/services/Card'
import AgentLocationIcon from '../structure/AgentLocationIcon.vue'
import ResearchTokenIcon from '../structure/ResearchTokenIcon.vue'

export default defineComponent({
  name: 'SetupGameInstructions',
  components: {
    AppIcon,
    ChallengeIcon,
    AgentLocationIcon,
    ResearchTokenIcon
  },
  setup() {
    const { t } = useI18n()
    useStore()
    return { t }
  },
  props: {
    setupCards: {
      type: Object as PropType<Card[]>,
      required: true
    },
    awardTokens: {
      type: Number,
      required: true
    }
  },
  computed: {
    challengeCards() : ChallengeCard[] {
      return this.$store.state.setup.challengeCards
    },
    initialChemicals() : Chemical[] {
      const result : Chemical[] = []
      if (this.challengeCards.includes(ChallengeCard.FULLY_STOCKED_OPPONENTS)) {
        result.push(...Object.values(Chemical))
      }
      else {
        // pick two random different chemicals
        while (result.length < 2) {
          const chemical = randomEnum(Chemical)
          if (!result.includes(chemical)) {
            result.push(chemical)
          }
        }
      }
      if (this.challengeCards.includes(ChallengeCard.NOBEL_LAUREATE)) {
        result.push(randomEnum(Chemical))
      }
      if (this.challengeCards.includes(ChallengeCard.BUDGET_CUTS)) {
        result.push(randomEnum(Chemical))
      }
      return result
    },
    startingTargetValue() : number {
      if (this.challengeCards.includes(ChallengeCard.PUBLISH_OR_PERISH)) {
        return 30
      }
      else {
        return 35
      }
    }
  },
  methods: {
    sameLocationsSetupCard(cardIndex : number) : boolean {
      if (cardIndex == 0) {
        return false
      }
      return this.setupCards[cardIndex]?.location == this.setupCards[0]?.location
    }
  }
})
</script>

<style lang="scss" scoped>
.goal-tiles {
  float: right;
  width: 5rem;
  margin-left: 2rem;
}
.chemical {
  width: 3rem;
  filter: drop-shadow(0.1rem 0.1rem 0.3rem #aaa);
  margin: 0.5rem;
}
.token {
  width: 5rem;
  filter: drop-shadow(0.1rem 0.1rem 0.3rem #aaa);
  margin: 0.5rem;
}
</style>