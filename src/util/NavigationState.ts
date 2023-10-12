import Card from '@/services/Card'
import CardDeck from '@/services/CardDeck'
import Player from '@/services/enum/Player'
import Weather from '@/services/enum/Weather'
import { State, Token } from '@/store'
import { RouteLocation } from 'vue-router'

export default class NavigationState {

  readonly round : number
  readonly player : Player
  readonly initiativePlayer : Player
  readonly lastRoundInitiativePlayer : Player
  readonly cardDeck : CardDeck
  readonly currentReport : Card
  readonly tokens : Token[]
  readonly citationUnlock : Weather[]

  constructor(route : RouteLocation, state : State) {
    this.round = parseInt(route.params['round'] as string)
    this.player = (route.name == 'PhaseATurnSaboteur') ? Player.SABOTEUR : Player.PLAYER
    this.initiativePlayer = NavigationState.getInitiativePlayer(this.round, state)
    this.lastRoundInitiativePlayer = NavigationState.getInitiativePlayer(this.round-1, state)

    let loadStateRound = this.round
    if (this.player == Player.PLAYER && this.lastRoundInitiativePlayer != Player.PLAYER) {
      // player is after saboteurs in this round - so load state from next round stored in saboteurs turn
      loadStateRound = this.round + 1
    }

    this.cardDeck = NavigationState.getCardDeck(loadStateRound, state)
    this.currentReport = this.cardDeck.currentReport
    this.tokens = NavigationState.getTokens(loadStateRound, state)
    this.citationUnlock = NavigationState.getCitationUnlock(loadStateRound, state)
  }

  /**
   * Get current card deck.
   */
  static getCardDeck(roundNo : number, state : State) : CardDeck {
    const round = state.rounds.find(item => item.round==roundNo)
    if (!round) {
      console.log(`No card deck found for round ${roundNo}.`)
      const cardDeck = CardDeck.new()
      cardDeck.setupGame()
      return cardDeck
    }
    return CardDeck.fromPersistence(round.cardDeck)
  }

  /**
   * Get saboteurs' tokens.
   */
  static getTokens(roundNo : number, state : State) : Token[] {
    const tokens : Token[] = []
    const round = state.rounds.find(item => item.round==roundNo)
    if (round) {
      tokens.push(...round.tokens)
      if (round.weatherExperimentToken) {
        tokens.push(round.weatherExperimentToken)
      }
    }
    return tokens
  }

  /**
   * Get saboteurs' tokens.
   */
  static getCitationUnlock(roundNo : number, state : State) : Weather[] {
    const round = state.rounds.find(item => item.round==roundNo)
    return round?.citationUnlock || []
  }

  /**
   * Check which player claimed the initiative most recently.
   */
  static getInitiativePlayer(roundNo : number, state : State) : Player {
    for (let i=roundNo-1; i>=0; i--) {
      const round = state.rounds[i]
      if (round && round.claimInitiative) {
        return round.claimInitiative
      }
    }
    return Player.PLAYER
  }

}
