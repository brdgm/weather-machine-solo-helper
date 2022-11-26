<template>
  <div>
    <span v-html="t('turnSaboteur.actions.rndChemicalAvailable.text')"></span><br/>
    <AppIcon name="rnd-place-chemical-available" class="icon mt-2"/>
    <div v-if="actionStep.alternativeActionsTaken == undefined" class="decision mt-2">
      <span v-html="t('turnSaboteur.actions.rndChemicalAvailable.chemicalAvailable')"></span><br/>
      <button class="btn btn-success" @click="doAlternativeAction(true)">
        {{t('action.yes')}}
      </button>
      <button class="btn btn-danger" @click="doAlternativeAction(false)">
        {{t('action.no')}}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import ActionStep from '@/services/ActionStep'
import { defineComponent, PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import AppIcon from '@/components/structure/AppIcon.vue'

export default defineComponent({
  name: 'RndChemicalAvailable',
  components: {
    AppIcon
  },
  emits: {
    alternativeAction(payload:{alternativeActionsTaken:boolean}) {
      return payload != undefined
    }
  },
  setup() {
    const { t } = useI18n()
    return { t }
  },
  props: {
    actionStep: {
      type: Object as PropType<ActionStep>,
      required: true
    }
  },
  methods: {
    doAlternativeAction(alternativeActionsTaken:boolean) : void {
      this.$emit('alternativeAction',{alternativeActionsTaken:alternativeActionsTaken})
    }
  }
})
</script>

<style lang="scss" scoped>
.icon {
  width: 3rem;
  vertical-align: top;
}
.decision {
  display: inline-block;
  margin-left: 1rem;
  span {
    font-weight: bold;
    color: green;
  }
  button {
    margin-right: 0.5rem;
  }
}
</style>
