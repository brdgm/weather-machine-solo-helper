import { Token } from "@/store"
import SelectionPriority from "./enum/SelectionPriority"
import Weather from "./enum/Weather"

export default interface ActionContextParams {
  selectionPriority: SelectionPriority
  weatherPriority: Weather
  citationUnlock: Weather[]
  tokens: Token[]
}
