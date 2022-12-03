<template>
  <div>
    <span v-html="t('turnSaboteur.actions.unlockCitation.text')"></span><br/>
    <AppIcon name="citation-unlocked" class="icon mt-2"/>
    <AppIcon type="weather" :name="weather" class="icon weather ms-2 mt-2"/>
  </div>
  <div v-if="challengePublishOrPerish">
    <ChallengeIcon/> <span v-html="t('turnSaboteur.actions.increaseTargetValue.text',{count:5})"></span><br/>
    <TargetValue :value="5" class="mt-2"/>
  </div>
</template>

<script lang="ts">
import AppIcon from '@/components/structure/AppIcon.vue'
import ChallengeIcon from '@/components/structure/ChallengeIcon.vue'
import TargetValue from '@/components/structure/TargetValue.vue'
import ActionContextParams from '@/services/ActionContextParams'
import ActionStep from '@/services/ActionStep'
import ChallengeCard from '@/services/enum/ChallengeCard'
import Weather from '@/services/enum/Weather'
import { defineComponent, PropType } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'UnlockCitation',
  components: {
    AppIcon,
    TargetValue,
    ChallengeIcon
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
    weather() : Weather {
      return this.actionStep.weatherBranchChosen || Weather.RAIN
    },
    challengeCards() : ChallengeCard[] {
      return this.$store.state.setup.challengeCards
    },
    challengePublishOrPerish() : boolean {
      return this.challengeCards.includes(ChallengeCard.PUBLISH_OR_PERISH)
    }
  }
})
</script>

<style lang="scss" scoped>
.icon {
  height: 3rem;
  &.weather {
    height: 2.5rem;
  }
}
</style>
