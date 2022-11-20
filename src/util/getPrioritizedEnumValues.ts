/**
 * Get list of enum values starting with the prioritized one keeping the overall order.
 * @param priority Prioritizes enum value
 * @returns List of all enum values starting with the prioritizes one
 */
export default function<T extends Record<string, unknown>>(anEnum: T, priority: T[keyof T]) : T[keyof T][] {
  const allValues = Object.values(anEnum) as unknown as T[keyof T][]
  const currentIndex = allValues.indexOf(priority)
  const result : T[keyof T][] = []
  for (let i=currentIndex; i<allValues.length; i++) {
    result.push(allValues[i])
  }
  for (let i=0; i<currentIndex; i++) {
    result.push(allValues[i])
  }
  return result
}
