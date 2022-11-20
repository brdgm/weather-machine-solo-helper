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
  }

  public get actionSteps() : readonly ActionStep[] {
    return this._actionSteps
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
      result.push({action:Action.GOVERNMENT_FLIP_SUBSIDY,
          weatherPriority:params.weatherPriority, selectionPriority:params.selectionPriority})
    }
    result.push({action:Action.GOVERNMENT_PLACE_BOT_RESEARCH_PRIORITY})
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
    result.push({action:Action.LATIVS_LAB_PLACE_BOT_RESEARCH_PRIORITY})
    result.push({action:Action.LATIVS_LAB_PAY_CHEMICAL})
    return result
  }

  private static buildRndActionSteps(params : SaboteurActionsParams) : ActionStep[] {
    const result : ActionStep[] = []
    if (params.actionSlot == ActionSlot.AND) {
      result.push({action:Action.RND_PLACE_BOT_PREVIOUS_REPORT_PRIORITY})
      result.push({action:Action.RND_PLACE_CHEMICAL, optional:true})
    }
    result.push({action:Action.RND_PLACE_BOT_RESEARCH_PRIORITY})
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

}

export interface SaboteurActionsParams {
  location : Location
  actionSlot? : ActionSlot
  tokens: Token[]
  initiativePlayer : Player
  weatherPriority : Weather
  selectionPriority : SelectionPriority
}
