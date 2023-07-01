import { Token } from '@/store'
import ActionStep from './ActionStep'
import Action from './enum/Action'
import ActionSlot from './enum/ActionSlot'
import Location from './enum/Location'
import Player from './enum/Player'
import Weather from './enum/Weather'
import TokenCollector, { ResearchTokenSet } from './TokenCollector'

/**
 * Determines the saboteurs actions after taking the action location.
 */
export default class SaboteurActions {

  private _actionSteps : ActionStep[]
  private _citationUnlock : Weather[]

  public constructor(params : SaboteurActionsParams) {
    this._citationUnlock = params.citationUnlock
    switch (params.location) {
      case Location.SUPPLY:
        this._actionSteps = SaboteurActions.buildSupplyActionSteps(params)
        break;
      case Location.GOVERNMENT:
        this._actionSteps = SaboteurActions.buildGovernmentActionSteps(params)
        break;
      case Location.LATIVS_LAB:
        this._actionSteps = SaboteurActions.buildLativsLabActionSteps(params)
        break;
      case Location.RND:
        this._actionSteps = SaboteurActions.buildRndActionSteps(params)
        break;
      default:
        throw new Error(`Invalid location: ${location}`)
    }
  }

  private static buildSupplyActionSteps(params : SaboteurActionsParams) : ActionStep[] {
    const result : ActionStep[] = []
    if (params.initiativePlayer == Player.PLAYER) {
      result.push({action:Action.CLAIM_INITIATIVE})
    }
    else {
      result.push({action:Action.INCREASE_TARGET_VALUE, count:2})
    }
    result.push({action:Action.TAKE_CHEMICAL, count:2})
    return result
  }

  private static buildGovernmentActionSteps(params : SaboteurActionsParams) : ActionStep[] {
    const result : ActionStep[] = []
    if (params.actionSlot == ActionSlot.AND) {
      result.push({action:Action.TAKE_CHEMICAL, count:1})
      result.push({action:Action.GOVERNMENT_FLIP_SUBSIDY})
    }
    result.push({action:Action.GOVERNMENT_PLACE_BOT_RESEARCH_PRIORITY,
        chooseWeatherBranch: true})
    result.push({action:Action.GOVERNMENT_PLACE_GEAR_REMOVE_SUBSIDY})
    result.push({action:Action.GOVERNMENT_GET_RESEARCH_TOKEN,
        alternativeActions:[{action:Action.INCREASE_TARGET_VALUE, count:5}]})
    result.push({action:Action.GOVERNMENT_RUN_MACHINE})
    return result
  }

  private static buildLativsLabActionSteps(params : SaboteurActionsParams) : ActionStep[] {
    const result : ActionStep[] = []
    if (params.actionSlot == ActionSlot.AND) {
      result.push({action:Action.GET_AWARD_TOKEN})
    }
    result.push({action:Action.LATIVS_LAB_PLACE_BOT_RESEARCH_PRIORITY,
      chooseWeatherBranch: true})
    return result
  }

  private static buildRndActionSteps(params : SaboteurActionsParams) : ActionStep[] {
    const result : ActionStep[] = []
    if (params.actionSlot == ActionSlot.AND) {
      result.push({action:Action.RND_PLACE_BOT_PREVIOUS_REPORT_PRIORITY,
        chooseWeatherBranch: true})
      result.push({action:Action.RND_CHEMICAL_AVAILABLE,
        alternativeActions:[
          {action:Action.RND_PLACE_CHEMICAL},
          {action:Action.RND_GET_RESEARCH_TOKEN,
            alternativeActions:[
              {action:Action.INCREASE_TARGET_VALUE, count:5},
              {action:Action.UNLOCK_CITATION}
            ]
          }
        ]
      })
    }
    result.push({action:Action.RND_PLACE_BOT_RESEARCH_PRIORITY,
      chooseWeatherBranch: true})
    result.push({action:Action.RND_GET_RESEARCH_TOKEN,
      alternativeActions:[
        {action:Action.INCREASE_TARGET_VALUE, count:5},
        {action:Action.UNLOCK_CITATION}
      ]
    })
  return result
  }

  /**
   * Get list of all actions steps. The list stops when a decision is open to take alternative steps or not.
   * If the decision was taken, the list includes the alternative steps if required.
   */
  public get actionSteps() : readonly ActionStep[] {
    const result : ActionStep[] = []
    for (let i=0; i<this._actionSteps.length; i++) {
      const actionStep = this._actionSteps[i]
      // skip duplicate UNLOCK_CITATION step for same type of weather, and for for already unlocked weathers
      if (actionStep.action == Action.UNLOCK_CITATION && actionStep.weatherBranchChosen
          && (this._actionSteps.findIndex(item => item.action==Action.UNLOCK_CITATION && item.weatherBranchChosen==actionStep.weatherBranchChosen) < i
          || this._citationUnlock.includes(actionStep.weatherBranchChosen))) {
        continue
      }
      result.push(actionStep)
      if (hasDecision(actionStep) && isUnresolved(actionStep)) {
        // do not include further steps if decision is open
        break
      }
    }
    return result
  }

  /**
   * Checks if there are no steps left with a decision that needs to be taken.
   */
  public get allDecisionsResolved() : boolean {
    return this._actionSteps.filter(isUnresolved).length == 0
  }

  /**
   * Find the first weather branch selection step and choose the given weather.
   */
  public chooseWeatherBranch(weatherBranchChosen : Weather) : void {
    const unresolvedStepIndex = this._actionSteps.findIndex(
      step => step.chooseWeatherBranch && (step.weatherBranchChosen == undefined))
    if (unresolvedStepIndex >= 0) {
      // apply chosen weather to weather decision step, and to all subsequent steps
      for (let i=unresolvedStepIndex; i<this._actionSteps.length; i++) {
        const actionStep = this._actionSteps[i]
        if (actionStep.chooseWeatherBranch && i>unresolvedStepIndex) {
          // stop at next action that requires to choose a weather
          break;
        }
        updateActionStepRecursively(actionStep, step => step.weatherBranchChosen = weatherBranchChosen)
      }
    }
  }

  /**
   * Find the first weather branch selection step and mark it that no branch was matched, skipping further steps.
   */
  public chooseWeatherBranchNoMatchSkipSteps() : void {
    const unresolvedStepIndex = this._actionSteps.findIndex(
      step => step.chooseWeatherBranch && (step.weatherBranchChosen == undefined))
    if (unresolvedStepIndex >= 0) {
      // remove branch selection and all subsequent steps
      this._actionSteps.splice(unresolvedStepIndex)
      // instead insert two fallback steps
      const newSteps : ActionStep[] = [
        {action:Action.DISCARD_SECURITY_REPORT},
        {action:Action.TAKE_CHEMICAL,count:1}
      ]
      this._actionSteps.push(...newSteps)
    }
  }

  /**
   * Takes a decision for the first open alternative action.
   */
  public takeAlternativeAction(alternativeActionsTaken : boolean) : void {
    const unresolvedStepIndex = this._actionSteps.findIndex(
      step => step.alternativeActions && step.alternativeActionsTaken == undefined)
    if (unresolvedStepIndex >= 0) {
      const stepToResolve = this._actionSteps[unresolvedStepIndex]
      stepToResolve.alternativeActionsTaken = alternativeActionsTaken
      if (alternativeActionsTaken) {
        // insert alternative actions instead of the decision step
        this._actionSteps.splice(unresolvedStepIndex,1,...(stepToResolve.alternativeActions ?? []))
      }
    }
  }

  /**
   * Adds the tokens from the chosen actions to the existing ones.
   */
  public processTokens(tokens : Token[]) : Token[] {
    const result : Token[] = [...tokens]
    const tokenSteps = this.actionSteps.filter(item => item.action==Action.GOVERNMENT_GET_RESEARCH_TOKEN
        || item.action==Action.RND_GET_RESEARCH_TOKEN
        || item.action==Action.GET_AWARD_TOKEN)
        .filter(item => !isUnresolved(item))
    for (const tokenStep of tokenSteps) {
      if (tokenStep.action == Action.GOVERNMENT_GET_RESEARCH_TOKEN && tokenStep.weatherBranchChosen) {
        result.push({location:Location.GOVERNMENT,weather:tokenStep.weatherBranchChosen})
      }
      if (tokenStep.action == Action.RND_GET_RESEARCH_TOKEN && tokenStep.weatherBranchChosen) {
        result.push({location:Location.RND,weather:tokenStep.weatherBranchChosen})
      }
      if (tokenStep.action == Action.GET_AWARD_TOKEN) {
        result.push({award:true})
      }
    }
    const discardResearchTokensStep = this.actionSteps.find(item => item.action==Action.DISCARD_RESEARCH_TOKENS)
    if (discardResearchTokensStep && discardResearchTokensStep.researchTokenSet) {
      TokenCollector.removeMatchingTokensFrom(result, discardResearchTokensStep.researchTokenSet.tokens)
    }
    return result
  }

  /**
   * Checks if additional citation spaces were unlocked during this turn.
   */
  public processCitationUnlock(citationUnlock : Weather[]) : Weather[] {
    const result : Weather[] = [...citationUnlock]
    result.push(...this.actionSteps
        .filter(item => item.action == Action.UNLOCK_CITATION)
        .filter(item => item.weatherBranchChosen != undefined && !citationUnlock.includes(item.weatherBranchChosen))
        .map(item => item.weatherBranchChosen ?? Weather.RAIN))
    return result
  }

  /**
   * Checks if the saboteurs claimed initiative during this turn.
   */
  public processInitiativePlayer(initiativePlayer : Player) : Player {
    const initiativeStep = this.actionSteps.find(item => item.action==Action.CLAIM_INITIATIVE)
    if (initiativeStep) {
      return Player.SABOTEUR
    }
    else {
      return initiativePlayer
    }
  }

  /**
   * Gets all actions related to drawing or discarding security reports.
   */
  public processSecurityReport() : Action[] {
    return this.actionSteps
        .filter(item => item.action==Action.DISCARD_SECURITY_REPORT || item.action==Action.DRAW_SECURITY_REPORT)
        .map(item => item.action)
  }

  /**
   * Add discard security report action for end of turn
   */
  public addDrawSecurityReport() : void {
    this._actionSteps.push({action:Action.DRAW_SECURITY_REPORT})
  }

  /**
   * Generate list of actions if the saboteurs have a valid research token set.
   * @param researchTokenSet Research token set
   * @returns Actions
   */
  public addResearchTokenSetActions(researchTokenSet : ResearchTokenSet) : void {
    if (researchTokenSet.tokens.length == 3) {
      this._actionSteps.push(...[
        {action:Action.DISCARD_RESEARCH_TOKENS,weatherBranchChosen:researchTokenSet.weather,researchTokenSet:researchTokenSet},
        {action:Action.TAKE_EXTREME_WEATHER_TILE,weatherBranchChosen:researchTokenSet.weather},
        {action:Action.DISCARD_SECURITY_REPORT},
        {action:Action.UNLOCK_CITATION,weatherBranchChosen:researchTokenSet.weather}
      ])
    }
    else {
      this._actionSteps.push(...[
        {action:Action.DISCARD_RESEARCH_TOKENS,weatherBranchChosen:researchTokenSet.weather,researchTokenSet:researchTokenSet},
        {action:Action.INCREASE_TARGET_VALUE_OR_DISCARD_SECURITY_REPORT,count:5,
          alternativeActions:[{action:Action.DISCARD_SECURITY_REPORT}]}
      ])
    }
  }

}

function updateActionStepRecursively(actionStep : ActionStep, update: (step: ActionStep) => void) {
  update(actionStep)
  if (actionStep.alternativeActions) {
    actionStep.alternativeActions.forEach(step => updateActionStepRecursively(step, update))
  }
}

function hasDecision(actionStep: ActionStep) : boolean {
  return actionStep.alternativeActions != undefined
      || (actionStep.chooseWeatherBranch != undefined && actionStep.chooseWeatherBranch)
}

function isUnresolved(actionStep: ActionStep) : boolean {
  if (actionStep.chooseWeatherBranch) {
    if (actionStep.weatherBranchChosen == undefined) {
      return true
    }
  }
  if (actionStep.alternativeActions) {
    if (actionStep.alternativeActionsTaken == undefined) {
      return true
    }
  }
  return false
}

export interface SaboteurActionsParams {
  location : Location
  actionSlot? : ActionSlot
  initiativePlayer? : Player
  citationUnlock: Weather[]
}
