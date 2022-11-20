import Weather from '@/services/enum/Weather'
import getPrioritizedEnumValues from '@/util/getPrioritizedEnumValues'
import { expect } from 'chai'

describe('util/getPrioritizedEnumValues', () => {
  it('weather-rain', () => {
    expect(getPrioritizedEnumValues(Weather,Weather.RAIN)).to.eql([Weather.RAIN,Weather.WIND,Weather.SUN,Weather.FOG,Weather.SNOW])
  })

  it('weather-sun', () => {
    expect(getPrioritizedEnumValues(Weather,Weather.SUN)).to.eql([Weather.SUN,Weather.FOG,Weather.SNOW,Weather.RAIN,Weather.WIND])
  })
})
