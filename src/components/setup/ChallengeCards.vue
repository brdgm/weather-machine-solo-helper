<template>
  
  <p class="mt-4" v-html="t('setupDifficultyLevel.firstTime')"></p>

  <p>
    <span v-html="t('setupDifficultyLevel.greaterChallenge')"></span><br/>
    <button v-if="!showChallengeCards" class="btn btn-secondary btn-sm" @click="doShowChallengeCards()">
      <AppIcon name="challenge-card" class="icon"/>
      {{t('setupDifficultyLevel.pickChallengeCards')}}
    </button>
    <button v-if="showChallengeCards && selectedChallengeCards.length < 12" class="btn btn-secondary btn-sm" @click="pickRandom()">
      <AppIcon name="challenge-card" class="icon"/>
      {{t('setupDifficultyLevel.pickRandom')}}
    </button>
    <button v-if="showChallengeCards" class="btn btn-secondary btn-sm" @click="clearAll()">
      {{t('setupDifficultyLevel.clearAll')}}
    </button>
  </p>

  <div class="container" v-if="showChallengeCards">
    <div class="row">
      
      <div class="card" v-for="(challengeCard,index) of challengeCards" :key="challengeCard" @click="selectedIndex[index] = !selectedIndex[index]">
        <div class="card-body" :class="{selected:selectedIndex[index]}">
          <div class="card-title">
            <input class="form-check-input" type="checkbox" :value="true" :id="`card-${challengeCard}`" v-model="selectedIndex[index]">
            <label class="form-check-label" :for="`card-${challengeCard}`" @click.prevent>{{index+1}}. {{t(`challengeCard.${challengeCard}.title`)}}</label>
          </div>
          <p class="card-text" v-html="t(`challengeCard.${challengeCard}.description`)"></p>
        </div>
      </div>

    </div>
  </div>
  

</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from '@/store'
import AppIcon from '../structure/AppIcon.vue'
import rollDice from "brdgm-commons/src/util/random/rollDice"
import ChallengeCard from '@/services/enum/ChallengeCard'

export default defineComponent({
  name: 'ChallengeCards',
  components: {
    AppIcon
  },
  setup() {
    const { t } = useI18n()
    useStore()
    return { t }
  },
  data() {
    return {
      showChallengeCards: this.$store.state.setup.challengeCards.length > 0,
      selectedIndex: toSelectedIndex(this.$store.state.setup.challengeCards)
    }
  },
  computed: {
    challengeCards() : ChallengeCard[] {
      return Object.values(ChallengeCard)
    },
    selectedChallengeCards() : ChallengeCard[] {
      const result = []
      for (let i=0; i<this.challengeCards.length; i++) {
        if (this.selectedIndex[i]) {
          result.push(this.challengeCards[i])
        }
      }
      return result
    }
  },
  methods: {
    doShowChallengeCards() {
      this.showChallengeCards = true
    },
    pickRandom() {
      if (this.selectedChallengeCards.length == 12) {
        return
      }
      const index = rollDice(12)-1
      if (!this.selectedIndex[index]) {
        this.selectedIndex[index] = true
      }
      else {
        this.pickRandom()
      }
    },
    clearAll() {
      this.selectedIndex = []
      this.showChallengeCards = false
    }
  },
  watch: {
    selectedIndex: {
      handler() {
        this.$store.commit('setup', {challengeCards:this.selectedChallengeCards})
      },
      deep: true
    }
  }
})

function toSelectedIndex(selected? : ChallengeCard[]) : boolean[] {
  const result : boolean[] = []
  const challengeCards = Object.values(ChallengeCard)
  for (let i=0; i<challengeCards.length; i++) {
    if (selected?.includes(challengeCards[i])) {
      result[i] = true
    }
  }
  return result
}
</script>

<style lang="scss" scoped>
button.btn-sm {
  margin-right: 0.5rem;
  .icon {
    height: 1.25rem;
    margin-top: -0.2rem;
    margin-right: 0.2rem;
  }
}
.card {
  width: 18rem;
  margin: 0.5rem;
  padding: 0;
  cursor: pointer;
  .card-title {
    font-size: 1rem;
    font-weight: bold;
    white-space: nowrap;
    .form-check-label {
      margin-left: 0.5rem;
    }
  }
  .card-text {
    font-size: 0.85rem;
  }
  .selected {
    background-color: #fdd;
  }
}
</style>