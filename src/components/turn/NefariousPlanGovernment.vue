<template>
  <div style="border:1px solid red;">
    ...
  </div>
</template>

<script lang="ts">
import ActionSlot from '@/services/enum/ActionSlot'
import { defineComponent, PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import AppIcon from '../structure/AppIcon.vue'

export default defineComponent({
  name: 'NefariousPlanGovernment',
  components: {
    AppIcon
  },
  setup() {
    const { t } = useI18n()
    return { t }
  },
  props: {
    actionSlot: {
      type: Object as PropType<ActionSlot>,
      required: true
    }
  }
})
</script>

<style lang="scss" scoped>

</style>