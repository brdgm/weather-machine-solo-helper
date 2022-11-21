import { Token } from "@/store"
import ActionStep from "./ActionStep"
import Action from "./enum/Action"
import ActionSlot from "./enum/ActionSlot"
import Location from "./enum/Location"
import Player from "./enum/Player"
import SelectionPriority from "./enum/SelectionPriority"
import Weather from "./enum/Weather"

/**
 * Determines the saboteurs actions after taking the action location.
 */
export default class SaboteurActions {

  private _actionSteps : ActionStep[]

  public constructor(params : SaboteurActionsParams) {
    // steps for main location
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
    // steps for wreaking havoc (changing sets of research tokens)
    this._actionSteps.push(...SaboteurActions.buildTokenSetActionSteps(params))
    // add common parameters to all actions steps
    this._actionSteps.forEach(step => {
      step.selectionPriority = params.selectionPriority
      step.weatherPriority = params.weatherPriority
      step.citationUnlock = params.citationUnlock
      step.tokens = params.tokens
    })
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
    result.push({action:Action.GOVERNMENT_RUN_MACHINE, optional:true})
    return result
  }

  private static buildLativsLabActionSteps(params : SaboteurActionsParams) : ActionStep[] {
    const result : ActionStep[] = []
    if (params.actionSlot == ActionSlot.AND) {
      result.push({action:Action.GET_AWARD_TOKEN})
    }
    result.push({action:Action.LATIVS_LAB_PLACE_BOT_RESEARCH_PRIORITY,
      chooseWeatherBranch: true})
    result.push({action:Action.LATIVS_LAB_PAY_CHEMICAL})
    return result
  }

  private static buildRndActionSteps(params : SaboteurActionsParams) : ActionStep[] {
    const result : ActionStep[] = []
    if (params.actionSlot == ActionSlot.AND) {
      result.push({action:Action.RND_PLACE_BOT_PREVIOUS_REPORT_PRIORITY})
      result.push({action:Action.RND_PLACE_CHEMICAL, optional:true})
    }
    result.push({action:Action.RND_PLACE_BOT_RESEARCH_PRIORITY,
      chooseWeatherBranch: true})
    result.push({action:Action.RND_PLACE_CHEMICAL})
    result.push({action:Action.RND_GET_RESEARCH_TOKEN,
      alternativeActions:[
        {action:Action.INCREASE_TARGET_VALUE, count:5},
        {action:Action.UNLOCK_CITATION}
      ]})
  return result
  }

  private static buildTokenSetActionSteps(params : SaboteurActionsParams) : ActionStep[] {
    const result : ActionStep[] = []
    // TODO: implement
    return result
  }

  /**
   * Get list of all actions steps. The list stops when a decision is open to take alternative steps or not.
   * If the decision was taken, the list includes the alternative steps if required.
   */
  public get actionSteps() : readonly ActionStep[] {
    const result : ActionStep[] = []
    for (const actionStep of this._actionSteps) {
      if (hasDecision(actionStep)) {
        if (actionStep.alternativeActions && actionStep.alternativeActionsTaken) {
          // include alternative action in list if decision was to alternative
          result.push(...actionStep.alternativeActions)
        }
        else {
          result.push(actionStep)
        }
        if (isUnresolved(actionStep)) {
          // do not include further steps if decision is open
          break
        }
      }
      else {
        result.push(actionStep)
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
   * Takes a decision for the first open alternative action.
   */
  public chooseWeatherBranch(weatherBranchChosen : Weather) : void {
    const unresolvedStepIndex = this._actionSteps.findIndex(
      step => step.chooseWeatherBranch && step.weatherBranchChosen == undefined)
    if (unresolvedStepIndex >= 0) {
      for (let i=unresolvedStepIndex; i<this._actionSteps.length; i++) {
        const actionStep = this._actionSteps[i]
        actionStep.weatherBranchChosen = weatherBranchChosen
        if (actionStep.alternativeActions) {
          actionStep.alternativeActions.forEach(step => step.weatherBranchChosen = weatherBranchChosen)
        }
      }
    }
  }

  /**
   * Takes a decision for the first open alternative action.
   */
  public takeAlternativeAction(alternativeActionsTaken : boolean) : void {
    const unresolvedStepIndex = this._actionSteps.findIndex(
      step => step.alternativeActions && step.alternativeActionsTaken == undefined)
    if (unresolvedStepIndex >= 0) {
      this._actionSteps[unresolvedStepIndex].alternativeActionsTaken = alternativeActionsTaken
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
    return result
  }

  /**
   * Checks if additional citation spaces were unlocked during this turn.
   */
  public processCitationUnlock(citationUnlock : Weather[]) : Weather[] {
    // TODO: implement
    return citationUnlock
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

}

function hasDecision(actionStep: ActionStep) : boolean {
  return actionStep.alternativeActions != undefined
      || actionStep.chooseWeatherBranch == true
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
  tokens : Token[]
  initiativePlayer? : Player
  weatherPriority : Weather
  selectionPriority : SelectionPriority
  citationUnlock : Weather[]
}
