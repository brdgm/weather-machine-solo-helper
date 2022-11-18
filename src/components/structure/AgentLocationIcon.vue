<template>
  <div class="icon-container">
    <AppIcon type="agent" :name="agent" class="agent"/>
    <AppIcon name="arrow" class="arrow"/>
    <AppIcon type="location" :name="location" class="agent"/>
  </div>
</template>

<script lang="ts">
import Agent from '@/services/enum/Agent'
import Location from '@/services/enum/Location'
import { defineComponent, PropType } from 'vue'
import AppIcon from '../structure/AppIcon.vue'

export default defineComponent({
  name: 'AgentLocationIcon',
  components: {
    AppIcon
  },
  props: {
    agent: {
      type: Object as PropType<Agent>,
      required: true
    },
    location: {
      type: Object as PropType<Location>,
      required: true
    }
  }
})
</script>

<style lang="scss" scoped>
.icon-container {
  display: inline-block;
  position: relative;
  .agent {
    height: 5rem;
  }
  .arrow {
    position: relative;
    width: 3rem;
    margin-left: -1.5rem;
    z-index: -100;
  }
  .location {
    height: 5rem;
  }
}
</style>