import findMandatory from "brdgm-commons/src/util/map/findMandatory";
import Card from "./Card";
import Agent from "./enum/Agent";
import Location from "./enum/Location";
import Weather from "./enum/Weather";
import SelectionPriority from "./enum/SelectionPriority";

const cards = [
  {
    id: 1,
    agent: Agent.WHITE,
    location: Location.LATIVS_LAB,
    weather: Weather.SNOW,
    selectionPriority: SelectionPriority.TOP
  },
  {
    id: 2,
    agent: Agent.WHITE,
    location: Location.RND,
    weather: Weather.FOG,
    selectionPriority: SelectionPriority.BOTTOM
  },
  {
    id: 3,
    agent: Agent.PINK,
    location: Location.RND,
    weather: Weather.WIND,
    selectionPriority: SelectionPriority.TOP
  },
  {
    id: 4,
    agent: Agent.PINK,
    location: Location.LATIVS_LAB,
    weather: Weather.SUN,
    selectionPriority: SelectionPriority.TOP
  },
  {
    id: 5,
    agent: Agent.PINK,
    location: Location.LATIVS_LAB,
    weather: Weather.SUN,
    selectionPriority: SelectionPriority.BOTTOM
  },
  {
    id: 6,
    agent: Agent.PINK,
    location: Location.FOLLOW_LATIV,
    weather: Weather.SNOW,
    selectionPriority: SelectionPriority.BOTTOM
  },
  {
    id: 7,
    agent: Agent.WHITE,
    location: Location.GOVERNMENT,
    weather: Weather.RAIN,
    selectionPriority: SelectionPriority.TOP
  },
  {
    id: 8,
    agent: Agent.WHITE,
    location: Location.FOLLOW_LATIV,
    weather: Weather.SNOW,
    selectionPriority: SelectionPriority.TOP
  },
  {
    id: 9,
    agent: Agent.WHITE,
    location: Location.LATIVS_LAB,
    weather: Weather.WIND,
    selectionPriority: SelectionPriority.BOTTOM
  },
  {
    id: 10,
    agent: Agent.WHITE,
    location: Location.FOLLOW_LATIV,
    weather: Weather.RAIN,
    selectionPriority: SelectionPriority.TOP
  },
  {
    id: 11,
    agent: Agent.PINK,
    location: Location.GOVERNMENT,
    weather: Weather.SNOW,
    selectionPriority: SelectionPriority.TOP
  },
  {
    id: 12,
    agent: Agent.PINK,
    location: Location.FOLLOW_LATIV,
    weather: Weather.RAIN,
    selectionPriority: SelectionPriority.BOTTOM
  },
  {
    id: 13,
    agent: Agent.WHITE,
    location: Location.LATIVS_LAB,
    weather: Weather.WIND,
    selectionPriority: SelectionPriority.BOTTOM
  },
  {
    id: 14,
    agent: Agent.PINK,
    location: Location.LATIVS_LAB,
    weather: Weather.RAIN,
    selectionPriority: SelectionPriority.TOP
  },
  {
    id: 15,
    agent: Agent.WHITE,
    location: Location.RND,
    weather: Weather.SUN,
    selectionPriority: SelectionPriority.TOP
  },
  {
    id: 16,
    agent: Agent.PINK,
    location: Location.RND,
    weather: Weather.FOG,
    selectionPriority: SelectionPriority.BOTTOM
  },
  {
    id: 17,
    agent: Agent.WHITE,
    location: Location.SUPPLY,
    weather: Weather.WIND,
    selectionPriority: SelectionPriority.BOTTOM
  },
  {
    id: 18,
    agent: Agent.PINK,
    location: Location.SUPPLY,
    weather: Weather.FOG,
    selectionPriority: SelectionPriority.TOP
  },
  {
    id: 19,
    agent: Agent.PINK,
    location: Location.GOVERNMENT,
    weather: Weather.WIND,
    selectionPriority: SelectionPriority.BOTTOM
  },
  {
    id: 20,
    agent: Agent.WHITE,
    location: Location.GOVERNMENT,
    weather: Weather.SUN,
    selectionPriority: SelectionPriority.BOTTOM
  }
]

const cardsMap = new Map<number,Card>()
cards.forEach(card => cardsMap.set(card.id, card))

export default {

  /**
   * Get card by ID
   * @param id ID
   * @returns Card
   */
  get(id: number) : Card {
    return findMandatory(cardsMap, id)
  },

  /**
   * Get all cards
   * @returns cards
   */
  getAll() : Card[] {
    return cards
  }

}
