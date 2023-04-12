# @ziuchen/bytemd-plugin-image-zoom

[![npm](https://img.shields.io/npm/v/@ziuchen/bytemd-plugin-image-zoom.svg)](https://www.npmjs.com/package/@ziuchen/bytemd-plugin-image-zoom)

ByteMD plugin to support image zoom

## Usage

```js

import { Editor } from 'bytemd'
import imageZoom from '@ziuchen/bytemd-plugin-image-zoom'

new Editor({
  target: document.body,
  props: {
    plugins: [
      imageZoom(),
      // ... other plugins
    ],
  },
})
```

## License

MIT