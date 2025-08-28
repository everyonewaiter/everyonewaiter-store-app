import { StyleSheet, Text, View } from 'react-native'

import { colors, fonts } from '@/constants'

const SoldOut = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.soldOutText}>SOLD OUT</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  soldOutText: {
    fontFamily: fonts.PRETENDARD_BOLD,
    fontSize: 24,
    color: colors.WHITE,
  },
})

export default SoldOut
