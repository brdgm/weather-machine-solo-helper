import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import AppHome from '@/views/AppHome.vue'
import SetupDifficultyLevel from '@/views/SetupDifficultyLevel.vue'
import SetupGame from '@/views/SetupGame.vue'
import PhaseATurnPlayer from '@/views/PhaseATurnPlayer.vue'
import PhaseATurnSaboteur from '@/views/PhaseATurnSaboteur.vue'
import PhaseBExperiment from '@/views/PhaseBExperiment.vue'
import PhaseCEndOfRound from '@/views/PhaseCEndOfRound.vue'
import EndOfGame from '@/views/EndOfGame.vue'
import NotFound from '@/views/NotFound.vue'

const LOCALSTORAGE_KEY = process.env.VUE_APP_LOCALSTORAGE_KEY_PREFIX + "route"

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

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// store last used route path in local storage
router.afterEach(to => {
  localStorage.setItem(LOCALSTORAGE_KEY, to.fullPath)
})
// redirect to lase used route path
let isFirstTransition = true
router.beforeEach((to, _from, next) => {
  const lastRouteFullPath = localStorage.getItem(LOCALSTORAGE_KEY)
  if (to.name === "Home" && lastRouteFullPath && isFirstTransition) next(lastRouteFullPath)
  else next()
  isFirstTransition = false
})

export default router
