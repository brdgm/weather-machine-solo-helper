<template>
  <div class="icon-container">
    <AppIcon v-for="index in count" :key="index" name="take-chemical" class="icon"/>
    <AppIcon type="selection-priority" :name="selectionPriority" class="icon"/>
    <button class="btn btn-outline-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#modalTakeChemical">
      {{t('takeChemical.title')}}
    </button>
  </div>

  <ModalDialog id="modalTakeChemical" :title="t('takeChemical.title')"
      :size-lg="true" :scrollable="true">
    <template #body>
      <ol>
        <li>
          <AppIcon name="chemical-priority-section" class="icon chemical-priority-section"/>
          <span v-html="t('takeChemical.prioritySection')"></span>
        </li>
        <li>
          <AppIcon name="chemical-priority-least-available" class="icon chemical-priority-least-available"/>
          <span v-html="t('takeChemical.priorityLeastAvailable')"></span>
        </li>
        <li>
          <AppIcon type="selection-priority" :name="selectionPriority" class="icon selection-priority"/>
          <span v-html="t(`takeChemical.prioritySelection.${selectionPriority}`)"></span>
        </li>
      </ol>
    </template>
  </ModalDialog>

</template>

<script lang="ts">
import SelectionPriority from '@/services/enum/SelectionPriority'
import { defineComponent, PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import AppIcon from './AppIcon.vue'
import ModalDialog from 'brdgm-commons/src/components/structure/ModalDialog.vue'

export default defineComponent({
  name: 'TakeChemicals',
  components: {
    AppIcon,
    ModalDialog
  },
  setup() {
    const { t } = useI18n()
    return { t }
  },
  props: {
    count: {
      type: Number,
      required: true
    },
    selectionPriority: {
      type: String as PropType<SelectionPriority>,
      required: true
    }
  }
})
</script>

<style lang="scss" scoped>
.icon-container {
  display: inline-block;
  .icon {
    height: 3rem;
    margin-right: 0.5rem;
  }
  button {
    margin-left: 0.5rem;
  }
}
.modal-content {
  li {
    clear: both;
  }
  .icon {
    float: right;
    height: 6rem;
    margin-left: 1rem;
    margin-bottom: 1rem;
    &.chemical-priority-least-available {
      padding-left: 3rem;
      padding-right: 3rem;
    }
    &.selection-priority {
      padding-left: 2rem;
      padding-right: 2rem;
    }
  }
}
</style>