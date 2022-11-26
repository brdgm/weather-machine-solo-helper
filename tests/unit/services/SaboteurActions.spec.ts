import Location from '@/services/enum/Location'
import Player from '@/services/enum/Player'
import SelectionPriority from '@/services/enum/SelectionPriority'
import Weather from '@/services/enum/Weather'
import SaboteurActions from '@/services/SaboteurActions'
import { expect } from 'chai'
import Action from '@/services/enum/Action'
import ActionSlot from '@/services/enum/ActionSlot'
import { Token } from '@/store'

describe('services/SaboteurActions', () => {
  it('supplyAction-player', () => {
    const saboteurActions = newSaboteurActions({location:Location.SUPPLY,initiativePlayer:Player.PLAYER})

    expect(saboteurActions.actionSteps.map(item => item.action)).to.eql([
      Action.CLAIM_INITIATIVE, Action.TAKE_CHEMICAL
    ])
  })

  it('supplyAction-saboteur', () => {
    const saboteurActions = newSaboteurActions({location:Location.SUPPLY,initiativePlayer:Player.SABOTEUR})

    expect(saboteurActions.actionSteps.map(item => item.action)).to.eql([
      Action.INCREASE_TARGET_VALUE, Action.TAKE_CHEMICAL
    ])
  })

  it('governmentAction-or', () => {
    const saboteurActions = newSaboteurActions({location:Location.GOVERNMENT,actionSlot:ActionSlot.OR})

    expect(saboteurActions.actionSteps.map(item => item.action)).to.eql([
      Action.GOVERNMENT_PLACE_BOT_RESEARCH_PRIORITY
    ])
    expect(saboteurActions.allDecisionsResolved).to.false

    saboteurActions.chooseWeatherBranch(Weather.SUN)
    expect(saboteurActions.actionSteps.map(item => item.action)).to.eql([
      Action.GOVERNMENT_PLACE_BOT_RESEARCH_PRIORITY,
      Action.GOVERNMENT_PLACE_GEAR_REMOVE_SUBSIDY,
      Action.GOVERNMENT_GET_RESEARCH_TOKEN
    ])
    expect(saboteurActions.allDecisionsResolved).to.false

    saboteurActions.takeAlternativeAction(true)
    expect(saboteurActions.actionSteps.map(item => item.action)).to.eql([
      Action.GOVERNMENT_PLACE_BOT_RESEARCH_PRIORITY,
      Action.GOVERNMENT_PLACE_GEAR_REMOVE_SUBSIDY,
      Action.INCREASE_TARGET_VALUE,
      Action.GOVERNMENT_RUN_MACHINE
    ])
    expect(saboteurActions.allDecisionsResolved).to.true
  })

  it('governmentAction-and', () => {
    const saboteurActions = newSaboteurActions({location:Location.GOVERNMENT,actionSlot:ActionSlot.AND})

    expect(saboteurActions.actionSteps.map(item => item.action)).to.eql([
      Action.TAKE_CHEMICAL, Action.GOVERNMENT_FLIP_SUBSIDY,
      Action.GOVERNMENT_PLACE_BOT_RESEARCH_PRIORITY
    ])
    expect(saboteurActions.allDecisionsResolved).to.false

    saboteurActions.chooseWeatherBranch(Weather.SNOW)
    expect(saboteurActions.actionSteps.map(item => item.action)).to.eql([
      Action.TAKE_CHEMICAL, Action.GOVERNMENT_FLIP_SUBSIDY,
      Action.GOVERNMENT_PLACE_BOT_RESEARCH_PRIORITY,
      Action.GOVERNMENT_PLACE_GEAR_REMOVE_SUBSIDY,
      Action.GOVERNMENT_GET_RESEARCH_TOKEN
    ])
    expect(saboteurActions.allDecisionsResolved).to.false

    saboteurActions.takeAlternativeAction(false)
    expect(saboteurActions.actionSteps.map(item => item.action)).to.eql([
      Action.TAKE_CHEMICAL, Action.GOVERNMENT_FLIP_SUBSIDY,
      Action.GOVERNMENT_PLACE_BOT_RESEARCH_PRIORITY,
      Action.GOVERNMENT_PLACE_GEAR_REMOVE_SUBSIDY,
      Action.GOVERNMENT_GET_RESEARCH_TOKEN,
      Action.GOVERNMENT_RUN_MACHINE
    ])
    expect(saboteurActions.actionSteps.map(item => item.weatherBranchChosen)).to.eql([
      undefined, undefined,
      Weather.SNOW,
      Weather.SNOW,
      Weather.SNOW,
      Weather.SNOW
    ])
    expect(saboteurActions.allDecisionsResolved).to.true
  })

  it('lativsLab-or', () => {
    const saboteurActions = newSaboteurActions({location:Location.LATIVS_LAB,actionSlot:ActionSlot.OR})

    expect(saboteurActions.actionSteps.map(item => item.action)).to.eql([
      Action.LATIVS_LAB_PLACE_BOT_RESEARCH_PRIORITY
    ])
    expect(saboteurActions.allDecisionsResolved).to.false

    saboteurActions.chooseWeatherBranchNoMatchSkipSteps()
    expect(saboteurActions.actionSteps.map(item => item.action)).to.eql([
      Action.DISCARD_SECURITY_REPORT, Action.TAKE_CHEMICAL
    ])
    expect(saboteurActions.allDecisionsResolved).to.true
  })

  it('lativsLab-and', () => {
    const saboteurActions = newSaboteurActions({location:Location.LATIVS_LAB,actionSlot:ActionSlot.AND})

    expect(saboteurActions.actionSteps.map(item => item.action)).to.eql([
      Action.GET_AWARD_TOKEN, Action.LATIVS_LAB_PLACE_BOT_RESEARCH_PRIORITY
    ])
    expect(saboteurActions.allDecisionsResolved).to.false

    saboteurActions.chooseWeatherBranch(Weather.FOG)
    expect(saboteurActions.actionSteps.map(item => item.action)).to.eql([
      Action.GET_AWARD_TOKEN, Action.LATIVS_LAB_PLACE_BOT_RESEARCH_PRIORITY
    ])
    expect(saboteurActions.allDecisionsResolved).to.true
  })

  it('rnd-or', () => {
    const saboteurActions = newSaboteurActions({location:Location.RND,actionSlot:ActionSlot.OR})

    expect(saboteurActions.actionSteps.map(item => item.action)).to.eql([
      Action.RND_PLACE_BOT_RESEARCH_PRIORITY
    ])
    expect(saboteurActions.allDecisionsResolved).to.false

    // TODO: further testing
  })

  it('rnd-and', () => {
    const saboteurActions = newSaboteurActions({location:Location.RND,actionSlot:ActionSlot.AND})

    expect(saboteurActions.actionSteps.map(item => item.action)).to.eql([
      Action.RND_PLACE_BOT_PREVIOUS_REPORT_PRIORITY, Action.RND_PLACE_CHEMICAL,
      Action.RND_PLACE_BOT_RESEARCH_PRIORITY
    ])
    expect(saboteurActions.allDecisionsResolved).to.false

    // TODO: further testing
  })
})

function newSaboteurActions(params : {
  location : Location
  actionSlot? : ActionSlot
  tokens? : Token[]
  initiativePlayer? : Player
  weatherPriority? : Weather
  selectionPriority? : SelectionPriority
  citationUnlock? : Weather[]
}) {
  return new SaboteurActions({
    location: params.location,
    actionSlot: params.actionSlot,
    tokens: params.tokens || [],
    initiativePlayer: params.initiativePlayer || Player.PLAYER,
    weatherPriority: params.weatherPriority || Weather.RAIN,
    selectionPriority: params.selectionPriority || SelectionPriority.TOP,
    citationUnlock: params.citationUnlock || []
  })
}
