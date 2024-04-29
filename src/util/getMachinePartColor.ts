import MachinePart from '@/services/enum/MachinePart'

export default function(machinePart : MachinePart) : string {
  switch (machinePart) {
    case MachinePart.GREEN:
      return '#6bbe4b'
    case MachinePart.WHITE:
      return '#ffffff'
    case MachinePart.PINK:
      return '#d99089'
    case MachinePart.RED:
      return '#bb2655'
    case MachinePart.BLUE:
      return '#25aae1'
    default:
      throw new Error('Invalid machine part: ' + machinePart)
  }
}
