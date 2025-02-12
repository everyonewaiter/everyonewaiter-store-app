export const fonts = {
  HAKGYOANSIM_DUNGGEUNMISO_BOLD: 'Hakgyoansim-Dunggeunmiso-B',
  PRETENDARD_REGULAR: 'Pretendard-R',
  PRETENDARD_MEDIUM: 'Pretendard-M',
  PRETENDARD_BOLD: 'Pretendard-B',
} as const

export const fontAssets = {
  [fonts.HAKGYOANSIM_DUNGGEUNMISO_BOLD]: require('@/assets/fonts/Hakgyoansim-Dunggeunmiso-B.otf'),
  [fonts.PRETENDARD_BOLD]: require('@/assets/fonts/Pretendard-Bold.otf'),
  [fonts.PRETENDARD_MEDIUM]: require('@/assets/fonts/Pretendard-Medium.otf'),
  [fonts.PRETENDARD_REGULAR]: require('@/assets/fonts/Pretendard-Regular.otf'),
} as const
