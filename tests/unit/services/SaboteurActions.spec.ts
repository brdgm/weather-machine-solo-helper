import Location from '@/services/enum/Location'
import Player from '@/services/enum/Player'
import Weather from '@/services/enum/Weather'
import SaboteurActions from '@/services/SaboteurActions'
import { expect } from 'chai'
import Action from '@/services/enum/Action'
import ActionSlot from '@/services/enum/ActionSlot'

describe('services/SaboteurActions', () => {
  it('supplyAction-player', () => {
    const saboteurActions = newSaboteurActions({location:Location.SUPPLY,initiativePlayer:Player.PLAYER})

    expect(saboteurActions.actionSteps.map(item => item.action)).to.eql([
      Action.CLAIM_INITIATIVE, Action.TAKE_CHEMICAL
    ])
    expect(saboteurActions.allDecisionsResolved).to.true

    expect(saboteurActions.processTokens([])).to.eql([])
    expect(saboteurActions.processCitationUnlock([])).to.eql([])
    expect(saboteurActions.processInitiativePlayer(Player.PLAYER)).to.eq(Player.SABOTEUR)
    expect(saboteurActions.processSecurityReport()).to.eql([])
  })

  it('supplyAction-saboteur', () => {
    const saboteurActions = newSaboteurActions({location:Location.SUPPLY,initiativePlayer:Player.SABOTEUR})

    expect(saboteurActions.actionSteps.map(item => item.action)).to.eql([
      Action.INCREASE_TARGET_VALUE, Action.TAKE_CHEMICAL
    ])
    expect(saboteurActions.allDecisionsResolved).to.true

    expect(saboteurActions.processTokens([])).to.eql([])
    expect(saboteurActions.processCitationUnlock([])).to.eql([])
    expect(saboteurActions.processInitiativePlayer(Player.SABOTEUR)).to.eq(Player.SABOTEUR)
    expect(saboteurActions.processSecurityReport()).to.eql([])
  })

  it('supplyAction-exchangeTokens-3', () => {
    const saboteurActions = newSaboteurActions({location:Location.SUPPLY,initiativePlayer:Player.SABOTEUR})

    expect(saboteurActions.actionSteps.map(item => item.action)).to.eql([
      Action.INCREASE_TARGET_VALUE, Action.TAKE_CHEMICAL
    ])
    expect(saboteurActions.allDecisionsResolved).to.true

    saboteurActions.addDrawSecurityReport()
    saboteurActions.addResearchTokenSetActions({
      weather: Weather.SUN,
      tokens: [
        {location:Location.GOVERNMENT,weather:Weather.SUN},
        {location:Location.LATIVS_LAB,weather:Weather.SUN},
        {award:true}
      ]
    })
    expect(saboteurActions.actionSteps.map(item => item.action)).to.eql([
      Action.INCREASE_TARGET_VALUE, Action.TAKE_CHEMICAL,
      Action.DRAW_SECURITY_REPORT,
      Action.DISCARD_RESEARCH_TOKENS,Action.TAKE_EXTREME_WEATHER_TILE,
      Action.DISCARD_SECURITY_REPORT,Action.UNLOCK_CITATION
    ])
    expect(saboteurActions.allDecisionsResolved).to.true

    expect(saboteurActions.processTokens([
      {location:Location.RND,weather:Weather.RAIN},
      {location:Location.GOVERNMENT,weather:Weather.SUN},
      {location:Location.LATIVS_LAB,weather:Weather.SUN},
      {award:true}
    ])).to.eql([{location:Location.RND,weather:Weather.RAIN}])
    expect(saboteurActions.processCitationUnlock([])).to.eql([Weather.SUN])
    expect(saboteurActions.processInitiativePlayer(Player.SABOTEUR)).to.eq(Player.SABOTEUR)
    expect(saboteurActions.processSecurityReport()).to.eql([Action.DRAW_SECURITY_REPORT,Action.DISCARD_SECURITY_REPORT])
  })

  it('supplyAction-exchangeTokens-2', () => {
    const saboteurActions = newSaboteurActions({location:Location.SUPPLY,initiativePlayer:Player.SABOTEUR})

    expect(saboteurActions.actionSteps.map(item => item.action)).to.eql([
      Action.INCREASE_TARGET_VALUE, Action.TAKE_CHEMICAL
    ])
    expect(saboteurActions.allDecisionsResolved).to.true

    saboteurActions.addDrawSecurityReport()
    saboteurActions.addResearchTokenSetActions({
      weather: Weather.SUN,
      tokens: [
        {location:Location.GOVERNMENT,weather:Weather.SUN},
        {location:Location.LATIVS_LAB,weather:Weather.SUN}
      ]
    })
    expect(saboteurActions.actionSteps.map(item => item.action)).to.eql([
      Action.INCREASE_TARGET_VALUE, Action.TAKE_CHEMICAL,
      Action.DRAW_SECURITY_REPORT,
      Action.DISCARD_RESEARCH_TOKENS,
      Action.INCREASE_TARGET_VALUE_OR_DISCARD_SECURITY_REPORT
    ])
    expect(saboteurActions.allDecisionsResolved).to.false

    saboteurActions.takeAlternativeAction(true)
    expect(saboteurActions.actionSteps.map(item => item.action)).to.eql([
      Action.INCREASE_TARGET_VALUE, Action.TAKE_CHEMICAL,
      Action.DRAW_SECURITY_REPORT,
      Action.DISCARD_RESEARCH_TOKENS,
      Action.DISCARD_SECURITY_REPORT
    ])
    expect(saboteurActions.allDecisionsResolved).to.true

    expect(saboteurActions.processTokens([
      {location:Location.RND,weather:Weather.RAIN},
      {location:Location.GOVERNMENT,weather:Weather.SUN},
      {location:Location.LATIVS_LAB,weather:Weather.SUN},
      {award:true}
    ])).to.eql([{location:Location.RND,weather:Weather.RAIN},{award:true}])
    expect(saboteurActions.processCitationUnlock([Weather.SUN])).to.eql([Weather.SUN])
    expect(saboteurActions.processInitiativePlayer(Player.SABOTEUR)).to.eq(Player.SABOTEUR)
    expect(saboteurActions.processSecurityReport()).to.eql([Action.DRAW_SECURITY_REPORT,Action.DISCARD_SECURITY_REPORT])
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

    expect(saboteurActions.processTokens([])).to.eql([])
    expect(saboteurActions.processCitationUnlock([])).to.eql([])
    expect(saboteurActions.processInitiativePlayer(Player.PLAYER)).to.eq(Player.PLAYER)
    expect(saboteurActions.processSecurityReport()).to.eql([])
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

    expect(saboteurActions.processTokens([])).to.eql([{location:Location.GOVERNMENT,weather:Weather.SNOW}])
    expect(saboteurActions.processCitationUnlock([])).to.eql([])
    expect(saboteurActions.processInitiativePlayer(Player.PLAYER)).to.eq(Player.PLAYER)
    expect(saboteurActions.processSecurityReport()).to.eql([])
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

    expect(saboteurActions.processTokens([])).to.eql([])
    expect(saboteurActions.processCitationUnlock([])).to.eql([])
    expect(saboteurActions.processInitiativePlayer(Player.PLAYER)).to.eq(Player.PLAYER)
    expect(saboteurActions.processSecurityReport()).to.eql([Action.DISCARD_SECURITY_REPORT])
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

    expect(saboteurActions.processTokens([])).to.eql([{award:true}])
    expect(saboteurActions.processCitationUnlock([])).to.eql([])
    expect(saboteurActions.processInitiativePlayer(Player.PLAYER)).to.eq(Player.PLAYER)
    expect(saboteurActions.processSecurityReport()).to.eql([])
  })

  it('rnd-or', () => {
    const saboteurActions = newSaboteurActions({location:Location.RND,actionSlot:ActionSlot.OR})

    expect(saboteurActions.actionSteps.map(item => item.action)).to.eql([
      Action.RND_PLACE_BOT_RESEARCH_PRIORITY
    ])
    expect(saboteurActions.allDecisionsResolved).to.false

    saboteurActions.chooseWeatherBranch(Weather.SUN)
    expect(saboteurActions.actionSteps.map(item => item.action)).to.eql([
      Action.RND_PLACE_BOT_RESEARCH_PRIORITY,
      Action.RND_GET_RESEARCH_TOKEN
    ])
    expect(saboteurActions.allDecisionsResolved).to.false

    saboteurActions.takeAlternativeAction(false)
    expect(saboteurActions.actionSteps.map(item => item.action)).to.eql([
      Action.RND_PLACE_BOT_RESEARCH_PRIORITY,
      Action.RND_GET_RESEARCH_TOKEN
    ])
    expect(saboteurActions.allDecisionsResolved).to.true

    expect(saboteurActions.processTokens([])).to.eql([{location:Location.RND,weather:Weather.SUN}])
    expect(saboteurActions.processCitationUnlock([])).to.eql([])
    expect(saboteurActions.processInitiativePlayer(Player.PLAYER)).to.eq(Player.PLAYER)
    expect(saboteurActions.processSecurityReport()).to.eql([])
  })

  it('rnd-or-citation-already-unlocked', () => {
    const saboteurActions = newSaboteurActions({location:Location.RND,actionSlot:ActionSlot.OR,citationUnlock:[Weather.SUN,Weather.RAIN]})

    expect(saboteurActions.actionSteps.map(item => item.action)).to.eql([
      Action.RND_PLACE_BOT_RESEARCH_PRIORITY
    ])
    expect(saboteurActions.allDecisionsResolved).to.false

    saboteurActions.chooseWeatherBranch(Weather.SUN)
    expect(saboteurActions.actionSteps.map(item => item.action)).to.eql([
      Action.RND_PLACE_BOT_RESEARCH_PRIORITY,
      Action.RND_GET_RESEARCH_TOKEN
    ])
    expect(saboteurActions.allDecisionsResolved).to.false

    saboteurActions.takeAlternativeAction(true)
    expect(saboteurActions.actionSteps.map(item => item.action)).to.eql([
      Action.RND_PLACE_BOT_RESEARCH_PRIORITY,
      Action.INCREASE_TARGET_VALUE
    ])
    expect(saboteurActions.allDecisionsResolved).to.true

    expect(saboteurActions.processTokens([])).to.eql([])
    expect(saboteurActions.processCitationUnlock([Weather.SUN,Weather.RAIN])).to.eql([Weather.SUN,Weather.RAIN])
    expect(saboteurActions.processInitiativePlayer(Player.PLAYER)).to.eq(Player.PLAYER)
    expect(saboteurActions.processSecurityReport()).to.eql([])
  })

  it('rnd-and', () => {
    const saboteurActions = newSaboteurActions({location:Location.RND,actionSlot:ActionSlot.AND})

    expect(saboteurActions.actionSteps.map(item => item.action)).to.eql([
      Action.RND_PLACE_BOT_PREVIOUS_REPORT_PRIORITY
    ])
    expect(saboteurActions.allDecisionsResolved).to.false

    saboteurActions.chooseWeatherBranch(Weather.RAIN)
    expect(saboteurActions.actionSteps.map(item => item.action)).to.eql([
      Action.RND_PLACE_BOT_PREVIOUS_REPORT_PRIORITY,
      Action.RND_CHEMICAL_AVAILABLE
    ])
    expect(saboteurActions.allDecisionsResolved).to.false

    saboteurActions.takeAlternativeAction(true)
    expect(saboteurActions.actionSteps.map(item => item.action)).to.eql([
      Action.RND_PLACE_BOT_PREVIOUS_REPORT_PRIORITY,
      Action.RND_PLACE_CHEMICAL,
      Action.RND_GET_RESEARCH_TOKEN
    ])
    expect(saboteurActions.allDecisionsResolved).to.false

    saboteurActions.takeAlternativeAction(true)
    expect(saboteurActions.actionSteps.map(item => item.action)).to.eql([
      Action.RND_PLACE_BOT_PREVIOUS_REPORT_PRIORITY,
      Action.RND_PLACE_CHEMICAL,
      Action.INCREASE_TARGET_VALUE,
      Action.UNLOCK_CITATION,
      Action.RND_PLACE_BOT_RESEARCH_PRIORITY
    ])
    expect(saboteurActions.allDecisionsResolved).to.false

    saboteurActions.chooseWeatherBranch(Weather.RAIN)
    expect(saboteurActions.actionSteps.map(item => item.action)).to.eql([
      Action.RND_PLACE_BOT_PREVIOUS_REPORT_PRIORITY,
      Action.RND_PLACE_CHEMICAL,
      Action.INCREASE_TARGET_VALUE,
      Action.UNLOCK_CITATION,
      Action.RND_PLACE_BOT_RESEARCH_PRIORITY,
      Action.RND_GET_RESEARCH_TOKEN
    ])
    expect(saboteurActions.allDecisionsResolved).to.false

    saboteurActions.takeAlternativeAction(true)
    expect(saboteurActions.actionSteps.map(item => item.action)).to.eql([
      Action.RND_PLACE_BOT_PREVIOUS_REPORT_PRIORITY,
      Action.RND_PLACE_CHEMICAL,
      Action.INCREASE_TARGET_VALUE,
      Action.UNLOCK_CITATION,
      Action.RND_PLACE_BOT_RESEARCH_PRIORITY,
      Action.INCREASE_TARGET_VALUE
    ])
    expect(saboteurActions.allDecisionsResolved).to.true

    expect(saboteurActions.processTokens([])).to.eql([])
    expect(saboteurActions.processCitationUnlock([])).to.eql([Weather.RAIN])
    expect(saboteurActions.processInitiativePlayer(Player.PLAYER)).to.eq(Player.PLAYER)
    expect(saboteurActions.processSecurityReport()).to.eql([])
  })
})

function newSaboteurActions(params : {
  location : Location
  actionSlot? : ActionSlot
  initiativePlayer? : Player
  citationUnlock? : Weather[]
}) {
  return new SaboteurActions({
    location: params.location,
    actionSlot: params.actionSlot,
    initiativePlayer: params.initiativePlayer || Player.PLAYER,
    citationUnlock: params.citationUnlock || []
  })
}
