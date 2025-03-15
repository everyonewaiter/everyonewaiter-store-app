import { useEffect, useState } from 'react'

import {
  addOrientationChangeListener,
  getOrientationAsync,
  lockAsync,
  Orientation,
  OrientationLock,
  removeOrientationChangeListener,
  unlockAsync,
} from 'expo-screen-orientation'

const PORTRAIT_ORIENTATIONS = [
  Orientation.PORTRAIT_UP,
  Orientation.PORTRAIT_DOWN,
]
const LANDSCAPE_ORIENTATIONS = [
  Orientation.LANDSCAPE_LEFT,
  Orientation.LANDSCAPE_RIGHT,
]

const lockOrientation = async (orientationLock: OrientationLock) => {
  await lockAsync(orientationLock)
}

const unlockOrientation = async () => {
  await unlockAsync()
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

  return {
    orientation,
    lockOrientation,
    unlockOrientation,
    isPortrait: PORTRAIT_ORIENTATIONS.includes(orientation),
    isLandscape: LANDSCAPE_ORIENTATIONS.includes(orientation),
  }
}
