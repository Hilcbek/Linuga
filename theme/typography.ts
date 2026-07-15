export const fontFamily = {
  thin: 'Inter-Thin',
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  semiBold: 'Inter-SemiBold',
  bold: 'Inter-Bold',
  black: 'Inter-Black',
} as const;

export const typography = {
  h1: { fontFamily: fontFamily.bold, fontSize: 32, lineHeight: 38.4 },
  h2: { fontFamily: fontFamily.semiBold, fontSize: 24, lineHeight: 31.2 },
  h3: { fontFamily: fontFamily.semiBold, fontSize: 20, lineHeight: 26 },
  h4: { fontFamily: fontFamily.medium, fontSize: 16, lineHeight: 22.4 },
  bodyLarge: { fontFamily: fontFamily.regular, fontSize: 16, lineHeight: 25.6 },
  bodyMedium: { fontFamily: fontFamily.regular, fontSize: 14, lineHeight: 22.4 },
  bodySmall: { fontFamily: fontFamily.regular, fontSize: 13, lineHeight: 20.8 },
  caption: { fontFamily: fontFamily.regular, fontSize: 11, lineHeight: 15.4 },
} as const;

export type TypographyStyle = keyof typeof typography;
