export const FontNames = {
  LOGO: 'Hakgyoansim-Dunggeunmiso-B',
  PRETENDARD_REGULAR: 'Pretendard-R',
  PRETENDARD_MEDIUM: 'Pretendard-M',
  PRETENDARD_BOLD: 'Pretendard-B',
} as const

export const FontAssets = {
  [FontNames.LOGO]: require('@/assets/fonts/Hakgyoansim-Dunggeunmiso-B.otf'),
  [FontNames.PRETENDARD_BOLD]: require('@/assets/fonts/Pretendard-Bold.otf'),
  [FontNames.PRETENDARD_MEDIUM]: require('@/assets/fonts/Pretendard-Medium.otf'),
  [FontNames.PRETENDARD_REGULAR]: require('@/assets/fonts/Pretendard-Regular.otf'),
}
