<template>
  <div>
    <p v-html="t('turnSaboteur.actions.claimInitiative.text')"></p>
  </div>
</template>

<script lang="ts">
import ActionContextParams from '@/services/ActionContextParams'
import ActionStep from '@/services/ActionStep'
import { defineComponent, PropType } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'ClaimInitiative',
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
