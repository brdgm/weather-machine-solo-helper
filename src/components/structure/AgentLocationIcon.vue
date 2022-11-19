<template>
  <div class="icon-container">
    <AppIcon type="agent" :name="agent" class="agent"/>
    <AppIcon name="arrow" class="arrow"/>
    <AppIcon type="location" :name="location" class="location"/>
    <AppIcon v-if="actionSlot" type="action-slot" :name="actionSlot" class="action-slot"/>
  </div>
</template>

<script lang="ts">
import ActionSlot from '@/services/enum/ActionSlot'
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
    },
    actionSlot: {
      type: Object as PropType<ActionSlot>,
      required: false
    }
  }
})
</script>

<style lang="scss" scoped>
.icon-container {
  display: inline-block;
  position: relative;
  margin-right: 2rem;
  .agent {
    position: relative;
    height: 5rem;
    z-index: 100;
  }
  .arrow {
    position: relative;
    width: 3rem;
    margin-left: -1.5rem;
  }
  .location {
    height: 5rem;
  }
  .action-slot {
    margin-left: 1rem;
    width: 2rem;
  }
}
</style>