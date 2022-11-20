<template>
  <div>
    <span v-html="t('turnSaboteur.actions.getAwardToken.text')"></span><br/>
    <AppIcon name="award-token" class="token mt-2"/>
  </div>
</template>

<script lang="ts">
import AppIcon from '@/components/structure/AppIcon.vue'
import ActionStep from '@/services/ActionStep'
import { defineComponent, PropType } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'GetAwardToken',
  components: {
    AppIcon
  },
  setup() {
    const { t } = useI18n()
    return { t }
  },
  props: {
    actionStep: {
      type: Object as PropType<ActionStep>,
      required: true
    }
  }
})
</script>

<style lang="scss" scoped>
.token {
  width: 5rem;
  filter: drop-shadow(0.1rem 0.1rem 0.3rem #aaa);
}
</style>