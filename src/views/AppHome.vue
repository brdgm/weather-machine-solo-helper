<template>

  <div class="float-end m-2 w-25">
    <a href="https://boardgamegeek.com/boardgame/237179/weather-machine" target="_blank" rel="noopener">
      <img src="../assets/game-weather-machine.jpg" class="rounded shadow w-100"/>
    </a>
  </div>

  <h1>{{t('home.title')}}</h1>

  <p v-html="t('home.play1')"></p>
  <p v-html="t('home.play2')"></p>

  <p class="text-muted fst-italic">
    {{t('home.feedback')}}
    <a href="https://boardgamegeek.com/thread/2986425/brdgmme-weather-machine-solo-helper-web-applicatio" target="_blank" rel="noopener">Board Game Geek Thread</a> |
    <a href="https://github.com/brdgm/weather-machine-solo-helper" target="_blank" rel="noopener">GitHub</a>
  </p>

  <router-link to="/setupDifficultyLevel" class="btn btn-primary btn-lg mt-3">{{t('action.playGame')}}</router-link>

  <p class="disclaimer">
    This is not an official Eagle-Gryphon Games product and has no affiliation with <a href="https://www.eaglegames.net/" target="_blank" rel="noopener">Eagle-Gryphon Games</a>.
    All art in this app is from <a href="https://boardgamegeek.com/boardgame/237179/weather-machine/" target="_blank" rel="noopener">Weather Machine</a>.
    See <a href="#" data-bs-toggle="modal" data-bs-target="#creditsModal">{{t('footer.credits')}}</a>.
  </p>

</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'AppHome',
  setup() {
    const { t } = useI18n()
    return { t }
  },
})
</script>

<style lang="scss" scoped>
.disclaimer {
  clear: both;
  margin-top: 4rem;
  font-size: smaller;
}
</style>