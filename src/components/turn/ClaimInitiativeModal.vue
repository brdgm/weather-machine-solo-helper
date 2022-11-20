<template>
  <div class="modal" tabindex="-1" id="modalClaimInitiative">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">{{t('claimInitiative.title')}}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" :aria-label="t('action.close')"></button>
        </div>
        <div class="modal-body">
          <div class="float-start">
            <AppIcon name="claim-initiative" class="icon"/>
          </div>
          <p>
            <span v-html="t('claimInitiative.claim')"></span><br/>
            <template v-for="player of players" :key="player">
              <input class="form-check-input" type="radio" name="flexRadioDefault" :id="`initiative-${player}`" :value="player" v-model="selectedPlayer">
              <label class="form-check-label" :for="`initiative-${player}`" :class="{'fw-bold':selectedPlayer==player}">
                {{t(`claimInitiative.${player}`)}}
              </label><br/>
            </template>
          </p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="claimInitiative()">{{t('claimInitiative.title')}}</button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">{{t('action.cancel')}}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Player from '@/services/enum/Player'
import { useStore } from '@/store'
import { defineComponent, PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import AppIcon from '../structure/AppIcon.vue'

export default defineComponent({
  name: 'ClaimInitiativeModal',
  components: {
    AppIcon
  },
  emits: {
    claimedInitiative(payload: { player: Player }) {
      return payload != undefined
    }
  },
  setup() {
    const { t } = useI18n()
    useStore()
    return { t }
  },
  props: {
    round: {
      type: Number,
      required: true
    },
    player: {
      type: Object as PropType<Player>,
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
      this.$store.commit('claimInitiative', {round:this.round, player:this.selectedPlayer})
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