<template>
  <ol type="i">
    <li v-if="claimInitiative" v-html="t('turnSaboteur.nefariousPlanSupply.claimInitiative')"></li>
    <li v-else>
      <span v-html="t('turnSaboteur.nefariousPlanSupply.raiseTargetValue')"></span><br/>
      <TargetValue :value="2" class="mt-2"/>
    </li>
    <li>
      <span v-html="t('turnSaboteur.nefariousPlanSupply.takeChemicals')"></span>
      <div class="mt-2 mb-2">
        <TakeChemicals :count="2" :selection-priority="selectionPriority"/>
      </div>
    </li>
  </ol>
</template>

<script lang="ts">
import Player from '@/services/enum/Player'
import { defineComponent, PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import TargetValue from '../structure/TargetValue.vue'
import TakeChemicals from '../structure/TakeChemicals.vue'
import SelectionPriority from '@/services/enum/SelectionPriority'

export default defineComponent({
  name: 'NefariousPlanSupply',
  components: {
    TargetValue,
    TakeChemicals
  },
  emits: {
    updateInitiativePlayer(payload:{player:Player}) {
      return payload != undefined
    }
  },
  props: {
    initiativePlayer: {
      type: Object as PropType<Player>,
      required: true
    },
    selectionPriority: {
      type: Object as PropType<SelectionPriority>,
      required: true
    }
  },
  data() {
    return {
      initialInitiativePlayer: this.initiativePlayer
    }
  },
  setup() {
    const { t } = useI18n()
    return { t }
  },
  computed: {
    claimInitiative() : boolean {
      return this.initialInitiativePlayer == Player.PLAYER
    }
  },
  mounted() {
    if (this.claimInitiative) {
      this.$emit('updateInitiativePlayer',{player:Player.SABOTEUR})
    }
  }
})
</script>

<style lang="scss" scoped>

</style>