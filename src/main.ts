import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import 'element-plus/dist/index.css'
import { ElMessage } from 'element-plus'

import ErrorStackParser from 'error-stack-parser'
// import { findCodeBySourceMap } from '@/utils'

const app = createApp(App)

app.use(createPinia())
app.use(router)


// app.config.errorHandler = (err) => {
//   const errorStack = ErrorStackParser.parse(err as Error)
//   console.log('srack', errorStack[0])
//   findCodeBySourceMap(errorStack[0])
// }

app.config.errorHandler = (err: any, vm) => {
  const errorStack = ErrorStackParser.parse(err as Error)
  //构建错误调用栈
  const jsError = {
    stack_frames: errorStack,
    message: err.message,
    stack: err.stack,
    error_name: err.name
  }
  ElMessage.error(`您触发了一个 ${err.name} 错误`)

  //将错误存储在本地
  localStorage.setItem('jsErrorList', JSON.stringify(jsError))
}

app.mount('#app')


