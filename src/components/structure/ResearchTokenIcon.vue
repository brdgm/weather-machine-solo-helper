<template>
  <div class="icon-container">
    <AppIcon type="weather" :name="weather" class="weather"/>
    <AppIcon type="research-token" :name="location" class="token"/>
  </div>
</template>

<script lang="ts">
import Location from '@/services/enum/Location'
import Weather from '@/services/enum/Weather'
import { defineComponent, PropType } from 'vue'
import AppIcon from './AppIcon.vue'

export default defineComponent({
  name: 'ResearchTokenIcon',
  components: {
    AppIcon
  },
  props: {
    location: {
      type: Object as PropType<Location>,
      required: true
    },
    weather: {
      type: Object as PropType<Weather>,
      required: true
    }
  }
})
</script>

<style lang="scss" scoped>
.icon-container {
  display: inline-block;
  position: relative;
  width: 4rem;
  .token {
    width: 100%;
  }
  .weather {
    position: absolute;
    width: 60%;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    top: 15%;
    filter: drop-shadow(0.1rem 0.1rem 0.1rem #aaa);
  }
}
</style>