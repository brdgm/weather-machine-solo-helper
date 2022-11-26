<template>
  <div>
    <span v-html="t('turnSaboteur.actions.governmentGetResearchToken.text')"></span><br/>
    <ResearchTokenIcon :location="location" :weather="weatherBranch" class="icon mt-2"/>
    <div v-if="actionStep.alternativeActionsTaken == undefined" class="decision">
      <span v-html="t('turnSaboteur.actions.governmentGetResearchToken.researchTokenAvailable')"></span><br/>
      <button class="btn btn-success" @click="doAlternativeAction(false)">
        {{t('action.yes')}}
      </button>
      <button class="btn btn-danger" @click="doAlternativeAction(true)">
        {{t('action.no')}}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import ActionStep from '@/services/ActionStep'
import { defineComponent, PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import Weather from '@/services/enum/Weather'
import ResearchTokenIcon from '@/components/structure/ResearchTokenIcon.vue'
import Location from '@/services/enum/Location'
import ActionContextParams from '@/services/ActionContextParams'

export default defineComponent({
  name: 'GovernmentGetResearchToken',
  components: {
    ResearchTokenIcon
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
    },
    actionContextParams: {
      type: Object as PropType<ActionContextParams>,
      required: true
    }
  },
  computed: {
    location() : Location {
      return Location.GOVERNMENT
    },
    weatherBranch() : Weather {
      return this.actionStep.weatherBranchChosen || Weather.RAIN
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