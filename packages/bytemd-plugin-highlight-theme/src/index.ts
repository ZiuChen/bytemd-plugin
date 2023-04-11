import type { BytemdPlugin, BytemdEditorContext, BytemdAction } from 'bytemd'
import { IHighlightInfo } from './types'
import { getDOM, setStyle } from './utils'
import defaultHighlights from './highlights.json'
import en from '../locales/en.json'
import { HIGHLIGHT_ICON } from './icons'

export interface HighlightThemeOptions {
  locale?: Record<string, string>
  highlights?: Record<string, string>
  defaultHighlight?: string
}

/**
 * 切换代码高亮主题插件
 */
export default function highlightThemePlugin(options?: HighlightThemeOptions): BytemdPlugin {
  const locale = { ...en, ...options?.locale } as typeof en
  const STYLE_ID = 'highlight-theme' // id of <style> tag
  const highlights = options?.highlights || defaultHighlights
  const highlightList = Object.keys(highlights) as THighlightKey[]
  const DEFAULT_HIGHLIGHT = (options?.defaultHighlight || highlightList[0]) as THighlightKey

  type THighlightKey = keyof typeof highlights

  const highlightInfo: IHighlightInfo = {
    highlight: '' as THighlightKey,
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

  const setHighlightStyle = (id: string) => setStyle.bind(null, getDOM(id))

  function highlightActionFactory(highlight: THighlightKey): BytemdAction {
    return {
      title: highlight,
      handler: {
        type: 'action',
        click: ({ editor }: BytemdEditorContext) => {
          const v = editor.getValue()
          const { start, end } = highlightInfo.position
          const frontmatter = v.slice(start.offset, end.offset)

          // 无 frontmatter
          if (highlightInfo.status === 0) {
            const newFrontmatter = `---\nhighlight: ${highlight}\n---\n`
            editor.setValue(newFrontmatter + v)
          }

          // 有 frontmatter 但是没有 highlight 字段
          if (highlightInfo.status === 1) {
            const newFrontmatter = frontmatter.replace('---', `---\nhighlight: ${highlight}`)
            editor.setValue(v.replace(frontmatter, newFrontmatter))
          }

          // 有 frontmatter 有 highlight 字段
          if (highlightInfo.status === 2) {
            const newFrontmatter = frontmatter.replace(highlightInfo.highlight, highlight)
            editor.setValue(v.replace(frontmatter, newFrontmatter))
          }

          editor.focus()
        }
      }
    }
  }

  return {
    actions: [
      {
        title: locale.highlightTheme,
        icon: HIGHLIGHT_ICON,
        handler: {
          type: 'dropdown',
          actions: [...highlightList.map((highlight) => highlightActionFactory(highlight))]
        }
      }
    ],
    remark(processor) {
      // 由 frontmatter 插件解析 frontmatter
      // @ts-ignore
      return processor.use(() => (tree, file) => {
        // 当前未添加 frontmatter 块 则直接返回 使用默认主题
        if (!file.frontmatter) {
          setHighlightStyle(STYLE_ID)(highlights[DEFAULT_HIGHLIGHT])
          highlightInfo.status = 0
          return
        }

        // 获取 frontmatter 块的位置并保存到全局变量中
        const { start, end } = tree.children[0].position
        highlightInfo.position = { start, end }

        const { highlight } = file.frontmatter as {
          highlight?: THighlightKey
        }

        // 有 frontmatter 块但是没有 theme 字段 则使用默认主题
        if (!highlight) {
          setHighlightStyle(STYLE_ID)(highlights[DEFAULT_HIGHLIGHT])
          highlightInfo.status = 1
          return
        }

        // 有 theme 字段 则设置主题样式
        if (highlightList.includes(highlight)) {
          setHighlightStyle(STYLE_ID)(highlights[highlight])
          highlightInfo.highlight = highlight
          highlightInfo.status = 2
        }
      })
    }
  }
}
