import ChallengeCard from '@/services/enum/ChallengeCard'
import Location from '@/services/enum/Location'
import Player from '@/services/enum/Player'
import Weather from '@/services/enum/Weather'
import { defineStore } from 'pinia'
import { name } from '@/../package.json'

export const useStateStore = defineStore(`${name}.store`, {
  state: () => {
    return {
      language: 'en',
      baseFontSize: 1.0,
      setup: {
        challengeCards: []
      },
      rounds: []
    } as State
  },
  actions: {
    round(round: Round) {
      this.rounds = this.rounds.filter(item => item.round < round.round)
      this.rounds.push(round)
    },
    roundCardDeck(payload:{round: number, cardDeck: CardDeckPersistence}) {
      const round = this.rounds.find(item => item.round == payload.round)
      if (round) {
        round.cardDeck = payload.cardDeck
      }
    },
    roundWeatherExperimentToken(payload:{round: number, token: Token|undefined}) {
      const round = this.rounds.find(item => item.round == payload.round)
      if (round) {
        round.weatherExperimentToken = payload.token
      }
    },
    claimInitiative(payload:{round: number, player: Player}) {
      const round = this.rounds.find(item => item.round == payload.round)
      if (round) {
        round.claimInitiative = payload.player
      }
    },
    updateCitation(payload:{round: number, citationUnlock: Weather[]}) {
      const round = this.rounds.find(item => item.round == payload.round)
      if (round) {
        round.citationUnlock = payload.citationUnlock
      }
    },
    endGame() {
      this.rounds = []
    }
  },
  persist: true
})

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
