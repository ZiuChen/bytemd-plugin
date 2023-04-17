import type { BytemdPlugin, BytemdEditorContext, BytemdAction } from 'bytemd'
import { HIGHLIGHT_ICON } from './icons'
import en from '../locales/en.json'
import type { IBasicInfo, HighlightThemeOptions } from './types'

/**
 * Highlight Theme Plugin
 */
export default function highlightThemePlugin(options?: HighlightThemeOptions): BytemdPlugin {
  const styleId = options?.styleId || '__highlight-theme__'
  const locale = { ...en, ...options?.locale } as typeof en
  const themeMap = options?.highlights

  if (!themeMap) throw new Error('No highlight theme found, please check your options.')

  const themeList = Object.keys(themeMap)
  const defaultHighlight = options?.defaultHighlight || themeList[0]

  if (!themeList.length) throw new Error('No highlight theme found, please check your options.')
  if (!themeList.includes(defaultHighlight))
    throw new Error(
      `Invalid default highlight theme: ${defaultHighlight}, please check your options.`
    )

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

  const highlightActionFactory = (highlight: string): BytemdAction => ({
    title: highlight,
    handler: {
      type: 'action',
      click: ({ editor }: BytemdEditorContext) => {
        const v = editor.getValue()
        const { start, end } = info.position
        const frontmatter = v.slice(start.offset, end.offset)

        const newFrontmatter =
          info.status === 0
            ? `---\nhighlight: ${highlight}\n---\n`
            : info.status === 1
            ? frontmatter.replace('---', `---\nhighlight: ${highlight}`)
            : frontmatter.replace(info.data, highlight)

        editor.setValue(v.replace(frontmatter, newFrontmatter))
        editor.focus()
      }
    }
  })

  return {
    actions: [
      {
        title: locale.highlightTheme,
        icon: HIGHLIGHT_ICON,
        handler: {
          type: 'dropdown',
          actions: [...themeList.map((highlight) => highlightActionFactory(highlight))]
        }
      }
    ],
    remark: (processor) =>
      // @ts-ignore
      processor.use(() => (tree, file) => {
        const styleCode = themeMap[defaultHighlight] || ''

        // no frontmatter block, return directly and use default theme
        if (!file.frontmatter) {
          updateStyle(styleCode)
          info.status = 0
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

        const { highlight } = file.frontmatter as {
          highlight?: string
        }

        // no theme field, use default theme
        if (!highlight) {
          updateStyle(styleCode)
          info.status = 1
          return
        }

        // use theme field if it exists
        if (themeList.includes(highlight)) {
          updateStyle(themeMap[highlight])
          info.data = highlight
          info.status = 2
          return
        }

        // theme field is invalid
        throw new Error(`Invalid highlight theme: ${highlight}, please check your options.`)
      })
  }
}
