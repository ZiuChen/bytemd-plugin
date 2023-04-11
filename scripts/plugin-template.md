# @ziuchen/bytemd-plugin-{{name}}

[![npm](https://img.shields.io/npm/v/@ziuchen/bytemd-plugin-{{name}}.svg)](https://www.npmjs.com/package/@ziuchen/bytemd-plugin-{{name}})

{{{desc}}}

## Usage

```js
{{{header}}}
import { Editor } from 'bytemd'
import {{importedName}} from '@ziuchen/bytemd-plugin-{{name}}'

new Editor({
  target: document.body,
  props: {
    plugins: [
      {{importedName}}(),
      // ... other plugins
    ],
  },
})
```

{{#options}}### Options

{{{options}}}
{{/options}}
{{#example}}## Example

{{{example}}}
{{/example}}
## License

MIT