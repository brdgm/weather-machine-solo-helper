<template>
  <ol type="i">
    <li>aaa</li>
    <li>bbb</li>
  </ol>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'NefariousPlanSupply',
  components: {
  },
  setup() {
    const { t } = useI18n()
    return { t }
  }
})
</script>

<style lang="scss" scoped>

</style>