<template>
  <div class="icon-container">
    <div class="agent-container">
      <AppIcon type="agent" :name="agent" class="agent"/>
      <AppIcon name="arrow" class="arrow"/>
    </div>
    <div v-for="location of mainLocations" :key="location" class="select-container">
      <AppIcon type="location" :name="location" class="location"/><br/>
      <template v-if="location=='supply'">
        <AppIcon name="action-slot-priority-supply" class="slot-priority-icon"/>
        <button class="btn btn-primary btn-sm" @click="selectLocation(location)">{{t('agentLocationSelection.select')}}</button>
      </template>
      <template v-else>
        <AppIcon name="action-slot-priority" class="slot-priority-icon"/><br/>
        <button class="btn btn-danger btn-sm" @click="selectLocationAnd(location)">{{t('agentLocationSelection.selectA')}}</button>
        <button class="btn btn-secondary btn-sm" @click="selectLocationOr(location)">{{t('agentLocationSelection.selectBC')}}</button>
      </template>
      <AppIcon v-if="isFollowLativ" type="location" name="follow-lativ" class="follow-lativ"/><br/>
    </div>
    <div v-for="location of alternativeLocations" :key="location" class="select-container">
      <AppIcon type="location" :name="location" class="location alternative"/><br/>
      <AppIcon name="action-slot-priority" class="action-slot-priority-icon alternative"/><br/>
      <button class="btn btn-danger btn-sm" @click="selectLocationAnd(location)">{{t('agentLocationSelection.selectA')}}</button>
      <button class="btn btn-secondary btn-sm"  @click="selectLocationOr(location)">{{t('agentLocationSelection.selectBC')}}</button>
    </div>
  </div>
</template>

<script lang="ts">
import Agent from '@/services/enum/Agent'
import Location from '@/services/enum/Location'
import ActionSlot from '@/services/enum/ActionSlot'
import { defineComponent, PropType } from 'vue'
import AppIcon from '../structure/AppIcon.vue'
import MainLocations from "@/util/MainLocations"
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'AgentLocationSelection',
  components: {
    AppIcon
  },
  emits: {
    locationSelected(payload:{location: Location, actionSlot?: ActionSlot}) {
      return payload != undefined
    }
  },
  setup() {
    const { t } = useI18n()
    return { t }
  },
  props: {
    agent: {
      type: String as PropType<Agent>,
      required: true
    },
    location: {
      type: String as PropType<Location>,
      required: true
    }
  },
  computed: {
    isFollowLativ() : boolean {
      return this.location == Location.FOLLOW_LATIV
    },
    mainLocations() : Location[] {
      if (this.isFollowLativ) {
        return [...MainLocations,Location.SUPPLY]
      }
      else {
        return [this.location]
      }
    },
    alternativeLocations() : Location[] {      
      if (!MainLocations.includes(this.location)) {
        return []
      }
      const result = []
      const currentLocationIndex = MainLocations.indexOf(this.location)
      for (let i=currentLocationIndex+1; i<MainLocations.length; i++) {
        result.push(MainLocations[i])
      }
      for (let i=0; i<currentLocationIndex; i++) {
        result.push(MainLocations[i])
      }
      return result
    }
  },
  methods: {
    selectLocation(location : Location, actionSlot?: ActionSlot) {
      this.$emit('locationSelected', {location:location, actionSlot:actionSlot})
    },
    selectLocationAnd(location : Location) {
      this.selectLocation(location, ActionSlot.AND)
    },
    selectLocationOr(location : Location) {
      this.selectLocation(location, ActionSlot.OR)
    }
  }
})
</script>

<style lang="scss" scoped>
.icon-container {
  display: inline-block;
  position: relative;
  > * {
    display: inline-block;
    vertical-align: top;
    position: relative;
  }
  .agent {
    position: relative;
    height: 6rem;
    z-index: 100;
  }
  .arrow {
    position: relative;
    width: 3rem;
    margin-left: -1.5rem;
  }
  .location {
    height: 6rem;
    &.alternative {
      margin-top: 2.25rem;
      height: 4rem;
    }
  }
  .follow-lativ {
    position: absolute;
    height: 3.5rem;
    left: 0;
    top: 3rem;
  }
  .agent-container {
    vertical-align: top;
  }
  .select-container {
    width: 5rem;
    margin-right: 0.5rem;    
    text-align: center;
    button {
      margin-top: 0.5rem;
    }
  }
  .action-slot-priority-icon {
    width: 4rem;
    &.alternative {
      width: 3rem;
    }
  }
  .slot-priority-icon {
    width: 5rem;
  }
}
</style>