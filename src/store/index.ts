import ChallengeCard from '@/services/enum/ChallengeCard'
import Location from '@/services/enum/Location'
import Player from '@/services/enum/Player'
import Weather from '@/services/enum/Weather'
import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'
import { name } from '@/../package.json'

const LOCALSTORAGE_KEY = `${name}.store`

export interface State {
  language: string
  baseFontSize: number
  setup: Setup
  rounds: Round[]
}
export interface Setup {
  challengeCards: ChallengeCard[]
}
export interface Round {
  round: number
  cardDeck: CardDeckPersistence
  tokens: Token[]
  weatherExperimentToken?: Token
  citationUnlock?: Weather[]
  claimInitiative?: Player
}
export interface Token {
  award?: boolean
  location?: Location
  weather?: Weather
}
export interface CardDeckPersistence {
  deck: number[]
  current?: number
  discard: number[]
}

declare module '@vue/runtime-core' {
  // provide typings for `this.$store`
  interface ComponentCustomProperties {
    $store: Store<State>
  }
}

export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  state: {
    language: "en",
    baseFontSize: 1.0,
    setup: {
      challengeCards: []
    },
    rounds: []
  },
  mutations: {
    // reload state from local storage
    initialiseStore(state) {
      const localStorageCache = localStorage.getItem(LOCALSTORAGE_KEY)
      if (localStorageCache) {
        this.replaceState(Object.assign(state, JSON.parse(localStorageCache)));
      }
    },
    language(state : State, language: string) {
      state.language = language
    },
    setup(state : State, setup: Setup) {
      state.setup = setup
    },
    round(state : State, round: Round) {
      state.rounds = state.rounds.filter(item => item.round < round.round)
      state.rounds.push(round)
    },
    roundCardDeck(state : State, payload:{round: number, cardDeck: CardDeckPersistence}) {
      const round = state.rounds.find(item => item.round == payload.round)
      if (round) {
        round.cardDeck = payload.cardDeck
      }
    },
    roundWeatherExperimentToken(state : State, payload:{round: number, token: Token|undefined}) {
      const round = state.rounds.find(item => item.round == payload.round)
      if (round) {
        round.weatherExperimentToken = payload.token
      }
    },
    claimInitiative(state : State, payload:{round: number, player: Player}) {
      const round = state.rounds.find(item => item.round == payload.round)
      if (round) {
        round.claimInitiative = payload.player
      }
    },
    updateCitation(state : State, payload:{round: number, citationUnlock: Weather[]}) {
      const round = state.rounds.find(item => item.round == payload.round)
      if (round) {
        round.citationUnlock = payload.citationUnlock
      }
    },
    endGame(state : State) {
      state.rounds = []
    },
    zoomFontSize(state : State, baseFontSize: number) {
      state.baseFontSize = baseFontSize
    }
  }
})

store.subscribe((_mutation, state) => {
	// store state asJSON string in local storage
	localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(state));
})

// define your own `useStore` composition function
export function useStore() : Store<State> {
  return baseUseStore(key)
}
