<template>
  <div>
    <span v-html="t('turnSaboteur.actions.rndPlaceChemical.text')"></span><br/>
    <AppIcon name="rnd-place-chemical" class="icon mt-2"/>
  </div>
</template>

<script lang="ts">
import ActionStep from '@/services/ActionStep'
import { defineComponent, PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import AppIcon from '@/components/structure/AppIcon.vue'
import ActionContextParams from '@/services/ActionContextParams'

export default defineComponent({
  name: 'RndPlaceChemical',
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
    },
    actionContextParams: {
      type: Object as PropType<ActionContextParams>,
      required: true
    }
  }
})
</script>

<style lang="scss" scoped>
.icon {
  width: 3rem;
}
</style>
