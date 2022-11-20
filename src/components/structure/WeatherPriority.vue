<template>
  <div class="icon-container">
    <AppIcon v-for="(weather,index) of allWeathers" :key="weather" type="weather" :name="weather"
        class="icon" :class="{alternative:index > 0}"/>
  </div>
</template>

<script lang="ts">
import Weather from '@/services/enum/Weather';
import getPrioritizedEnumValues from '@/util/getPrioritizedEnumValues';
import { defineComponent, PropType } from 'vue'
import AppIcon from './AppIcon.vue'

export default defineComponent({
  name: 'WeatherPriority',
  components: {
    AppIcon
  },
  props: {
    weather: {
      type: String as PropType<Weather>,
      required: false
    },
    weathers: {
      type: Object as PropType<Weather[]>,
      required: false
    }
  },
  computed: {
    allWeathers() : Weather[] {
      if (this.weathers) {
        return this.weathers
      }
      else {
        return getPrioritizedEnumValues(Weather, this.weather ?? Weather.RAIN)
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.icon-container {
  display: inline-block;
  position: relative;
  .icon {
    position: relative;
    width: 2.5rem;
    &.alternative {
      width: 2rem;
      margin-left: -0.25rem;
      vertical-align: bottom;
    }
  }
  :nth-child(2) {
    z-index: -10;
  }
  :nth-child(3) {
    z-index: -20;
  }
  :nth-child(4) {
    z-index: -30;
  }
  :nth-child(5) {
    z-index: -40;
  }
}
</style>
