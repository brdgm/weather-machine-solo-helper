import Card from "@/services/Card"
import CardDeck from "@/services/CardDeck"
import Cards from "@/services/Cards"
import Player from "@/services/enum/Player"
import { State, Token } from "@/store"
import { RouteLocation } from "vue-router"

export default class NavigationState {

  readonly round : number
  readonly player : Player
  readonly tokens : Token[]
  readonly cardDeck : CardDeck
  readonly initiativePlayer : Player

  constructor(route : RouteLocation, state : State) {
    this.round = parseInt(route.params['round'] as string)
    this.player = (route.name == 'PhaseATurnSaboteur') ? Player.SABOTEUR : Player.PLAYER
    this.tokens = NavigationState.getTokens(this.round, state)
    this.cardDeck = NavigationState.getCardDeck(this.round, state)
    this.initiativePlayer = NavigationState.getInitiativePlayer(this.round, state)
  }

  public get currentReport() : Card {
    let card = this.cardDeck.currentReport
    if (!card) {
      console.log(`No current security report in round ${this.round}.`)
      card = Cards.get(1)
    }
    return card
  }

  public get previousReport() : Card {
    let card = this.cardDeck.previousReport
    if (!card) {
      console.log(`No previous security report in round ${this.round}.`)
      card = Cards.get(2)
    }
    return card
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
    const round = state.rounds.find(item => item.round==roundNo)
    return round?.tokens || []
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
