import type { BytemdPlugin } from 'bytemd'
import en from '../locales/en.json'
import { ALIGN_LEFT, ALIGN_CENTER, ALIGN_RIGHT } from './icons'

export interface AlignPluginOptions {
  locale?: Record<string, string>
}

/**
 * Align Type Plugin
 */
export default function alignPlugin(options?: AlignPluginOptions): BytemdPlugin {
  const locale = { ...en, ...options?.locale } as typeof en

  return {
    actions: [
      {
        title: locale.alignType,
        icon: ALIGN_CENTER,
        handler: {
          type: 'dropdown',
          actions: [
            {
              title: locale.alignTypeLeft,
              icon: ALIGN_LEFT,
              handler: {
                type: 'action',
                click: (ctx) => {
                  ctx.wrapText('<p align="left">', '</p>')
                  ctx.editor.focus()
                }
              }
            },
            {
              title: locale.alignTypeCenter,
              icon: ALIGN_CENTER,
              handler: {
                type: 'action',
                click: (ctx) => {
                  ctx.wrapText('<p align="center">', '</p>')
                  ctx.editor.focus()
                }
              }
            },
            {
              title: locale.alignTypeRight,
              icon: ALIGN_RIGHT,
              handler: {
                type: 'action',
                click: (ctx) => {
                  ctx.wrapText('<p align="right">', '</p>')
                  ctx.editor.focus()
                }
              }
            }
          ]
        }
      }
    ]
  }
}
