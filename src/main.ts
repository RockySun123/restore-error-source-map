import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import ErrorStackParser from 'error-stack-parser'
import { findCodeBySourceMap } from '@/utils'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.config.errorHandler = (err) => {
  const errorStack = ErrorStackParser.parse(err as Error)
  console.log('srack', errorStack[0])
  findCodeBySourceMap(errorStack[0])
}

app.mount('#app')


