<template>
  <div>
    <span v-html="t('turnSaboteur.actions.governmentPlaceBotResearchPriority.text')"></span><br/>
    <AppIcon name="government-place-bot-pay-chemical" class="icon mt-2"/>
  </div>
</template>

<script lang="ts">
import AppIcon from '@/components/structure/AppIcon.vue'
import ActionStep from '@/services/ActionStep'
import { defineComponent, PropType } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'GovernmentPlaceBotResearchPriority',
  components: {
    AppIcon
  },
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
<style lang="scss" scoped>
.icon {
  height: 3rem;
}
</style>