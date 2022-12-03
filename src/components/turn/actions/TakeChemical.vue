<template>
  <div>
    <span v-html="t('turnSaboteur.actions.takeChemicals.text',{count:actionStep.count})"></span>
    <div class="mt-2">
      <TakeChemicals :count="actionStep.count ?? 0" :selection-priority="selectionPriority"/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import TakeChemicals from '@/components/structure/TakeChemicals.vue'
import ActionStep from '@/services/ActionStep'
import SelectionPriority from '@/services/enum/SelectionPriority'
import ActionContextParams from '@/services/ActionContextParams'

export default defineComponent({
  name: 'TakeChemical',
  components: {
    TakeChemicals
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
  },
  computed: {
    selectionPriority() : SelectionPriority {
      return this.actionContextParams.selectionPriority
    }
  }
})
</script>
