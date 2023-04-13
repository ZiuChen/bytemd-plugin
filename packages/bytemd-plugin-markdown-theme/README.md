# @ziuchen/bytemd-plugin-markdown-theme

[![npm](https://img.shields.io/npm/v/@ziuchen/bytemd-plugin-markdown-theme.svg)](https://www.npmjs.com/package/@ziuchen/bytemd-plugin-markdown-theme)

ByteMD plugin to support custom code markdown theme

## Usage

```js

import { Editor } from 'bytemd'
import markdownThemePlugin from '@ziuchen/bytemd-plugin-markdown-theme'
import themes from '@ziuchen/bytemd-plugin-markdown-theme/dist/themes.json'

new Editor({
  target: document.body,
  props: {
    plugins: [
      markdownThemePlugin({
        themes: themes,
      }),
      // ... other plugins
    ],
  },
})
```

## License

MIT