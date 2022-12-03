<template>
  <div class="icon-container">
    <div class="number">{{value}}</div>
    <AppIcon name="target-value" class="icon"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppIcon from './AppIcon.vue'

export default defineComponent({
  name: 'TargetValue',
  components: {
    AppIcon
  },
  props: {
    value: {
      type: Number,
      required: true
    }
  }
})
</script>

<style lang="scss" scoped>
.icon-container {
  display: inline-block;
  position: relative;
  width: 3.5rem;
  .icon {
    width: 100%;
  }
  .number {
    position: absolute;
    width: 100%;
    top: 0.25rem;
    height: 100%;
    z-index: 100;
    text-align: center;
    color: white;
    font-size: 1.75rem;
    font-weight: bold;
  }
}
</style>