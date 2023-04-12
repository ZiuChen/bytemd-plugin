<template>
  <Editor :value="code" :plugins="plugins" @change="handleCodeChange"></Editor>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Editor } from '@bytemd/vue-next'
import article from './article.md?raw'
import 'bytemd/dist/index.css'

import frontmatterPlugin from '@bytemd/plugin-frontmatter'
import highlightPlugin from '@bytemd/plugin-highlight'
import alignPlugin from '@/bytemd-plugin-align/src'
import highlightThemePlugin from '@/bytemd-plugin-highlight-theme/src'

const plugins = [
  frontmatterPlugin(),
  highlightPlugin(),
  alignPlugin(),
  highlightThemePlugin({
    defaultHighlight: 'github'
  })
]
const code = ref(article)

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
