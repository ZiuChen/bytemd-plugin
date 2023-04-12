import _highlights from '../public/highlights.json'

interface IPosition {
  line: number
  column: number
  offset: number
}

export type DefaultHighlights = typeof _highlights

export interface IBasicInfo {
  /**
   * current active theme
   */
  data: string
  /**
   * 0: no frontmatter
   * 1: no frontmatter.highlight
   * 2: has frontmatter.highlight
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

export interface HighlightThemeOptions {
  /**
   * Highlight theme map
   */
  highlights: Record<string, string>
  /**
   * Locale
   */
  locale?: Record<string, string>
  /**
   * Default highlight
   */
  defaultHighlight?: string
  /**
   * id of style element inserted into <head>
   */
  styleId?: string
}
