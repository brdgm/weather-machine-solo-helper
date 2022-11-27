<template>
  <div>
    <span v-if="actionStep.alternativeActionsTaken == undefined" v-html="t('turnSaboteur.actions.increaseTargetValueOrDiscardSecurityReport.text',{count:actionStep.count})"></span>
    <span v-else v-html="t('turnSaboteur.actions.increaseTargetValue.text',{count:actionStep.count})"></span><br/>
    <TargetValue :value="actionStep.count ?? 0" class="mt-2"/>
    <div v-if="actionStep.alternativeActionsTaken == undefined" class="decision">
      <span v-html="t('turnSaboteur.actions.increaseTargetValueOrDiscardSecurityReport.increaseTargetValueOrDiscardSecurityReport')"></span><br/>
      <button class="btn btn-success" @click="doAlternativeAction(false)">
        {{t('action.yes')}}
      </button>
      <button class="btn btn-danger" @click="doAlternativeAction(true)">
        {{t('action.no')}}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import TargetValue from '@/components/structure/TargetValue.vue'
import ActionContextParams from '@/services/ActionContextParams'
import ActionStep from '@/services/ActionStep'
import { defineComponent, PropType } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'IncreaseTargetValueOrDiscardSecurityReport',
  components: {
    TargetValue
  },
  emits: {
    alternativeAction(payload:{alternativeActionsTaken:boolean}) {
      return payload != undefined
    }
  },
  setup() {
    const { t } = useI18n()
    return { t }
  },
  props: {
    actionStep: {
      type: Object as PropType<ActionStep>,
      required: true
    },
    actionContextParams: {
      type: Object as PropType<ActionContextParams>,
      required: true
    }
  },
  methods: {
    doAlternativeAction(alternativeActionsTaken:boolean) : void {
      this.$emit('alternativeAction',{alternativeActionsTaken:alternativeActionsTaken})
    }
  }
})
</script>

<style lang="scss" scoped>
.decision {
  display: inline-block;
  margin-left: 1rem;
  span {
    font-weight: bold;
    color: green;
  }
  button {
    margin-right: 0.5rem;
  }
}
</style>