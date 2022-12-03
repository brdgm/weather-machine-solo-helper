/**
 * Action
 */
enum Action {
  CLAIM_INITIATIVE = 'claim-initiative',
  INCREASE_TARGET_VALUE = 'increase-target-value',
  INCREASE_TARGET_VALUE_OR_DISCARD_SECURITY_REPORT = 'increase-target-value-or-discard-security-report',
  TAKE_CHEMICAL = 'take-chemical',
  GOVERNMENT_FLIP_SUBSIDY = 'government-flip-subsidy',
  GOVERNMENT_PLACE_BOT_RESEARCH_PRIORITY = 'government-place-bot-research-priority',
  GOVERNMENT_PLACE_GEAR_REMOVE_SUBSIDY = 'government-place-gear-remove-subsidy',
  GOVERNMENT_GET_RESEARCH_TOKEN = 'government-get-research-token',
  GOVERNMENT_RUN_MACHINE = 'government-run-machine',
  GET_AWARD_TOKEN = 'get-award-token',
  LATIVS_LAB_PLACE_BOT_RESEARCH_PRIORITY = 'lativs-lab-place-bot-research-priority',
  LATIVS_LAB_PAY_CHEMICAL = 'lativs-lab-pay-chemical',
  RND_PLACE_BOT_PREVIOUS_REPORT_PRIORITY = 'rnd-place-bot-previous-report-priority',
  RND_PLACE_BOT_RESEARCH_PRIORITY = 'rnd-place-bot-research-priority',
  RND_CHEMICAL_AVAILABLE = 'rnd-chemical-available',
  RND_PLACE_CHEMICAL = 'rnd-place-chemical',
  RND_GET_RESEARCH_TOKEN = 'rnd-get-research-token',
  UNLOCK_CITATION = 'unlock-citation',
  DISCARD_SECURITY_REPORT = 'discard-security-report',
  DRAW_SECURITY_REPORT = 'draw-security-report',
  DISCARD_RESEARCH_TOKENS = 'discard-research-tokens',
  TAKE_EXTREME_WEATHER_TILE = 'take-extreme-weather-tile'
}
export default Action