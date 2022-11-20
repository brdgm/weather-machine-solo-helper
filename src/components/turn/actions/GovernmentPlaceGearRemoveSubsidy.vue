<template>
  <div>
    <span v-html="t(`turnSaboteur.actions.governmentPlaceGearRemoveSubsidy.text-${selectionPriority}`)"></span><br/>
    <AppIcon name="government-place-gear-remove-subsidy" class="icon mt-2"/>
    <AppIcon type="selection-priority" :name="selectionPriority" class="icon mt-2 ms-3"/>
  </div>
</template>

<script lang="ts">
import AppIcon from '@/components/structure/AppIcon.vue'
import ActionStep from '@/services/ActionStep'
import SelectionPriority from '@/services/enum/SelectionPriority'
import { defineComponent, PropType } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'GovernmentPlaceGearRemoveSubsidy',
  setup() {
    const { t } = useI18n()
    return { t }
  },
  components: {
    AppIcon
  },
  props: {
    actionStep: {
      type: Object as PropType<ActionStep>,
      required: true
    }
  },
  computed: {
    selectionPriority() : SelectionPriority {
      return this.actionStep.selectionPriority || SelectionPriority.TOP
    }
  }
})
</script>

<style lang="scss" scoped>
.icon {
  height: 3rem;
}
</style>