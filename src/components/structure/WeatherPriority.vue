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
      required: true
    }
  },
  computed: {
    allWeathers() : Weather[] {
      return getPrioritizedEnumValues(Weather,this.weather)
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
