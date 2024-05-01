import { RouteRecordRaw } from 'vue-router'
import createRouterMatomoTracking from '@brdgm/brdgm-commons/src/util/router/createRouterMatomoTracking'
import { name, version, appDeployName } from '@/../package.json'
import AppHome from '@/views/AppHome.vue'
import SetupDifficultyLevel from '@/views/SetupDifficultyLevel.vue'
import SetupGame from '@/views/SetupGame.vue'
import PhaseATurnPlayer from '@/views/PhaseATurnPlayer.vue'
import PhaseATurnSaboteur from '@/views/PhaseATurnSaboteur.vue'
import PhaseBExperiment from '@/views/PhaseBExperiment.vue'
import PhaseCEndOfRound from '@/views/PhaseCEndOfRound.vue'
import EndOfGame from '@/views/EndOfGame.vue'
import NotFound from '@/views/NotFound.vue'

const LOCALSTORAGE_KEY = `${name}.route`

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'AppHome',
    component: AppHome
  },
  {
    path: '/setupDifficultyLevel',
    name: 'SetupDifficultyLevel',
    component: SetupDifficultyLevel
  },
  {
    path: '/setupGame',
    name: 'SetupGame',
    component: SetupGame
  },
  {
    path: '/round/:round/phaseATurnPlayer',
    name: 'PhaseATurnPlayer',
    component: PhaseATurnPlayer
  },
  {
    path: '/round/:round/phaseATurnSaboteur',
    name: 'PhaseATurnSaboteur',
    component: PhaseATurnSaboteur
  },
  {
    path: '/round/:round/phaseBExperiment',
    name: 'PhaseBExperiment',
    component: PhaseBExperiment
  },
  {
    path: '/round/:round/phaseCEndOfRound',
    name: 'PhaseCEndOfRound',
    component: PhaseCEndOfRound
  },
  {
    path: '/endOfGame',
    name: 'EndOfGame',
    component: EndOfGame
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]

export default createRouterMatomoTracking(routes, LOCALSTORAGE_KEY, appDeployName, version, 'AppHome')