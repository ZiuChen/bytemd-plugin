# @ziuchen/bytemd-plugin-highlight-theme

[![npm](https://img.shields.io/npm/v/@ziuchen/bytemd-plugin-highlight-theme.svg)](https://www.npmjs.com/package/@ziuchen/bytemd-plugin-highlight-theme)

ByteMD plugin to support custom code highlight theme

## Usage

```js

import { Editor } from 'bytemd'
import highlightTheme from '@ziuchen/bytemd-plugin-highlight-theme'

new Editor({
  target: document.body,
  props: {
    plugins: [
      highlightTheme(),
      // ... other plugins
    ],
  },
})
```

## License

MIT