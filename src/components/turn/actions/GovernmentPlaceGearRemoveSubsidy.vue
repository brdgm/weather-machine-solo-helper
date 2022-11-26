<template>
  <div>
    <span v-html="t(`turnSaboteur.actions.governmentPlaceGearRemoveSubsidy.text-${selectionPriority}`)"></span><br/>
    <AppIcon name="government-place-gear-remove-subsidy" class="icon mt-2"/>
    <AppIcon type="weather" :name="weatherBranch" class="icon weather ms-3 mt-2"/>
    <AppIcon type="selection-priority" :name="selectionPriority" class="icon mt-2 ms-3"/>
  </div>
</template>

<script lang="ts">
import AppIcon from '@/components/structure/AppIcon.vue'
import ActionContextParams from '@/services/ActionContextParams'
import ActionStep from '@/services/ActionStep'
import SelectionPriority from '@/services/enum/SelectionPriority'
import Weather from '@/services/enum/Weather'
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
    },
    actionContextParams: {
      type: Object as PropType<ActionContextParams>,
      required: true
    }
  },
  computed: {
    selectionPriority() : SelectionPriority {
      return this.actionContextParams.selectionPriority
    },
    weatherBranch() : Weather {
      return this.actionStep.weatherBranchChosen || Weather.RAIN
    }
  }
})
</script>

<style lang="scss" scoped>
.icon {
  height: 3rem;
  &.weather {
    height: 2.5rem;
  }
}
</style>
