<template>
  <div class="icon-container">
    <AppIcon type="agent" :name="agent" class="agent"/>
    <AppIcon name="arrow" class="arrow"/>
    <AppIcon type="location" :name="location" class="location"/>
    <div v-if="showAlternativeLocations && alternativeLocations.length > 0" class="alternativeLocations">
      <AppIcon v-for="(item,index) of alternativeLocations" :key="item" type="location" :name="item" :class="`location alternative${index+1}`"/>
      <AppIcon name="action-slot-priority" class="action-slot-priority-icon"/>
    </div>
    <AppIcon v-if="showAlternativeLocations && location=='follow-lativ'" name="action-slot-priority-follow-lativ" class="action-slot-priority-follow-lativ-icon"/>
    <AppIcon v-if="showAlternativeLocations && location=='supply'" name="action-slot-priority-supply" class="action-slot-priority-supply-icon"/>
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
    },
    showAlternativeLocations: {
      type: Boolean,
      required: false
    }
  },
  computed: {
    alternativeLocations() : Location[] {
      const mainLocations = [Location.GOVERNMENT, Location.LATIVS_LAB, Location.RND]
      if (!mainLocations.includes(this.location)) {
        return []
      }
      const result = []
      const currentLocationIndex = mainLocations.indexOf(this.location)
      for (let i=currentLocationIndex+1; i<mainLocations.length; i++) {
        result.push(mainLocations[i])
      }
      for (let i=0; i<currentLocationIndex; i++) {
        result.push(mainLocations[i])
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
  .alternativeLocations {
    position: absolute;
    height: 100%;
    z-index: -100;
    display: inline-block;
    .location {
      position: absolute;
      height: 2.5rem;
      &.alternative1 {
        top: 0;
        left: -0.5rem;
      }
      &.alternative2 {
        top: 1.5rem;
        left: 0.5rem;
        z-index: -200;
      }
    }
  }
  .action-slot-priority-icon {
    width: 5rem;
    margin-top: 3.25
    rem;
    margin-left: 3rem;
  }
  .action-slot-priority-follow-lativ-icon {
    margin-left: 1rem;
    width: 5rem;
  }
  .action-slot-priority-supply-icon {
    margin-left: 0.5rem;
    margin-top: 3.25rem;
    width: 6rem;
  }
}
</style>