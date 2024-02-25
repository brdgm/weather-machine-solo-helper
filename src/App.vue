<template>
  <AppHeader :title="t('gameTitle')" @set-locale="setLocale($event.language)"/>

  <div id="content-container" class="container-fluid mt-5 mb-5">
    <router-view :key="$route.fullPath"/>
    <EndGameConditionsModal />
  </div>

  <AppFooter :build-number="buildNumber" :credits-label="t('footer.credits')" credits-modal-id="creditsModal" zoom-enabled
      :base-font-size="baseFontSize" @zoomFontSize="zoomFontSize"/>

  <ModalDialog id="errorMessage">
    <template #body>
      <div class="alert alert-danger" role="alert">{{errorMessage}}</div>
    </template>
  </ModalDialog>

  <ModalDialog id="serviceWorkerUpdatedRefresh" :title="t('serviceWorkerUpdatedRefresh.title')">
    <template #body>
      <p v-html="t('serviceWorkerUpdatedRefresh.notice')"></p>
    </template>
    <template #footer>
      <button class="btn btn-primary" data-bs-dismiss="modal" @click="updateServiceWorker()">{{t('serviceWorkerUpdatedRefresh.title')}}</button>
      <button class="btn btn-secondary" data-bs-dismiss="modal">{{t('action.close')}}</button>
    </template>
  </ModalDialog>

  <ModalDialog id="creditsModal" :title="t('footer.credits')">
    <template #body>
      <h4><a href="https://boardgamegeek.com/boardgame/237179/weather-machine" target="_blank" rel="noopener">{{t('gameTitle')}}</a></h4>
      <dl>
        <dt>Game design</dt>
        <dd>Vital Lacerda</dd>
        <dt>Graphics design</dt>
        <dd>Ian O'Toole</dd>
        <dt>Solo Mode Design</dt>
        <dd>Dávid Turczi</dd>
        <dt>Publisher</dt>
        <dd><a href="https://www.eaglegames.net/" target="_blank" rel="noopener">Eagle-Gryphon Games</a></dd>
      </dl>
      <h4 class="border-top pt-3">{{appTitle}}</h4>
      <dl>
        <dt>Application Development</dt>
        <dd>Stefan Seifert</dd>
        <dt>Version</dt>
        <dd>{{buildNumber}} (<a href="https://github.com/brdgm/weather-machine-solo-helper/releases" target="_blank" rel="noopener">Change Log</a>)</dd>
        <dt>Source Code (Apache-2.0 License)</dt>
        <dd><a href="https://github.com/brdgm/weather-machine-solo-helper" target="_blank" rel="noopener">https://github.com/brdgm/weather-machine-solo-helper</a></dd>
      </dl>
    </template>
  </ModalDialog>

</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from '@/store'
import AppHeader from 'brdgm-commons/src/components/structure/AppHeader.vue'
import AppFooter from 'brdgm-commons/src/components/structure/AppFooter.vue'
import ModalDialog from 'brdgm-commons/src/components/structure/ModalDialog.vue'
import getErrorMessage from 'brdgm-commons/src/util/error/getErrorMessage'
import showModal, { showModalIfExist } from 'brdgm-commons/src/util/modal/showModal'
import EndGameConditionsModal from './components/turn/EndGameConditionsModal.vue'
import { version, description } from '@/../package.json'
import { registerSW } from 'virtual:pwa-register'
import onRegisteredSWCheckForUpdate from 'brdgm-commons/src/util/serviceWorker/onRegisteredSWCheckForUpdate'

export default defineComponent({
  name: 'App',
  components: {
    AppHeader,
    AppFooter,
    ModalDialog,
    EndGameConditionsModal
  },
  setup() {
    const { t, locale } = useI18n({
      inheritLocale: true,
      useScope: 'global'
    })
    const store = useStore()

    // handle PWA updates with prompt if a new version is detected, check regularly for a new version
    const checkForNewVersionsIntervalSeconds = 1 * 60 * 60
    const updateServiceWorker = registerSW({
      // check for new app version, see https://vite-pwa-org.netlify.app/guide/periodic-sw-updates.html
      onRegisteredSW(swScriptUrl : string, registration? : ServiceWorkerRegistration) {
        onRegisteredSWCheckForUpdate(swScriptUrl, registration, checkForNewVersionsIntervalSeconds)
      },
      onNeedRefresh() {
        showModalIfExist('serviceWorkerUpdatedRefresh')
      }
    })

    store.commit('initialiseStore')
    locale.value = store.state.language
    
    const baseFontSize = ref(store.state.baseFontSize)

    return { t, locale, baseFontSize, updateServiceWorker }
  },
  data() {
    return {
      buildNumber: version,
      appTitle: description,
      errorMessage: 'Error'
    }
  },
  methods: {
    setLocale(lang: string) {
      this.$store.commit('language', lang)
      this.locale = lang;
    },
    zoomFontSize(payload: { baseFontSize: number }) {
      this.baseFontSize = payload.baseFontSize
      this.$store.commit('zoomFontSize', this.baseFontSize)
    }
  },
  errorCaptured(err : unknown) {
    this.errorMessage = getErrorMessage(err, translErr => this.t(translErr.key, translErr.named, translErr.plural))
    showModal('errorMessage')
  }
})
</script>

<style lang="scss">
@import "bootstrap/scss/functions";
@import "bootstrap/scss/variables";
@import "bootstrap/scss/variables-dark";
@import "bootstrap/scss/maps";
@import "bootstrap/scss/utilities";

#content-container {
  font-size: calc(v-bind(baseFontSize) * $font-size-base);
  h1 { font-size: calc(v-bind(baseFontSize) * $h1-font-size); }
  h2 { font-size: calc(v-bind(baseFontSize) * $h2-font-size); }
  h3 { font-size: calc(v-bind(baseFontSize) * $h3-font-size); }
  h4 { font-size: calc(v-bind(baseFontSize) * $h4-font-size); }
  h5 { font-size: calc(v-bind(baseFontSize) * $h5-font-size); }
  h6 { font-size: calc(v-bind(baseFontSize) * $h6-font-size); }

  .modal {
    --bs-modal-bg: #fdf7ec;
  }

  .accordion {
    --bs-accordion-bg: #fdf7ec;
    --bs-accordion-btn-bg: #f9ece4;
    --bs-accordion-active-bg: #f9ece4;
    --bs-accordion-active-color: black;
    .accordion-button {
      font-weight: bold;
    }
  }
}
#creditsModal {
  &.modal {
    --bs-modal-bg: #fdf7ec;
  }
}

body {
  background-image: url('@/assets/background.jpg');
  background-size: 120rem;
}
</style>
