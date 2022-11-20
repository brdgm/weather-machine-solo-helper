import { Token } from "@/store"
import ActionStep from "./ActionStep"
import Action from "./enum/Action"
import ActionSlot from "./enum/ActionSlot"
import Location from "./enum/Location"
import Player from "./enum/Player"

/**
 * Determines the saboteurs actions after taking the action location.
 */
export default class SaboteurActions {

  private _actionSteps : ActionStep[]

  public constructor(params : SaboteurActionsParams) {
    // steps for main location
    switch (params.location) {
      case Location.SUPPLY:
        this._actionSteps = SaboteurActions.buildSupplyActionSteps(params.initiativePlayer)
        break;
      case Location.GOVERNMENT:
        this._actionSteps = SaboteurActions.buildGovernmentActionSteps(params.actionSlot, params.tokens)
        break;
      case Location.LATIVS_LAB:
        this._actionSteps = SaboteurActions.buildLativsLabActionSteps(params.actionSlot, params.tokens)
        break;
      case Location.RND:
        this._actionSteps = SaboteurActions.buildRndActionSteps(params.actionSlot, params.tokens)
        break;
      default:
        throw new Error(`Invalid location: ${location}`)
    }
    // steps for wreaking havoc (changing sets of research tokens)
    this._actionSteps.push(...SaboteurActions.buildTokenSetActionSteps(params.tokens))
  }

  public get actionSteps() : readonly ActionStep[] {
    return this._actionSteps
  }

  private static buildSupplyActionSteps(initiativePlayer : Player) : ActionStep[] {
    const result : ActionStep[] = []
    if (initiativePlayer == Player.PLAYER) {
      result.push({action:Action.CLAIM_INITIATIVE})
    }
    else {
      result.push({action:Action.INCREASE_TARGET_VALUE, count:2})
    }
    result.push({action:Action.TAKE_CHEMICAL, count:2})
    return result
  }

  private static buildGovernmentActionSteps(actionSlot : ActionSlot|undefined, tokens: Token[]) : ActionStep[] {
    const result : ActionStep[] = []
    if (actionSlot == ActionSlot.AND) {
      result.push({action:Action.TAKE_CHEMICAL, count:1})
      result.push({action:Action.GOVERNMENT_FLIP_SUBSIDY})
    }
    result.push({action:Action.GOVERNMENT_PLACE_BOT_RESEARCH_PRIORITY})
    result.push({action:Action.GOVERNMENT_PLACE_GEAR_REMOVE_SUBSIDY})
    result.push({action:Action.GOVERNMENT_GET_RESEARCH_TOKEN,
        alternativeActions:[{action:Action.INCREASE_TARGET_VALUE, count:5}]})
    result.push({action:Action.GOVERNMENT_RUN_MACHINE, optional:true})
    return result
  }

  private static buildLativsLabActionSteps(actionSlot : ActionSlot|undefined, tokens: Token[]) : ActionStep[] {
    const result : ActionStep[] = []
    if (actionSlot == ActionSlot.AND) {
      result.push({action:Action.GET_AWARD_TOKEN})
    }
    result.push({action:Action.LATIVS_LAB_PLACE_BOT_RESEARCH_PRIORITY})
    result.push({action:Action.LATIVS_LAB_PAY_CHEMICAL})
    return result
  }

  private static buildRndActionSteps(actionSlot : ActionSlot|undefined, tokens: Token[]) : ActionStep[] {
    const result : ActionStep[] = []
    if (actionSlot == ActionSlot.AND) {
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

  private static buildTokenSetActionSteps(tokens: Token[]) : ActionStep[] {
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
}