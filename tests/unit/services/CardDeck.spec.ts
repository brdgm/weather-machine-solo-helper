import CardDeck from '@/services/CardDeck'
import { expect } from 'chai'

describe('services/CardDeck', () => {
  it('newRandomDrawDiscard', () => {
    const cardDeck = CardDeck.new()

    expect(cardDeck.deck.length, 'deck size 1').to.eq(20)
    expect(cardDeck.discard.length, 'discard size 1').to.eq(0)
    expect(cardDeck.currentReport, 'current report 1').to.undefined
    expect(cardDeck.previousReport, 'previous report 1').to.undefined

    cardDeck.draw()

    expect(cardDeck.deck.length, 'deck size 2').to.eq(19)
    expect(cardDeck.discard.length, 'discard size 2').to.eq(0)
    expect(cardDeck.currentReport, 'current report 2').to.not.undefined
    expect(cardDeck.previousReport, 'previous report 2').to.undefined

    const lastCurrentReport = cardDeck.currentReport
    cardDeck.draw()

    expect(cardDeck.deck.length, 'deck size 3').to.eq(18)
    expect(cardDeck.discard.length, 'discard size 3').to.eq(1)
    expect(cardDeck.currentReport, 'current report 3').to.not.undefined
    expect(cardDeck.previousReport?.id, 'previous report 3').to.eq(lastCurrentReport?.id)

    const topDeckCard = cardDeck.deck[0]
    cardDeck.discardFromDeck()

    expect(cardDeck.deck.length, 'deck size 4').to.eq(17)
    expect(cardDeck.discard.length, 'discard size 4').to.eq(2)
    expect(cardDeck.currentReport, 'current report 4').to.not.undefined
    expect(cardDeck.previousReport?.id, 'previous report 4').to.eq(topDeckCard?.id)
  })

  it('setupGame', () => {
    const cardDeck = CardDeck.fromPersistence({
      deck: [
        18, // pink/supply/fog
        6,  // pink/follow/snow
        5,  // pink/lab/sun
        4,  // pink/lab/sun
        3,  // pink/rnd/wind
        2,  // white/rnd/fog
        1], // white/lab/snow
      current: undefined,
      discard: []
    })

    expect(cardDeck.deck.length, 'deck size initial').to.eq(7)
    expect(cardDeck.discard.length, 'discard size initial').to.eq(0)
    expect(cardDeck.currentReport, 'current report initial').to.undefined
    expect(cardDeck.previousReport, 'previous report initial').to.undefined

    // setup game, remove two cards
    const setupCards = cardDeck.setupGame(2)

    expect(setupCards.length, 'setupCards size').to.eq(2)
    expect(setupCards[0].id, 'setupCards 1 id').to.eq(5)
    expect(setupCards[1].id, 'setupCards 2 id').to.eq(2)

    expect(cardDeck.deck.length, 'deck size').to.eq(2)
    expect(cardDeck.discard.length, 'discard size').to.eq(2)
    expect(cardDeck.currentReport, 'current report').to.not.undefined
    expect(cardDeck.previousReport?.id, 'previous report id').to.eq(2)
  })
})
