<template>
  <div class="mt-2 mb-2">
    <AppIcon name="moving-lativ" class="icon"/>
    <button class="btn btn-outline-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#modalLativMovement">
      {{t('lativMovement.title')}}
    </button>
  </div>

  <ModalDialog id="modalLativMovement" :title="t('lativMovement.title')"
      :size-lg="true" :scrollable="true">
    <template #body>
      <p v-html="t('lativMovement.nextLocation')"></p>
      <ul>
        <li v-html="t('lativMovement.weatherMachineActiveBranch')"></li>
        <ul class="small">
          <li v-html="t('lativMovement.weatherMachineActiveBranchStep1')"></li>
          <li v-html="t('lativMovement.weatherMachineActiveBranchStep2')"></li>
        </ul>
        <li v-html="t('lativMovement.governmentRnd')" class="mt-2"></li>
      </ul>
    </template>
  </ModalDialog>

</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import AppIcon from '../structure/AppIcon.vue'
import ModalDialog from 'brdgm-commons/src/components/structure/ModalDialog.vue'

export default defineComponent({
  name: 'LativMovement',
  components: {
    AppIcon,
    ModalDialog
  },
  setup() {
    const { t } = useI18n()
    return { t }
  }
})
</script>

<style lang="scss" scoped>
.icon {
  width: 3rem;
  margin-right: 1rem;
}
</style>