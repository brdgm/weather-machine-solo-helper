<template>
  <div class="sidebar">
    <div>
      {{t('sidebar.saboteursScheme')}}<br/>
      <AgentLocationIcon :agent="currentReport.agent" :location="currentReport.location" class="mt-2"/>
    </div>
    <div class="mt-2">
      {{t('sidebar.priority')}}<br/>
      <AppIcon type="weather" :name="previousReport.weather" class="weather-icon mt-2"/>
      <AppIcon type="selection-priority" :name="previousReport.selectionPriority" class="selection-priority-icon mt-2"/>
    </div>
    <div class="mt-2" :class="{'report-cards-warning':reportsLeft <= 3}">
      {{t('sidebar.reportsLeft')}} <b>{{reportsLeft}}</b>
    </div>

    <div class="mt-2">
      <template v-for="(token,index) of tokens" :key="index">
        <AppIcon v-if="token.award" name="award-token" class="token award"/>
        <ResearchTokenIcon v-if="token.location && token.weather" :location="token.location" :weather="token.weather" class="token research"/>
      </template>
    </div>

    <hr/>

    <div>
      {{t('sidebar.nextFirstPlayer')}}<br/>
      <b>{{t(`claimInitiative.${initiativePlayer}`)}}</b>
      <div class="mt-2 mb-2">
        <button class="btn btn-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#modalClaimInitiative">
          {{t('claimInitiative.title')}}
        </button>
      </div>
    </div>
  </div>
  <div class="citationbar">
    <div v-for="weather of weathers" :key="weather" class="citation">
      <div class="weather">
        <AppIcon type="weather" :name="weather" class="icon"/>
      </div>
      <div class="lock" :class="{unlocked:isCitationUnlocked(weather)}" @click="openUnlockCitationModal(weather)">
        <AppIcon v-if="isCitationUnlocked(weather)" name="citation-unlocked" class="icon"/>
        <AppIcon v-else name="citation-locked" class="icon"/>
      </div>
    </div>
  </div>

  <div class="modal" tabindex="-1" id="modalUnlockCitation">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">{{t('sidebar.unlockCitation.title')}}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" :aria-label="t('action.close')"></button>
        </div>
        <div class="modal-body">
          <div class="float-start">
            <AppIcon type="weather" :name="unlockCitationWeather" class="icon"/>
          </div>
          <p v-html="t('sidebar.unlockCitation.description')"></p>
        </div>
        <div class="modal-footer">
          <button v-if="isCitationUnlocked(unlockCitationWeather)" type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="lockCitation(unlockCitationWeather)">{{t('sidebar.unlockCitation.lock')}}</button>
          <button v-else type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="unlockCitation(unlockCitationWeather)">{{t('sidebar.unlockCitation.unlock')}}</button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">{{t('action.cancel')}}</button>
        </div>
      </div>
    </div>
  </div>

  <ClaimInitiative :round="navigationState.round" :player="navigationState.player" @claimed-initiative="claimedInitiative" />
</template>

<script lang="ts">
import { Token, useStore } from '@/store'
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import ClaimInitiative from '@/components/turn/ClaimInitiative.vue'
import NavigationState from '@/util/NavigationState'
import Player from '@/services/enum/Player'
import Card from '@/services/Card'
import AgentLocationIcon from '../structure/AgentLocationIcon.vue'
import AppIcon from '../structure/AppIcon.vue'
import ResearchTokenIcon from '../structure/ResearchTokenIcon.vue'
import Weather from '@/services/enum/Weather'
import { Modal } from 'bootstrap'

export default defineComponent({
  name: 'TurnSidebar',
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
      initiativePlayer: this.navigationState.initiativePlayer,
      citationUnlock: this.navigationState.citationUnlock,
      unlockCitationWeather: Weather.RAIN
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
    },
    weathers() : Weather[] {
      return Object.values(Weather)
    }
  },
  methods: {
    claimedInitiative(payload: {player : Player}) : void {
      this.initiativePlayer = payload.player
    },
    isCitationUnlocked(weather : Weather) : boolean {
      return this.citationUnlock.includes(weather)
    },
    openUnlockCitationModal(weather : Weather) : void {
      this.unlockCitationWeather = weather
      const modal = new Modal(document.getElementById('modalUnlockCitation') as Element)
      modal.show()
    },
    unlockCitation(weather : Weather) {
      this.citationUnlock.push(weather)
      this.$store.commit('updateCitation', {round:this.navigationState.round, citationUnlock:this.citationUnlock})
    },
    lockCitation(weather : Weather) {
      this.citationUnlock = this.citationUnlock.filter(item => item != weather)
      this.$store.commit('updateCitation', {round:this.navigationState.round, citationUnlock:this.citationUnlock})
    }
  }
})
</script>

<style lang="scss" scoped>
.sidebar {
  float: right;
  width: 15rem;
  padding: 1rem;
  background-color: #f3e7d8;
  border: 4px double #f2d6c5;
  border-radius: 1rem;
  filter: drop-shadow(0.1rem 0.1rem 0.3rem #aaa);
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
.citationbar {
  float: right;
  margin-top: 1rem;
  margin-left: 1rem;
  min-height: 10rem;
  .citation {
    .weather {
      display: inline-block;
      .icon {
        position: relative;
        width: 2rem;
        top: 0.5rem;
        margin-right: -0.25rem;
      }
    }
    .lock {
      display: inline-block;
      width: 3rem;
      height: 3rem;
      background-color: #87765f;      
      border-top-left-radius: 0.25rem;
      border-bottom-left-radius: 0.25rem;
      cursor: pointer;
      filter: drop-shadow(0.1rem 0.1rem 0.3rem #aaa);
      .icon {
        position: relative;
        width: 1.4rem;
        left: 0.75rem;
        top: 0.4rem;
      }
      &.unlocked {
        background-color: #c1a885;      
        .icon {
          width: 2.5rem;
          left: 0.25rem;
          top: 0.5rem;
        }
      }
    }
  }
}
#modalUnlockCitation {
  .icon {
    width: 5rem;
    margin-right: 2rem;
    margin-left: 1rem;
  }
}
</style>
