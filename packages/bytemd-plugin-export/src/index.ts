import html2pdf from 'html2pdf.js'
import type { BytemdAction, BytemdPlugin } from 'bytemd'
import en from '../locales/en.json'
import { EXPORT } from './icons'
import { download, b64toBlob } from './utils'

export type SupportedExportType = 'markdown' | 'html' | 'pdf' | 'png'

export interface ExportPluginOptions {
  locale?: Record<string, string>
  /**
   * prefix of filename
   */
  prefix?: string
  /**
   * ignore some export actions, empty means no ignore
   */
  ignore?: SupportedExportType[]
}

/**
 * Export Plugin
 */
export default function exportPlugin(options?: ExportPluginOptions): BytemdPlugin {
  const locale = { ...en, ...options?.locale } as typeof en

  /**
   * get filename
   */
  const getFilename = () => `${options?.prefix || 'bytemd'}-${new Date().getTime()}`

  const actionMap: Record<SupportedExportType, BytemdAction> = {
    markdown: {
      title: locale.exportMarkdown,
      icon: '',
      handler: {
        type: 'action',
        click: ({ editor }) => {
          const code = editor.getValue()

          const blob = new Blob([code], { type: 'text/markdown;charset=utf-8' })
          download(`${getFilename()}.md`, blob)
        }
      }
    },
    html: {
      title: locale.exportHtml,
      icon: '',
      handler: {
        type: 'action',
        click: ({ root }) => {
          const html = root.querySelector('.markdown-body')
          if (!html) return

          // get all stylesheets in html
          const styles = Array.from(document.styleSheets)
            .map((sheet) =>
              sheet.href
                ? `<link rel="stylesheet" href="${sheet.href}">`
                : `<style>${
                    sheet.cssRules?.length
                      ? Array.from(sheet.cssRules)
                          .map((rule) => rule.cssText)
                          .join('')
                      : ''
                  }</style>`
            )
            .join('')

          // generate outer wrapper
          const wrapper = document.createElement('div')
          wrapper.className = 'markdown-body'
          wrapper.style.maxWidth = '800px'
          wrapper.style.margin = '0 auto'
          wrapper.style.padding = '16px 4%'
          wrapper.innerHTML = html.innerHTML

          // append stylesheets & html to new html
          const data = `<!DOCTYPE html><html><head>${styles}</head><body>${wrapper.outerHTML}</body></html>`

          const blob = new Blob([data], { type: 'text/html;charset=utf-8' })
          download(`${getFilename()}.html`, blob)
        }
      }
    },
    pdf: {
      title: locale.exportPdf,
      icon: '',
      handler: {
        type: 'action',
        click: ({ root }) => {
          const html = root.querySelector('.markdown-body')
          if (!html) return

          html2pdf()
            .set({
              margin: 20,
              pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
              filename: `${getFilename()}.pdf`,
              image: { type: 'jpeg', quality: 1 }
            })
            .from(html)
            .save()
        }
      }
    },
    png: {
      title: locale.exportPng,
      icon: '',
      handler: {
        type: 'action',
        click: ({ root }) => {
          const html = root.querySelector('.markdown-body')
          if (!html) return

          html2pdf()
            .from(html)
            .toImg()
            .outputImg('dataurlstring')
            .then((dataURL: string) => b64toBlob(dataURL))
            .then((blob: Blob) => download(`${getFilename()}.png`, blob))
        }
      }
    }
  }

  return {
    actions: [
      {
        title: locale.export,
        icon: EXPORT,
        position: 'right',
        handler: {
          type: 'dropdown',
          actions: Object.keys(actionMap)
            .filter((key) => !options?.ignore?.includes(key as SupportedExportType))
            .map((key) => actionMap[key])
        }
      }
    ]
  }
}
