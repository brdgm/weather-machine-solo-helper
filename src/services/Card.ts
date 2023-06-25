import Agent from './enum/Agent'
import SelectionPriority from './enum/SelectionPriority'
import Location from './enum/Location'
import Weather from './enum/Weather'

export default interface Card {
  id: number
  agent: Agent
  location: Location
  weather: Weather
  selectionPriority: SelectionPriority
}
