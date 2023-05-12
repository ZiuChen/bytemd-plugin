# @ziuchen/bytemd-plugin-export

[![npm](https://img.shields.io/npm/v/@ziuchen/bytemd-plugin-export.svg)](https://www.npmjs.com/package/@ziuchen/bytemd-plugin-export)

ByteMD plugin to support export markdown to HTML, PDF, PNG, Word, etc.

## Usage

```js

import { Editor } from 'bytemd'
import export from '@ziuchen/bytemd-plugin-export'

new Editor({
  target: document.body,
  props: {
    plugins: [
      export(),
      // ... other plugins
    ],
  },
})
```

## License

MIT