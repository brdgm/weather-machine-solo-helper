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
    <div class="mt-2" :class="{'report-cards-warning':deck.length <= 3}">
      {{t('sidebar.reportsLeft')}} <b>{{deck.length}}</b>
    </div>

    <div class="mt-2">
      <template v-for="(token,index) of tokens" :key="index">
        <AppIcon v-if="token.award" name="award-token" class="token award"/>
        <ResearchTokenIcon v-if="token.location && token.weather" :location="token.location" :weather="token.weather" class="token research"/>
      </template>
    </div>

    <hr/>

    <div>
      <div class="mb-2">
        {{t('sidebar.nextFirstPlayer')}}<br/>
        <b>{{t(`claimInitiative.${initiativePlayer}`)}}</b>
      </div>
      <div v-if="isPlayer">
        <button class="btn btn-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#modalClaimInitiative">
          {{t('claimInitiative.title')}}
        </button><br/>
      </div>
      <div v-if="isPlayer">
        <button class="btn btn-secondary btn-sm mt-2" data-bs-toggle="modal" data-bs-target="#modalCallSecurity" v-if="deck.length >= 2">
          {{t('callSecurity.title')}}
        </button>
      </div>
      <div>
        <button class="btn btn-outline-secondary btn-sm mt-2" data-bs-toggle="modal" data-bs-target="#modalEndeGameConditions">
          {{t('endGameConditions.title')}}
        </button>
      </div>
    </div>
  </div>
  <div class="citationbar">
    <div v-for="weather of weathers" :key="weather" class="citation">
      <div class="weather">
        <AppIcon type="weather" :name="weather" class="icon"/>
      </div>
      <div class="lock" :class="{unlocked:isCitationUnlocked(weather),clickable:isPlayer}" @click="openUnlockCitationModal(weather)">
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

  <CallSecurityModal :current-report="currentReport" :deck="deck" @call-security="callSecurity"/>
  <ClaimInitiativeModal :round="round" :player="player" @claimed-initiative="claimedInitiative" />
</template>

<script lang="ts">
import { Token, useStore } from '@/store'
import { defineComponent, PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import CallSecurityModal from '@/components/turn/CallSecurityModal.vue'
import ClaimInitiativeModal from '@/components/turn/ClaimInitiativeModal.vue'
import Player from '@/services/enum/Player'
import Card from '@/services/Card'
import AgentLocationIcon from '../structure/AgentLocationIcon.vue'
import AppIcon from '../structure/AppIcon.vue'
import ResearchTokenIcon from '../structure/ResearchTokenIcon.vue'
import Weather from '@/services/enum/Weather'
import { Modal } from 'bootstrap'
import { CallSecurityAction } from '@/services/CardDeck'

export default defineComponent({
  name: 'TurnSidebar',
  components: {
    CallSecurityModal,
    ClaimInitiativeModal,
    AgentLocationIcon,
    AppIcon,
    ResearchTokenIcon
  },
  emits: {
    updateInitiativePlayer(payload:{player:Player}) {
      return payload != undefined
    },
    updateCitationUnlock(payload:{citationUnlock:Weather[]}) {
      return payload != undefined
    },
    callSecurity(payload: CallSecurityAction[]) {
      return payload != undefined
    }
  },
  setup() {
    const { t } = useI18n()
    useStore()
    return { t }
  },
  data() {
    return {
      unlockCitationWeather: Weather.RAIN
    }
  },
  props: {
    round: {
      type: Number,
      required: true
    },
    player: {
      type: String as PropType<Player>,
      required: true
    },
    currentReport: {
      type: Object as PropType<Card>,
      required: true
    },
    previousReport: {
      type: Object as PropType<Card>,
      required: true
    },
    deck: {
      type: Object as PropType<readonly Card[]>,
      required: true
    },
    tokens: {
      type: Object as PropType<Token[]>,
      required: true
    },
    citationUnlock: {
      type: Object as PropType<Weather[]>,
      required: true
    },
    initiativePlayer: {
      type: String as PropType<Player>,
      required: true
    }
  },
  computed: {
    weathers() : Weather[] {
      return Object.values(Weather)
    },
    isPlayer() : boolean {
      return this.player == Player.PLAYER
    }
  },
  methods: {
    claimedInitiative(payload : {player:Player}) : void {
      this.$emit('updateInitiativePlayer',{player:payload.player})
    },
    isCitationUnlocked(weather : Weather) : boolean {
      return this.citationUnlock.includes(weather)
    },
    openUnlockCitationModal(weather : Weather) : void {
      if (!this.isPlayer) {
        return
      }
      this.unlockCitationWeather = weather
      const modal = new Modal(document.getElementById('modalUnlockCitation') as Element)
      modal.show()
    },
    callSecurity(payload: CallSecurityAction[]) : void {
      this.$emit('callSecurity', payload)
    },
    unlockCitation(weather : Weather) : void {
      const updatedCitationUnlock = this.citationUnlock
      updatedCitationUnlock.push(weather)
      this.$emit('updateCitationUnlock', {citationUnlock:updatedCitationUnlock})
    },
    lockCitation(weather : Weather) : void {
      const updatedCitationUnlock = this.citationUnlock.filter(item => item != weather)
      this.$emit('updateCitationUnlock', {citationUnlock:updatedCitationUnlock})
    }
  }
})
</script>

<style lang="scss" scoped>
.sidebar {
  float: right;
  width: 15rem;
  margin-left: 1rem;
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
  margin-right: -1rem;
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
      filter: drop-shadow(0.1rem 0.1rem 0.3rem #aaa);
      &.clickable {
        cursor: pointer;
      }
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
