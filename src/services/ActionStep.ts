import Action from "./enum/Action"
import Weather from "./enum/Weather"
import { ResearchTokenSet } from "./TokenCollector"

export default interface ActionStep {
  action: Action
  count?: number
  optional?: boolean
  chooseWeatherBranch?: boolean
  weatherBranchChosen?: Weather
  alternativeActions?: ActionStep[]
  alternativeActionsTaken?: boolean
  researchTokenSet?: ResearchTokenSet
}
