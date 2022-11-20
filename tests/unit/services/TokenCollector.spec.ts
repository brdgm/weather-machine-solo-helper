import Location from '@/services/enum/Location'
import Weather from '@/services/enum/Weather'
import TokenCollector from '@/services/TokenCollector'
import { Token } from '@/store'
import { expect } from 'chai'

describe('services/TokenCollector.spec', () => {
  it('empty', () => {
    const collector = new TokenCollector([], [], Weather.WIND)

    expect(collector.getValidResearchTokenSets()).to.eql([])
    expect(collector.getWeatherPrioritizationToCompleteSet(Location.GOVERNMENT)).to.eql([Weather.WIND,Weather.SUN,Weather.FOG,Weather.SNOW,Weather.RAIN])
  })

  it('tooFew', () => {
    const collector = new TokenCollector([
        token(Location.GOVERNMENT, Weather.SUN),
        token(Location.LATIVS_LAB, Weather.SUN)
      ], [], Weather.RAIN)

    expect(collector.getValidResearchTokenSets()).to.eql([])
    expect(collector.getWeatherPrioritizationToCompleteSet(Location.GOVERNMENT)).to.eql([Weather.RAIN,Weather.WIND,Weather.SUN,Weather.FOG,Weather.SNOW])
  })

  it('exactMatch', () => {
    const collector = new TokenCollector([
        token(Location.GOVERNMENT, Weather.SUN),
        token(Location.LATIVS_LAB, Weather.SUN),
        token(Location.RND, Weather.SUN)
      ], [], Weather.RAIN)

    expect(collector.getValidResearchTokenSets()).to.eql([
      {weather:Weather.SUN,tokens:[
        token(Location.GOVERNMENT, Weather.SUN),
        token(Location.LATIVS_LAB, Weather.SUN),
        token(Location.RND, Weather.SUN)
      ]}
    ])
    expect(collector.getWeatherPrioritizationToCompleteSet(Location.GOVERNMENT)).to.eql([Weather.RAIN,Weather.WIND,Weather.SUN,Weather.FOG,Weather.SNOW])
  })

  it('multiplePrioritized', () => {
    const collector = new TokenCollector([
        award(),
        award(),
        token(Location.RND, Weather.WIND),
        token(Location.GOVERNMENT, Weather.SUN),
        token(Location.LATIVS_LAB, Weather.SNOW),
        token(Location.GOVERNMENT, Weather.SNOW)
      ], [Weather.WIND,Weather.SUN], Weather.FOG)

    expect(collector.getValidResearchTokenSets()).to.eql([
      {weather:Weather.SNOW,tokens:[
        token(Location.GOVERNMENT, Weather.SNOW),
        token(Location.LATIVS_LAB, Weather.SNOW),
        award()
      ]},
      {weather:Weather.WIND,tokens:[
        token(Location.RND, Weather.WIND),
        award()
      ]}      
    ])
    expect(collector.getWeatherPrioritizationToCompleteSet(Location.RND)).to.eql([Weather.SNOW,Weather.SUN,Weather.FOG,Weather.RAIN,Weather.WIND])
  })
})

function token(location:Location, weather:Weather) : Token {
  return {location:location, weather:weather}
}
function award() : Token {
  return {award:true}
}
