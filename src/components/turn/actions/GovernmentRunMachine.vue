<template>
  <div>
    <span v-html="t('turnSaboteur.actions.governmentRunMachine.text')"></span><br/>
    <AppIcon name="government-run-machine" class="icon mt-2"/>
  </div>
</template>

<script lang="ts">
import ActionStep from '@/services/ActionStep'
import AppIcon from '@/components/structure/AppIcon.vue'
import { defineComponent, PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import ActionContextParams from '@/services/ActionContextParams'

export default defineComponent({
  name: 'GovernmentRunMachine',
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
    },
    actionContextParams: {
      type: Object as PropType<ActionContextParams>,
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
