import * as Application from 'expo-application'

import * as Sentry from '@sentry/react-native'

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  release: Application.nativeApplicationVersion ?? undefined,
  sendDefaultPii: true,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  integrations: [
    Sentry.mobileReplayIntegration({
      maskAllText: false,
      maskAllImages: false,
      maskAllVectors: false,
    }),
  ],
})
