<template>
  <Editor :value="code" :plugins="plugins" @change="handleCodeChange"></Editor>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Editor } from '@bytemd/vue-next'
import 'bytemd/dist/index.css'

import alignPlugin from '@ziuchen/bytemd-plugin-align'
import zh_Hans from '@ziuchen/bytemd-plugin-align/locales/zh_Hans.json'

const plugins = [
  alignPlugin({
    locale: zh_Hans
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
