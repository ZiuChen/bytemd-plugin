# @ziuchen/bytemd-plugin-align

[![npm](https://img.shields.io/npm/v/@ziuchen/bytemd-plugin-align.svg)](https://www.npmjs.com/package/@ziuchen/bytemd-plugin-align)

ByteMD plugin to support align type

## Usage

```js

import { Editor } from 'bytemd'
import align from '@ziuchen/bytemd-plugin-align'

new Editor({
  target: document.body,
  props: {
    plugins: [
      align(),
      // ... other plugins
    ],
  },
})
```

## License

MIT