export type ThemeColor = 'amber' | 'blue' | 'green' | 'neutral'

export const useTheme = () => {
    return useState<ThemeColor>('theme', () => 'neutral')
}
