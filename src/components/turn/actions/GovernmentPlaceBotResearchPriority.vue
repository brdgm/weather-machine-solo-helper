<template>
  <div>
    <span v-html="t('turnSaboteur.actions.governmentPlaceBotResearchPriority.text')"></span><br/>
    <AppIcon name="government-place-bot" class="icon mt-2"/>
    <WeatherPriority :weathers="weatherPriorities" class="ms-3 mt-2"/>
    <AppIcon name="pay-chemical" class="icon pay-chemcial ms-3 mt-2"/>
  </div>
</template>

<script lang="ts">
import AppIcon from '@/components/structure/AppIcon.vue'
import WeatherPriority from '@/components/structure/WeatherPriority.vue'
import ActionStep from '@/services/ActionStep'
import Weather from '@/services/enum/Weather'
import TokenCollector from '@/services/TokenCollector'
import { defineComponent, PropType } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'GovernmentPlaceBotResearchPriority',
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
    }
  },
  computed: {
    weatherPriorities() : Weather[] {
      const tokenCollector = new TokenCollector(this.actionStep.tokens ?? [],
          this.actionStep.citationUnlock ?? [],
          this.actionStep.weatherPriority ?? Weather.RAIN)
      return tokenCollector.getWeatherPrioritizationToCompleteSet()
    }
  }
})
</script>

<style lang="scss" scoped>
.icon {
  height: 3rem;
  &.pay-chemcial {
    height: 2.5rem;
  }
}
</style>