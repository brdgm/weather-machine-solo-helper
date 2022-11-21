import Location from '@/services/enum/Location'
import Player from '@/services/enum/Player'
import SelectionPriority from '@/services/enum/SelectionPriority'
import Weather from '@/services/enum/Weather'
import SaboteurActions from '@/services/SaboteurActions'
import { expect } from 'chai'

describe('services/SaboteurActions', () => {
  it('supplyAction-player', () => {
    const saboteurActions = new SaboteurActions({location:Location.SUPPLY,
      tokens:[],initiativePlayer:Player.PLAYER,
      weatherPriority:Weather.SUN,selectionPriority:SelectionPriority.TOP,citationUnlock:[]})

    expect(saboteurActions.actionSteps.length).to.eq(2)
  })

  it('supplyAction-saboteur', () => {
    const saboteurActions = new SaboteurActions({location:Location.SUPPLY,
      tokens:[],initiativePlayer:Player.SABOTEUR,
      weatherPriority:Weather.SUN,selectionPriority:SelectionPriority.TOP,citationUnlock:[]})

    expect(saboteurActions.actionSteps.length).to.eq(2)
  })
})
