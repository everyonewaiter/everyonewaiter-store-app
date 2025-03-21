const { withAndroidManifest } = require('@expo/config-plugins')

function addAttributesToManifest(androidManifest) {
  const { manifest } = androidManifest

  const supportsScreens = {}
  supportsScreens.$ = {
    ...supportsScreens.$,
    ...{
      'android:smallScreens': false,
      'android:normalScreens': false,
      'android:largeScreens': true,
      'android:xlargeScreens': true,
    },
  }

  manifest['supports-screens'] = supportsScreens
  return androidManifest
}

module.exports = function withSupportsScreens(config) {
  return withAndroidManifest(config, config => {
    config.modResults = addAttributesToManifest(config.modResults)
    return config
  })
}
