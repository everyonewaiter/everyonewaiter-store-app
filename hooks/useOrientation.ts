import { useEffect, useState } from 'react'

import {
  addOrientationChangeListener,
  getOrientationAsync,
  lockAsync,
  Orientation,
  OrientationLock,
  removeOrientationChangeListener,
} from 'expo-screen-orientation'

const lockOrientation = async (orientationLock: OrientationLock) => {
  await lockAsync(orientationLock)
}

export const useOrientation = () => {
  const [orientation, setOrientation] = useState(Orientation.UNKNOWN)

  useEffect(() => {
    getOrientationAsync().then(orientation => setOrientation(orientation))

    const subscription = addOrientationChangeListener(event =>
      setOrientation(event.orientationInfo.orientation),
    )

    return () => removeOrientationChangeListener(subscription)
  }, [])

  return { orientation, lockOrientation }
}
