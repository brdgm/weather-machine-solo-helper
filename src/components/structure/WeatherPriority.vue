<template>
  <div class="icon-container">
    <AppIcon type="weather" :name="weather" class="icon"/>
    <AppIcon v-for="alternativeWeather of alternativeWeathers" :key="alternativeWeather"
         type="weather" :name="alternativeWeather" class="icon alternative"/>
  </div>
</template>

<script lang="ts">
import Weather from '@/services/enum/Weather';
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
      required: true
    }
  },
  computed: {
    alternativeWeathers() : Weather[] {
      const allWeather = Object.values(Weather)
      const currentWeatherIndex = allWeather.indexOf(this.weather)
      const result : Weather[] = []
      for (let i=currentWeatherIndex+1; i<allWeather.length; i++) {
        result.push(allWeather[i])
      }
      for (let i=0; i<currentWeatherIndex; i++) {
        result.push(allWeather[i])
      }
      return result
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
      width: 1.5rem;
      margin-left: -0.5rem;
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
