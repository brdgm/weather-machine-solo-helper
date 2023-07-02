import { RouteRecordRaw } from 'vue-router'
import AppHome from '@/views/AppHome.vue'
import SetupDifficultyLevel from '@/views/SetupDifficultyLevel.vue'
import SetupGame from '@/views/SetupGame.vue'
import PhaseATurnPlayer from '@/views/PhaseATurnPlayer.vue'
import PhaseATurnSaboteur from '@/views/PhaseATurnSaboteur.vue'
import PhaseBExperiment from '@/views/PhaseBExperiment.vue'
import PhaseCEndOfRound from '@/views/PhaseCEndOfRound.vue'
import EndOfGame from '@/views/EndOfGame.vue'
import NotFound from '@/views/NotFound.vue'
import createRouter from 'brdgm-commons/src/util/router/createRouter'
import { name } from '@/../package.json'

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

export default createRouter(routes, LOCALSTORAGE_KEY, 'AppHome')