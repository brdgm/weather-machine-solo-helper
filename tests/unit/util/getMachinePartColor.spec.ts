import MachinePart from '@/services/enum/MachinePart'
import getMachinePartColor from '@/util/getMachinePartColor'
import { expect } from 'chai'

describe('util/getMachinePartColor', () => {
  it('get', () => {
    expect(getMachinePartColor(MachinePart.GREEN)).to.eq('#6bbe4b')
  })
})
