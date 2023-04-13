import _themes from '../public/themes.json'

interface IPosition {
  line: number
  column: number
  offset: number
}

export type DefaultTheme = typeof _themes

export interface IBasicInfo {
  /**
   * current active theme
   */
  data: string
  /**
   * 0: no frontmatter
   * 1: no frontmatter.theme
   * 2: has frontmatter.theme
   */
  status: 0 | 1 | 2
  /**
   * position of frontmatter block in markdown body
   */
  position: {
    start: IPosition
    end: IPosition
  }
}

export interface MarkdownThemeOptions {
  /**
   * Markdown theme map
   */
  themes: typeof _themes
  /**
   * Locale
   */
  locale?: Record<string, string>
  /**
   * Default markdown theme
   */
  defaultTheme?: string
  /**
   * id of style element inserted into <head>
   */
  styleId?: string
}
