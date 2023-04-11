<template>
  <Editor :value="code" :plugins="plugins" @change="handleCodeChange"></Editor>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Editor } from '@bytemd/vue-next'
import 'bytemd/dist/index.css'
import 'highlight.js/styles/default.css'

import frontmatterPlugin from '@bytemd/plugin-frontmatter'
import highlightPlugin from '@bytemd/plugin-highlight'

import alignPlugin from '@ziuchen/bytemd-plugin-align'
import zh1 from '@ziuchen/bytemd-plugin-align/locales/zh_Hans.json'

import highlightThemePlugin from '@ziuchen/bytemd-plugin-highlight-theme'
import zh2 from '@ziuchen/bytemd-plugin-highlight-theme/locales/zh_Hans.json'

const plugins = [
  frontmatterPlugin(),
  highlightPlugin(),
  alignPlugin({
    locale: zh1
  }),
  highlightThemePlugin({
    locale: zh2,
    defaultHighlight: 'github'
  })
]
const code = ref('# Hello, Bytemd!\n')

function handleCodeChange(value: string) {
  code.value = value
}
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
}

.bytemd {
  height: calc(100vh);
}
</style>
