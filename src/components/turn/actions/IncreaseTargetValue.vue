<template>
  <div>
    <span v-html="t('turnSaboteur.actions.increaseTargetValue.text',{count:actionStep.count})"></span><br/>
    <TargetValue :value="actionStep.count ?? 0" class="mt-2"/>
  </div>
</template>

<script lang="ts">
import TargetValue from '@/components/structure/TargetValue.vue'
import ActionContextParams from '@/services/ActionContextParams'
import ActionStep from '@/services/ActionStep'
import { defineComponent, PropType } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'IncreaseTargetValue',
  components: {
    TargetValue
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
  }
})
</script>
