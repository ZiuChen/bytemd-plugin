import type { BytemdPlugin, BytemdEditorContext, BytemdAction } from 'bytemd'
import { MARKDOWN_THEME_ICON } from './icons'
import en from '../locales/en.json'
import type { IBasicInfo, MarkdownThemeOptions } from './types'

/**
 * Markdown Theme Plugin
 */
export default function markdownThemePlugin(options?: MarkdownThemeOptions): BytemdPlugin {
  const styleId = options?.styleId || '__markdown-theme__'
  const locale = { ...en, ...options?.locale } as typeof en
  const themeMap = options?.themes as Record<string, string>

  if (!themeMap) throw new Error('No markdown theme found, please check your options.')

  const themeList = Object.keys(themeMap)
  const defaultTheme = options?.defaultTheme || themeList[0]
  const defaultDarkTheme = options?.defaultDarkTheme || themeList[0]

  if (!themeList.length) throw new Error('No markdown theme found, please check your options.')
  if (!themeList.includes(defaultTheme))
    throw new Error(`Invalid default markdown theme: ${defaultTheme}, please check your options.`)

  const info: IBasicInfo = {
    data: '',
    status: 'no-frontmatter',
    position: {
      start: {
        line: 0,
        column: 0,
        offset: 0
      },
      end: {
        line: 0,
        column: 0,
        offset: 0
      }
    }
  }

  const updateStyle = (styleCode: string) => {
    const _style = document.querySelector(`#${styleId}`)
    if (_style) {
      _style.innerHTML = styleCode
      return
    }

    // create a new style element if not exists
    const style = document.createElement('style')
    style.setAttribute('id', styleId)
    style.setAttribute('type', 'text/css')
    style.setAttribute('data-theme-name', info.data)
    document.head.appendChild(style)
    style.innerHTML = styleCode
  }

  const themeActionFactory = (theme: string): BytemdAction => ({
    title: theme,
    handler: {
      type: 'action',
      click: ({ editor }: BytemdEditorContext) => {
        const v = editor.getValue()
        const { start, end } = info.position
        const frontmatter = v.slice(start.offset, end.offset)

        const newFrontmatter =
          info.status === 'no-frontmatter'
            ? `---\ntheme: ${theme}\n---\n`
            : info.status === 'no-frontmatter-theme'
            ? frontmatter.replace('---', `---\ntheme: ${theme}`)
            : frontmatter.replace(info.data, theme)

        editor.setValue(v.replace(frontmatter, newFrontmatter))
        editor.focus()
      }
    }
  })

  let isDark = document.body.classList.contains('dark')

  // Watch for dark mode changes
  // Use MutationObserver to watch for dark mode changes
  const observer = new MutationObserver(() => {
    console.log('dark mode changed')
    const darkMode = document.body.classList.contains('dark')
    if (darkMode !== isDark) {
      isDark = darkMode
      refreshStyle()
    }
  })

  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['class']
  })

  const refreshStyle = () => {
    console.log('refreshStyle', info, isDark)
    if (info.status === 'no-frontmatter' || info.status === 'no-frontmatter-theme') {
      // use default theme if no frontmatter or no theme field
      const styleCode = themeMap[isDark ? defaultDarkTheme : defaultTheme] || ''
      updateStyle(styleCode)
      return
    }

    // use frontmatter theme if exists
    const styleCode = themeMap[info.data] || ''
    updateStyle(styleCode)
  }

  return {
    actions: [
      {
        title: locale.markdownTheme,
        icon: MARKDOWN_THEME_ICON,
        handler: {
          type: 'dropdown',
          actions: [...themeList.map((theme) => themeActionFactory(theme))]
        }
      }
    ],
    viewerEffect: () => {
      refreshStyle()
    },
    remark: (processor) =>
      // @ts-ignore
      processor.use(() => (tree, file) => {
        // no frontmatter block, return directly and use default theme
        if (!file.frontmatter) {
          info.status = 'no-frontmatter'
          refreshStyle()
          // reset position
          info.position = {
            start: {
              line: 0,
              column: 0,
              offset: 0
            },
            end: {
              line: 0,
              column: 0,
              offset: 0
            }
          }
          return
        }

        // get position of frontmatter block and save it to global variable
        const { start, end } = tree.children[0].position
        info.position = { start, end }

        const { theme } = file.frontmatter as {
          theme?: string
        }

        // no theme field, use default theme
        if (!theme) {
          info.status = 'no-frontmatter-theme'
          refreshStyle()
          return
        }

        // use theme field if it exists
        if (themeList.includes(theme)) {
          info.data = theme
          info.status = 'has-frontmatter-theme'
          refreshStyle()
          return
        }

        // theme field is invalid
        throw new Error(`Invalid markdown theme: ${theme}, please check your options.`)
      })
  }
}
