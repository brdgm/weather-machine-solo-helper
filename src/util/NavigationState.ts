import { State } from "@/store"
import { RouteLocation } from "vue-router"

export default class NavigationState {

  readonly round : number

  constructor(route : RouteLocation, state : State) {
    this.round = parseInt(route.params['round'] as string)
  }

}
