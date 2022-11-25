import { CardDeckPersistence } from "@/store"
import MainLocations from "@/util/MainLocations"
import * as _ from "lodash"
import { shuffle } from "lodash"
import Card from "./Card"
import Cards from "./Cards"

/**
 * Deck of security report cards.
 */
export default class CardDeck {

  private _deck : Card[]
  private _current? : Card
  private _discard : Card[]

  public constructor(deck : Card[], current : Card|undefined, discard : Card[]) {
    this._deck = deck
    this._current = current
    this._discard = discard
  }

  public get deck() : readonly Card[] {
    return this._deck
  }

  public get discard() : readonly Card[] {
    return this._discard
  }

  public get currentReport() : Card {
    if (this._current) {
      return this._current
    }
    // fallback with error message
    console.log('No current report.')
    return Cards.get(1)
  }

  public get previousReport() : Card {
    if (this._discard.length > 0) {
      return this._discard[0]
    }
    // fallback with error message
    console.log('No previous report.')
    return Cards.get(2)
  }

  public get isDeckEmpty() : boolean {
    return this._deck.length == 0
  }

  /**
   * Gets persistence view of card deck.
   */
  public toPersistence() : CardDeckPersistence {
    return {
      deck: this._deck.map(card => card.id),
      current: this._current?.id,
      discard: this._discard.map(card => card.id)      
    }
  }

  /**
   * Setup game and initial agent positions.
   * @param removeCards Remove this number of cards from the game after setup (for higher difficulty level)
   * @return Returns two card which form the initial discard pile and contain the information for initial agent placement and weather token
   */
  public setupGame(removeCards = 0) : Card[] {
    const foundCards = []
    const missedCards = []

    // draw two cards with main locations for two different agents
    while (foundCards.length < 2) {
      const drawnCard = this._deck.shift()
      if (!drawnCard) {
        throw new Error('No card left in deck.')
      }
      if (MainLocations.includes(drawnCard.location) && foundCards.find(item => item.agent==drawnCard.agent)==undefined) {
        foundCards.push(drawnCard)
      }
      else {
        missedCards.push(drawnCard)
      }
    }

    // put missed cards back to deck and shuffle, remove cards from deck
    this._deck.push(...missedCards)
    this._deck = shuffle(this._deck)
    for (let i=0; i<removeCards; i++) {
      this._deck.shift()
    }

    // put found cards to discard pile
    foundCards.forEach(card => this._discard.unshift(card))

    // draw first current report
    this.draw()

    return foundCards
  }

  /**
   * Draw next card.
   */
  public draw() : void {
    if (this._current) {
      this._discard.unshift(this._current)
    }
    const drawnCard = this._deck.shift()
    if (drawnCard) {
      this._current = drawnCard
    }
    else {
      throw new Error('No card left in deck.')
    }
  }

  /**
   * Discard one card from the deck.
   */
  public discardFromDeck() : void {
    const drawnCard = this._deck.shift()
    if (drawnCard) {
      this._discard.unshift(drawnCard)
    }
    else {
      throw new Error('No card left in deck.')
    }
  }

  /**
   * @returns Clone of the current card deck
   */
  public clone() : CardDeck {
    return CardDeck.fromPersistence(this.toPersistence())
  }

  /**
   * Creates a shuffled new card deck.
   */
  public static new() : CardDeck {
    let deck = [...Cards.getAll()]
    deck = _.shuffle(deck)
    return new CardDeck(deck, undefined, [])
  }

  /**
   * Re-creates a card deck from persistence.
   */
  public static fromPersistence(persistence : CardDeckPersistence) : CardDeck {
    return new CardDeck(
      persistence.deck.map(Cards.get),
      persistence.current ? Cards.get(persistence.current) : undefined,
      persistence.discard.map(Cards.get)
    )
  }

}
