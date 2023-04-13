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

  if (!themeList.length) throw new Error('No markdown theme found, please check your options.')
  if (!themeList.includes(defaultTheme))
    throw new Error(`Invalid default markdown theme: ${defaultTheme}, please check your options.`)

  const info: IBasicInfo = {
    data: '',
    status: 0,
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
    const d = document.querySelector(`#${styleId}`) || document.createElement('style')
    d.setAttribute('id', styleId)
    document.head.appendChild(d)
    d.innerHTML = styleCode
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
          info.status === 0
            ? `---\ntheme: ${theme}\n---\n`
            : info.status === 1
            ? frontmatter.replace('---', `---\ntheme: ${theme}`)
            : frontmatter.replace(info.data, theme)

        editor.setValue(v.replace(frontmatter, newFrontmatter))
        editor.focus()
      }
    }
  })

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
    remark: (processor) =>
      // @ts-ignore
      processor.use(() => (tree, file) => {
        const styleCode = themeMap[defaultTheme] || ''

        // no frontmatter block, return directly and use default theme
        if (!file.frontmatter) {
          updateStyle(styleCode)
          info.status = 0
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
          updateStyle(styleCode)
          info.status = 1
          return
        }

        // use theme field if it exists
        if (themeList.includes(theme)) {
          updateStyle(themeMap[theme])
          info.data = theme
          info.status = 2
          return
        }

        // theme field is invalid
        throw new Error(`Invalid markdown theme: ${theme}, please check your options.`)
      })
  }
}
