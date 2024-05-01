<template>
  <ModalDialog id="modalClaimInitiative" :title="t('claimInitiative.title')">
    <template #body>
      <div class="float-start">
        <AppIcon name="claim-initiative" class="icon"/>
      </div>
      <p>
        <span v-html="t('claimInitiative.claim')"></span><br/>
        <template v-for="player of players" :key="player">
          <input class="form-check-input" type="radio" :id="`initiative-${player}`" :value="player" v-model="selectedPlayer">
          <label class="form-check-label" :for="`initiative-${player}`" :class="{'fw-bold':selectedPlayer==player}">
            {{t(`claimInitiative.${player}`)}}
          </label><br/>
        </template>
      </p>
    </template>
    <template #footer>
      <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="claimInitiative()">{{t('claimInitiative.title')}}</button>
      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">{{t('action.cancel')}}</button>
    </template>
  </ModalDialog>
</template>

<script lang="ts">
import Player from '@/services/enum/Player'
import { useStateStore } from '@/store/state'
import { defineComponent, PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import AppIcon from '../structure/AppIcon.vue'
import ModalDialog from '@brdgm/brdgm-commons/src/components/structure/ModalDialog.vue'

export default defineComponent({
  name: 'ClaimInitiativeModal',
  components: {
    AppIcon,
    ModalDialog
  },
  emits: {
    claimedInitiative(payload: { player: Player }) {
      return payload != undefined
    }
  },
  setup() {
    const { t } = useI18n()
    const state = useStateStore()
    return { t, state }
  },
  props: {
    round: {
      type: Number,
      required: true
    },
    player: {
      type: String as PropType<Player>,
      required: true
    }
  },
  data() {
    return {
      selectedPlayer: this.player
    }
  },
  computed: {
    players() : Player[] {
      return Object.values(Player)
    }
  },
  methods: {
    claimInitiative() : void {
      this.$emit('claimedInitiative', {player:this.selectedPlayer})
      this.state.claimInitiative({round:this.round, player:this.selectedPlayer})
    }
  }
})
</script>

<style lang="scss" scoped>
.icon {
  width: 5rem;
  margin-right: 2rem;
  margin-left: 1rem;
}
.form-check-input {
  margin-left: 0.5rem;
  margin-right: 0.5rem;
}
</style>