import { ForwardedRef } from 'react'

export const mergeRefs = <T>(...refs: ForwardedRef<T>[]) => {
  return (node: T) => {
    refs.forEach(ref => {
      if (typeof ref === 'function') {
        ref(node)
      } else if (ref) {
        ref.current = node
      }
    })
  }
}

export const clearNullableInterval = (interval: NodeJS.Timeout | null) => {
  if (interval) {
    clearInterval(interval)
  }
}
