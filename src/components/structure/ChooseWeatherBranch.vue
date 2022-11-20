<template>
  <div class="icon-container">
    <div v-for="weather of weathers" :key="weather" class="select">
      <AppIcon  type="weather" :name="weather" class="icon"/><br/>
      <button class="btn btn-primary btn-sm" @click="chooseWeather(weather)">
        {{t('action.select')}}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Weather from '@/services/enum/Weather';
import { defineComponent, PropType } from 'vue'
import { useI18n } from 'vue-i18n';
import AppIcon from './AppIcon.vue'

export default defineComponent({
  name: 'ChooseWeatherBranch',
  components: {
    AppIcon
  },
  emits: {
    chooseWeather(payload:{weather:Weather}) {
      return payload != undefined
    }
  },
  setup() {
    const { t } = useI18n()
    return { t }
  },
  props: {
    weathers: {
      type: Object as PropType<Weather[]>,
      required: false
    }
  },
  methods: {
    chooseWeather(weather:Weather) {
      this.$emit('chooseWeather',{weather:weather})
    }
  }
})
</script>

<style lang="scss" scoped>
.icon-container {
  .icon {
    position: relative;
    width: 2.5rem;
    margin-bottom: 0.25rem;
  }
  .select {
    display: inline-block;
    text-align: center;
    margin-right: 0.5rem;
  }
}
</style>
