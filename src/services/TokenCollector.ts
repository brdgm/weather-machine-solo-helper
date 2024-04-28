import { Token } from '@/store/state'
import getPrioritizedEnumValues from 'brdgm-commons/src/util/enum/getPrioritizedEnumValues'
import MainLocations from '@/util/MainLocations'
import Location from './enum/Location'
import Weather from './enum/Weather'

/**
 * Calculates sets of tokens
 */
export default class TokenCollector {

  private _tokens : Token[]
  private _citationUnlock : Weather[]
  private _weatherPriority : Weather

  public constructor(tokens : Token[], citationUnlock: Weather[], weatherPriority: Weather) {
    this._tokens = tokens
    this._citationUnlock = citationUnlock
    this._weatherPriority = weatherPriority
  }

  /**
   * Get all sets of research tokens that can be build out of the available tokens in order of prioritization.
   */
  public getValidResearchTokenSets() : ResearchTokenSet[] {
    const result : ResearchTokenSet[] = []

    // copy token list to remove during set collections
    const tokens = [...this._tokens]

    // check weather in priority order
    const allWeathers = getPrioritizedEnumValues(Weather, this._weatherPriority)

    // check all weathers which do not have the citation space unlocked (3 tokens required)
    for (const weather of allWeathers.filter(item => !this._citationUnlock.includes(item))) {
      result.push(...this.findTokenSets(weather, 3, tokens))
    }

    // then check all weathers which do have the citation space unlocked (2 tokens required)
    for (const weather of allWeathers.filter(item => this._citationUnlock.includes(item))) {
      result.push(...this.findTokenSets(weather, 2, tokens))
    }

    return result
  }

  private findTokenSets(weather: Weather, requiredTokensPerSet: number, tokens: Token[]) : ResearchTokenSet[] {
    const result : ResearchTokenSet[] = []
    const tokenSet = TokenSet.for(weather, tokens)
    if (tokenSet.hasToken) {
      const requiredAwardTokens = requiredTokensPerSet - tokenSet.count
      if (tokens.filter(item => item.award).length >= requiredAwardTokens) {
        tokenSet.fillWithAwardTokens(requiredAwardTokens)
        TokenCollector.removeMatchingTokensFrom(tokens, tokenSet.tokens)
        result.push(tokenSet.toResearchTokenSet())
      }
    }
    return result
  }

  /**
   * Get list of weathers wich helps most to complete a set (and then all remaining weathers based on prioritization).
   */
  public getWeatherPrioritizationToCompleteSet(location : Location) : Weather [] {
    const result : Weather[] = []

    // check weather in priority order
    const allWeathers = getPrioritizedEnumValues(Weather, this._weatherPriority)

    // check all weathers which do not have the citation space unlocked (3 tokens required)
    for (const weather of allWeathers.filter(item => !this._citationUnlock.includes(item))) {
      const tokenSet = TokenSet.for(weather, this._tokens)
      if (tokenSet.hasToken && tokenSet.count < 3 && !tokenSet.tokens.find(item => item.location==location)) {
        result.push(weather)
      }
    }

    // then check all weathers which do have the citation space unlocked (2 tokens required)
    for (const weather of allWeathers.filter(item => this._citationUnlock.includes(item))) {
      const tokenSet = TokenSet.for(weather, this._tokens)
      if (tokenSet.hasToken && tokenSet.count < 2 && !tokenSet.tokens.find(item => item.location==location)) {
        result.push(weather)
      }
    }

    // add all remaining weathers
    for (const weather of allWeathers) {
      if (!result.includes(weather)) {
        result.push(weather)
      }
    }

    return result
  }

  /**
   * Remove matching token in the given list of all token.s
   * @param allTokens All tokens to remove from
   * @param tokensToRemove Tokens to remove
   */
  static removeMatchingTokensFrom(allTokens : Token[], tokensToRemove : Token[]) {
    for (const token of tokensToRemove) {
      const index = allTokens.findIndex(item => item.award==token.award && item.location==token.location && item.weather==token.weather)
      if (index >= 0) {
        allTokens.splice(index, 1)
      }
    }
  }

}

class TokenSet {
  weather : Weather
  tokens : Token[]
  
  constructor(weather : Weather, tokens : Token[]) {
    this.weather = weather
    this.tokens = tokens
  }

  /**
   * Has at least one token.
   */
  get hasToken() : boolean {
    return this.tokens.length > 0
  }

  /**
   * Has at least one token.
   */
  get count() : number {
    return this.tokens.length
  }

  /**
   * Fill missing slots with award tokens.
   */
  fillWithAwardTokens(count : number) : void {
    for (let i=0; i<count; i++) {
      this.tokens.push({award:true})
    }
  }

  toResearchTokenSet() : ResearchTokenSet {
    return {weather:this.weather,tokens:this.tokens}
  }
  
  /**
   * Creates a new token set by trying to find a matching token for this weather for each main location.
   */
  static for(weather: Weather, tokens:Token[]) {
    const result : Token[] = []
    for (const location of MainLocations) {
      const matchingToken = tokens.find(item => item.weather==weather && item.location==location)
      if (matchingToken) {
        result.push(matchingToken)
      }
    }
    return new TokenSet(weather, result)
  }
}

export interface ResearchTokenSet {
  weather: Weather
  tokens: Token[]
}
