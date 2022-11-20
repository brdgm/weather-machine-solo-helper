import { Token } from "@/store"
import Action from "./enum/Action"
import SelectionPriority from "./enum/SelectionPriority"
import Weather from "./enum/Weather"

export default interface ActionStep {
  action: Action
  count?: number
  optional?: boolean
  selectionPriority?: SelectionPriority
  weatherPriority?: Weather
  citationUnlock?: Weather[]
  tokens?: Token[]
  chooseWeatherBranch?: boolean
  weatherBranchChosen?: Weather
  alternativeActions?: ActionStep[]
  alternativeActionsTaken?: boolean
}
