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
   * status of frontmatter theme
   * - 'no-frontmatter': no frontmatter block found
   * - 'no-frontmatter-theme': frontmatter block found but no theme field
   * - 'has-frontmatter-theme': frontmatter block found and theme field exists
   */
  status: 'no-frontmatter' | 'no-frontmatter-theme' | 'has-frontmatter-theme'
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
   * Default dark markdown theme
   */
  defaultDarkTheme?: string
  /**
   * id of style element inserted into <head>
   */
  styleId?: string
}
