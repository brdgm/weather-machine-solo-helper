<template>
  <div class="mt-2 mb-2">
    <AppIcon name="moving-lativ" class="icon"/>
    <button class="btn btn-outline-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#modalLativMovement">
      {{t('lativMovement.title')}}
    </button>
  </div>

  <div class="modal" tabindex="-1" id="modalLativMovement">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">{{t('lativMovement.title')}}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" :aria-label="t('action.close')"></button>
        </div>
        <div class="modal-body">
          <p v-html="t('lativMovement.nextLocation')"></p>
          <ul>
            <li v-html="t('lativMovement.weatherMachineActiveBranch')"></li>
            <ul class="small">
              <li v-html="t('lativMovement.weatherMachineActiveBranchStep1')"></li>
              <li v-html="t('lativMovement.weatherMachineActiveBranchStep2')"></li>
            </ul>
            <li v-html="t('lativMovement.governmentRnd')" class="mt-2"></li>
          </ul>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">{{t('action.close')}}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import AppIcon from '../structure/AppIcon.vue'

export default defineComponent({
  name: 'LativMovement',
  components: {
    AppIcon
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