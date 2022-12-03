import Location from '@/services/enum/Location'
import Player from '@/services/enum/Player'
import Weather from '@/services/enum/Weather'
import NavigationState from '@/util/NavigationState'
import { expect } from 'chai'
import mockCardDeck from '../helper/mockCardDeck'
import mockRound from '../helper/mockRound'
import mockRouteLocation from '../helper/mockRouteLocation'
import mockState from '../helper/mockState'

describe('util/NavigationState', () => {
  it('turnPlayer', () => {
    const state = mockState({
      rounds: [
        mockRound({round:1}),
        mockRound({round:2,claimInitiative:Player.SABOTEUR}),
        mockRound({round:3,
          cardDeck:mockCardDeck({current:5,discard:[3,4]}).toPersistence(),
          tokens:[{award:true},{location:Location.RND,weather:Weather.SUN}],
          weatherExperimentToken: {location:Location.LATIVS_LAB,weather:Weather.FOG},
          citationUnlock:[Weather.FOG,Weather.SNOW,Weather.WIND],
          claimInitiative:Player.PLAYER
        })
      ]
    })
    const route = mockRouteLocation({params:{'round':'3'},name:'PhaseATurnPlayer'})
    const navigationState = new NavigationState(route, state)

    expect(navigationState.round, 'round').to.eq(3)
    expect(navigationState.player, 'player').to.eq(Player.PLAYER)
    expect(navigationState.cardDeck, 'cardDeck').to.not.undefined
    expect(navigationState.tokens, 'tokens').to.eql([{award:true},{location:Location.RND,weather:Weather.SUN},{location:Location.LATIVS_LAB,weather:Weather.FOG}])
    expect(navigationState.citationUnlock.length, 'citationUnlock').to.eq(3)

    expect(navigationState.cardDeck.currentReport?.id, 'currentReport').to.eq(5)
    expect(navigationState.cardDeck.previousReport?.id, 'previousReport').to.eq(3)

    expect(navigationState.initiativePlayer, 'initiativePlayer').to.eq(Player.PLAYER)
    expect(navigationState.lastRoundInitiativePlayer, 'lastRoundInitiativePlayer').to.eq(Player.SABOTEUR)
  })

  it('turnSaboteurInvalidState', () => {
    const state = mockState({})
    const route = mockRouteLocation({params:{'round':'3'},name:'PhaseATurnSaboteur'})
    const navigationState = new NavigationState(route, state)

    expect(navigationState.round, 'round').to.eq(3)
    expect(navigationState.player, 'player').to.eq(Player.SABOTEUR)
    expect(navigationState.cardDeck, 'cardDeck').to.not.undefined
    expect(navigationState.tokens.length, 'tokens').to.eq(0)
    expect(navigationState.citationUnlock.length, 'citationUnlock').to.eq(0)

    expect(navigationState.cardDeck.currentReport, 'currentReport').to.not.undefined
    expect(navigationState.cardDeck.previousReport, 'previousReport').to.not.undefined

    expect(navigationState.initiativePlayer, 'initiativePlayer').to.eq(Player.PLAYER)
    expect(navigationState.lastRoundInitiativePlayer, 'lastRoundInitiativePlayer').to.eq(Player.PLAYER)
  })
})
