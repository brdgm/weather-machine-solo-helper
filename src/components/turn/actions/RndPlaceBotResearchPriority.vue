<template>
  <div>
    <p v-html="t('turnSaboteur.actions.rndPlaceBotResearchPriority.text')"></p>
  </div>
</template>

<script lang="ts">
import ActionStep from '@/services/ActionStep'
import { defineComponent, PropType } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'RndPlaceBotResearchPriority',
  setup() {
    const { t } = useI18n()
    return { t }
  },
  props: {
    actionStep: {
      type: Object as PropType<ActionStep>,
      required: true
    }
  }
})
</script>
