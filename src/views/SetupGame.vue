<template>
  <h1>{{t('setupGame.title')}}</h1>

  <SetupGameInstructions :setupCards="setupCards"/>

  <button class="btn btn-primary btn-lg mt-2" @click="startGame()">
    {{t('action.startGame')}}
  </button>

  <FooterButtons backButtonRouteTo="/setupDifficultyLevel" endGameButtonType="abortGame"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import FooterButtons from '@/components/structure/FooterButtons.vue'
import SetupGameInstructions from '@/components/setup/SetupGameInstructions.vue'
import ChallengeCard from '@/services/enum/ChallengeCard'
import { useStore } from '@/store'
import CardDeck from '@/services/CardDeck'

export default defineComponent({
  name: 'SetupGame',
  components: {
    FooterButtons,
    SetupGameInstructions
  },
  setup() {
    const { t } = useI18n()
    const store = useStore()

    // setup card deck for game and get setup cards for agent placement instruction
    const challengeCards = store.state.setup.challengeCards
    const removeCards = challengeCards.includes(ChallengeCard.THE_CLOCK_IS_TICKING) ? 2 : 0
    const cardDeck = CardDeck.new()
    const setupCards = cardDeck.setupGame(removeCards)

    return { t, cardDeck, setupCards }
  },
  computed: {
    challengeCards() : ChallengeCard[] {
      return this.$store.state.setup.challengeCards
    }
  },
  methods: {
    startGame() : void {
      this.$store.commit('initialCardDeck', this.cardDeck.toPersistence())
      this.$router.push('/round/1/phaseATurnPlayer')
    }
  }
})
</script>
