<template>
  <div>
    <span v-html="t('turnSaboteur.actions.governmentPlaceBotResearchPriority.text')"></span><br/>
    <AppIcon name="government-place-bot" class="icon mt-2"/>
    <AppIcon name="pay-chemical" class="icon pay-chemcial ms-3 mt-2"/>
    <AppIcon v-if="actionStep.weatherBranchChosen" type="weather" :name="actionStep.weatherBranchChosen" class="icon weather ms-3 mt-2"/>
    <ChooseWeatherBranch v-else :weathers="weatherPriorities" class="mt-2"
        @choose-weather="chooseWeatherBranch" @choose-weather-no-match="chooseWeatherBranchNoMatch"/>
  </div>
</template>

<script lang="ts">
import AppIcon from '@/components/structure/AppIcon.vue'
import ChooseWeatherBranch from '@/components/structure/ChooseWeatherBranch.vue'
import ActionContextParams from '@/services/ActionContextParams'
import ActionStep from '@/services/ActionStep'
import Location from '@/services/enum/Location'
import Weather from '@/services/enum/Weather'
import TokenCollector from '@/services/TokenCollector'
import { defineComponent, PropType } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'GovernmentPlaceBotResearchPriority',
  components: {
    AppIcon,
    ChooseWeatherBranch
  },
  emits: {
    chooseWeatherBranch(payload:{weatherBranchChosen:Weather}) {
      return payload != undefined
    },
    chooseWeatherBranchNoMatch() {
      return true
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
  computed: {
    weatherPriorities() : Weather[] {
      const tokenCollector = new TokenCollector(this.actionContextParams.tokens,
          this.actionContextParams.citationUnlock,
          this.actionContextParams.weatherPriority)
      return tokenCollector.getWeatherPrioritizationToCompleteSet(Location.GOVERNMENT)
    }
  },
  methods: {
    chooseWeatherBranch(payload:{weather:Weather}) {
      this.$emit('chooseWeatherBranch',{weatherBranchChosen:payload.weather})
    },
    chooseWeatherBranchNoMatch() : void {
      this.$emit('chooseWeatherBranchNoMatch')
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
  &.weather {
    height: 2.5rem;
  }
}
</style>