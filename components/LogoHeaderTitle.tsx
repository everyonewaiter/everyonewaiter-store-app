import { StyleSheet, View } from 'react-native'

import Logo from '@/components/Logo'

interface LogoHeaderTitleProps {
  paddingLeft?: number
}

const LogoHeaderTitle = ({ paddingLeft = 0 }: LogoHeaderTitleProps) => {
  return (
    <View style={[styles.container, { paddingLeft }]}>
      <Logo size="medium" direction="row" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
  },
})

export default LogoHeaderTitle
