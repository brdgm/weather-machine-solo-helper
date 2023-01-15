<template>
  <ModalDialog id="modalCallSecurity" :title="t('callSecurity.title')"
      :size-lg="true" :scrollable="true">
    <template #body>
      <template v-if="!securityCalled">
        <p v-html="t('callSecurity.confirm')"></p>
        <p v-html="t('callSecurity.payVoucher')"></p>
      </template>
      <template v-else>
        <div class="report-container" v-for="(card,cardIndex) of reports" :key="cardIndex">
          <div class="report">
            <div>
              <AgentLocationIcon :agent="card.agent" :location="card.location" class="mt-2"/>
            </div>
            <div class="mt-2">
              {{t('sidebar.priority')}}<br/>
              <AppIcon type="weather" :name="card.weather" class="weather-icon mt-2"/>
              <AppIcon type="selection-priority" :name="card.selectionPriority" class="selection-priority-icon mt-2"/>
            </div>
          </div>
          <div v-for="action of callSecurityCardActions" :key="action">
            <input class="form-check-input" type="radio" :id="`report-${cardIndex}-${action}`" :value="action"
                v-model="callSecurityCardAction[cardIndex]" @change="callSecurityCardActionChanged(cardIndex)">
            <label class="form-check-label" :for="`report-${cardIndex}-${action}`">
              {{t(`callSecurity.report.${action}`)}}
            </label>
          </div>
        </div>
      </template>
    </template>
    <template #footer>
      <button v-if="!securityCalled" type="button" class="btn btn-danger" @click="doCallSecurity()">{{t('callSecurity.title')}}</button>
      <button v-else type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="finishCallSecurity()">{{t('callSecurity.finish')}}</button>
      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="reset()">{{t('action.cancel')}}</button>
    </template>
  </ModalDialog>
</template>

<script lang="ts">
import CallSecurityCardAction from '@/services/enum/CallSecurityCardAction'
import AgentLocationIcon from '../structure/AgentLocationIcon.vue'
import AppIcon from '../structure/AppIcon.vue'
import ModalDialog from 'brdgm-commons/src/components/structure/ModalDialog.vue'
import Card from '@/services/Card'
import { CallSecurityAction } from '@/services/CardDeck'
import { useStore } from '@/store'
import { defineComponent, PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import getAllEnumValues from 'brdgm-commons/src/util/enum/getAllEnumValues'

export default defineComponent({
  name: 'CallSecurityModal',
  components: {
    AgentLocationIcon,
    AppIcon,
    ModalDialog
  },
  emits: {
    callSecurity(payload: CallSecurityAction[]) {
      return payload != undefined
    }
  },
  setup() {
    const { t } = useI18n()
    useStore()
    return { t }
  },
  props: {
    currentReport: {
      type: Object as PropType<Card>,
      required: true
    },
    deck: {
      type: Object as PropType<readonly Card[]>,
      required: true
    }
  },
  data() {
    return {
      securityCalled: false,
      callSecurityCardAction: [CallSecurityCardAction.PUT_BACK,CallSecurityCardAction.MAKE_CURRENT,CallSecurityCardAction.DISCARD]
    }
  },
  computed: {
    reports() : Card[] {
      const cards : Card[] = []
      // draw two cards from deck and put them next to the current report
      cards.push(this.deck[0])
      cards.push(this.currentReport)
      cards.push(this.deck[1])
      return cards
    },
    callSecurityCardActions() : CallSecurityCardAction[] {
      return getAllEnumValues(CallSecurityCardAction)
    }
  },
  methods: {
    doCallSecurity() : void {
      this.securityCalled = true
    },
    finishCallSecurity() : void {
      const actions = []
      for (let i=0; i<this.reports.length; i++) {
        actions[i] = { card: this.reports[i], callSecurityCardAction: this.callSecurityCardAction[i] }
      }
      this.$emit('callSecurity', actions)
      this.reset()
    },
    reset() : void {
      this.securityCalled = false
      this.callSecurityCardAction = [CallSecurityCardAction.PUT_BACK,CallSecurityCardAction.MAKE_CURRENT,CallSecurityCardAction.DISCARD]
    },
    callSecurityCardActionChanged(cardIndex : number) : void {
      for (let i=0; i<this.callSecurityCardAction.length; i++) {
        if (i != cardIndex) {
          if (this.callSecurityCardAction[i] == this.callSecurityCardAction[cardIndex]) {
            this.callSecurityCardAction[i] = this.getAvailableSecurityCardAction()
          }
        }
      }
    },
    getAvailableSecurityCardAction() : CallSecurityCardAction {
      return this.callSecurityCardActions.filter(item => !this.callSecurityCardAction.includes(item))[0]
    }
  }
})
</script>

<style lang="scss" scoped>
.report-container {
  display: inline-block;
  margin-right: 1rem;
}
.report {
  padding: 1rem;
  background-color: #f3e7d8;
  border: 4px double #f2d6c5;
  border-radius: 1rem;
  filter: drop-shadow(0.1rem 0.1rem 0.3rem #aaa);
  margin-bottom: 1rem;
  .weather-icon {
    width: 2.5rem;
  }
  .selection-priority-icon {
    width: 2rem;
    margin-left: 1rem;
  }
}
.form-check-input {
  margin-left: 0.5rem;
  margin-right: 0.5rem;
}
</style>
