<template>
  <AppIcon name="challenge-card" class="challenge-icon"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppIcon from './AppIcon.vue'

export default defineComponent({
  name: 'ChallengeIcon',
  components: {
    AppIcon
  }
})
</script>

<style lang="scss" scoped>
.challenge-icon {
  height: 1rem;
  margin-top: -0.15rem;
  margin-right: 0.25rem;
}
</style>