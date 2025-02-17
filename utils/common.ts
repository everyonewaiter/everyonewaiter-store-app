import { ForwardedRef } from 'react'

import { isAxiosError } from 'axios'

export const parseErrorMessage = (error: Error) => {
  if (isAxiosError(error)) {
    return error.response?.data.message ?? error.message
  }
  return error.message
}

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
