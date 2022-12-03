<template>
  <div>
    <span v-html="t('turnSaboteur.actions.governmentFlipSubsidy.text')"></span><br/>
    <AppIcon name="government-subsidy-flip" class="icon"/>
    <WeatherPriority :weather="weatherPriority" class="me-3"/>
    <AppIcon type="selection-priority" :name="selectionPriority" class="icon"/>
  </div>
</template>

<script lang="ts">
import AppIcon from '@/components/structure/AppIcon.vue'
import WeatherPriority from '@/components/structure/WeatherPriority.vue'
import ActionContextParams from '@/services/ActionContextParams'
import ActionStep from '@/services/ActionStep'
import SelectionPriority from '@/services/enum/SelectionPriority'
import Weather from '@/services/enum/Weather'
import { defineComponent, PropType } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'GovernmentFlipSubsidy',
  components: {
    AppIcon,
    WeatherPriority
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
  computed: {
    weatherPriority() : Weather {
      return this.actionContextParams.weatherPriority
    },
    selectionPriority() : SelectionPriority {
      return this.actionContextParams.selectionPriority
    }
  }
})
</script>

<style lang="scss" scoped>
div > div, div > img {
  margin-top: 0.5rem;
  margin-right: 1rem;
  vertical-align: middle;
}
.icon {
  height: 3rem;
}
</style>