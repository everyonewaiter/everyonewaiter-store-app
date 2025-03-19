import Svg, { Circle, SvgProps } from 'react-native-svg'

export const RadioOffIcon = (props: SvgProps) => (
  <Svg width={18} height={18} fill="none" {...props}>
    <Circle cx={9} cy={9} r={8.5} stroke="#CCC" />
  </Svg>
)
