<template>
  <div class="sidebar">
    <div>
      {{t('turnPlayer.sidebar.saboteursScheme')}}<br/>
      <AgentLocationIcon :agent="currentReport.agent" :location="currentReport.location" class="mt-2"/>
    </div>
    <div class="mt-2">
      {{t('turnPlayer.sidebar.priority')}}<br/>
      <AppIcon type="weather" :name="previousReport.weather" class="weather-icon mt-2"/>
      <AppIcon type="selection-priority" :name="previousReport.selectionPriority" class="selection-priority-icon mt-2"/>
    </div>
    <div class="mt-2" :class="{'report-cards-warning':reportsLeft <= 3}">
      {{t('turnPlayer.sidebar.reportsLeft')}} <b>{{reportsLeft}}</b>
    </div>

    <div class="mt-2">
      <template v-for="(token,index) of tokens" :key="index">
        <AppIcon v-if="token.award" name="award-token" class="token award"/>
        <ResearchTokenIcon v-if="token.location && token.weather" :location="token.location" :weather="token.weather" class="token research"/>
      </template>
    </div>

    <hr/>

    <div>
      {{t('turnPlayer.sidebar.nextFirstPlayer')}}<br/>
      <b>{{t(`claimInitiative.${initiativePlayer}`)}}</b>
      <ClaimInitiative :round="navigationState.round" :player="navigationState.player" @claimed-initiative="claimedInitiative" />
    </div>

  </div>
</template>

<script lang="ts">
import { Token, useStore } from '@/store'
import { defineComponent, PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import ClaimInitiative from '@/components/turn/ClaimInitiative.vue'
import NavigationState from '@/util/NavigationState'
import Player from '@/services/enum/Player'
import Card from '@/services/Card'
import AgentLocationIcon from '../structure/AgentLocationIcon.vue'
import AppIcon from '../structure/AppIcon.vue'
import ResearchTokenIcon from '../structure/ResearchTokenIcon.vue'

export default defineComponent({
  name: 'PlayerSidebar',
  components: {
    ClaimInitiative,
    AgentLocationIcon,
    AppIcon,
    ResearchTokenIcon
  },
  setup() {
    const { t } = useI18n()
    useStore()
    return { t }
  },
  data() {
    return {
      initiativePlayer: this.navigationState.initiativePlayer
    }
  },
  props: {
    navigationState: {
      type: NavigationState,
      required: true
    }
  },
  computed: {
    currentReport() : Card {
      return this.navigationState.currentReport
    },
    previousReport() : Card {
      return this.navigationState.previousReport
    },
    reportsLeft() : number {
      return this.navigationState.cardDeck.deck.length
    },
    tokens() : Token[] {
      return this.navigationState.tokens
    }
  },
  methods: {
    claimedInitiative(payload: {player : Player}) {
      this.initiativePlayer = payload.player
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
  background-color: #f3e7d8;
  border: 4px double #f2d6c5;
  border-radius: 1rem;
  .weather-icon {
    width: 2.5rem;
  }
  .selection-priority-icon {
    width: 2rem;
    margin-left: 1rem;
  }
  .report-cards-warning {
    color: red;
  }
  .token {
    margin-right: 0.5rem;
    &.award {
      width: 2.5rem;
    }
    &.research {
      width: 2.25rem;
    }
  }
}
</style>
