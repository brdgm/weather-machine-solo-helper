<template>
  <div>
    <span v-html="t('turnSaboteur.actions.discardResearchTokens.text',{count:numberTokens})"></span><br/>
    <div v-for="(token,index) of tokens" :key="index" class="token">
      <AppIcon name="discard-x" class="discard-x mt-2"/>
      <AppIcon v-if="token.award" name="award-token" class="icon mt-2"/>
      <ResearchTokenIcon v-if="token.location && token.weather" :location="token.location" :weather="token.weather" class="icon mt-2"/>
    </div>
  </div>
</template>

<script lang="ts">
import AppIcon from '@/components/structure/AppIcon.vue'
import ResearchTokenIcon from '@/components/structure/ResearchTokenIcon.vue'
import ActionContextParams from '@/services/ActionContextParams'
import ActionStep from '@/services/ActionStep'
import { Token } from '@/store'
import { defineComponent, PropType } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'DiscardResearchTokens',
  components: {
    ResearchTokenIcon,
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
  },
  computed: {
    numberTokens() : number {
      return this.actionStep.researchTokenSet?.tokens.length ?? 0
    },
    tokens() : Token[] {
      return this.actionStep.researchTokenSet?.tokens ?? []
    }
  }
})
</script>

<style lang="scss" scoped>
.token {
  display: inline-block;
  position: relative;
  margin-right: 1rem;
  .discard-x {
    position: absolute;
    width: 3rem;
    vertical-align: top;
    z-index: 100;
    opacity: 0.75;
    left: 0;
    top: -0.1rem;
  }
  .icon {
    width: 3rem;
    vertical-align: top;
  }
}
</style>