<template>
  <div>
    <span v-html="t('turnSaboteur.actions.rndPlaceBotPreviousReportPriority.text')"></span><br/>
    <AppIcon name="rnd-place-bot" class="icon"/>
    <AppIcon type="selection-priority" :name="selectionPriority" class="icon selection-priority"/>
    <AppIcon v-if="actionStep.weatherBranchChosen" type="weather" :name="actionStep.weatherBranchChosen" class="icon weather ms-3 mt-2"/>
    <ChooseWeatherBranch v-else :weathers="weatherPriorities" class="mt-2"
        :hide-not-possible="true"
        @choose-weather="chooseWeatherBranch" @choose-weather-no-match="chooseWeatherBranchNoMatch"/>
  </div>
</template>

<script lang="ts">
import AppIcon from '@/components/structure/AppIcon.vue'
import ChooseWeatherBranch from '@/components/structure/ChooseWeatherBranch.vue'
import ActionContextParams from '@/services/ActionContextParams'
import ActionStep from '@/services/ActionStep'
import SelectionPriority from '@/services/enum/SelectionPriority'
import Weather from '@/services/enum/Weather'
import getPrioritizedEnumValues from '@brdgm/brdgm-commons/src/util/enum/getPrioritizedEnumValues'
import { defineComponent, PropType } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'RndPlaceBotPreviousReportPriority',
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
      return getPrioritizedEnumValues(Weather, this.actionContextParams.weatherPriority)
    },
    selectionPriority() : SelectionPriority {
      return this.actionContextParams.selectionPriority
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
div > div, div > img {
  margin-top: 0.5rem;
  margin-right: 1rem;
  vertical-align: middle;
}
.icon {
  height: 4rem;
  &.selection-priority {
    height: 3rem;
  }
}
</style>
