<template>
  <main v-if="isError">
    <pre>{{ js_error.stack }}</pre>

    <el-collapse v-model="activeName" accordion>
      <el-collapse-item
        v-for="(item, index) in js_error.stack_frames"
        :key="item.source + index"
        :title="item.source"
      >
        <el-row :gutter="24">
          <el-col :span="20">{{ item.fileName }}</el-col>
          <el-col :span="4">
            <el-button type="primary" size="small" @click="openDialog(item, index)">
              映射源码
            </el-button>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <template v-if="item.origin">
            <!-- {{ item.origin }} -->
            <PreView :origin="item.origin"></PreView>
          </template>
          <template v-else>
            {{ item.fileName }}
          </template>
        </el-row>
      </el-collapse-item>
    </el-collapse>
  </main>
  <el-dialog
    v-model="dialogVisible"
    title="sourceMap源码映射"
    width="500"
    :before-close="handleClose"
  >
    <el-tabs v-model="tabActiveName" class="demo-tabs">
      <el-tab-pane label="本地上传" name="local">
        <el-upload drag :before-upload="sourceMapUpload">
          <i class="el-icon-upload"></i>
          <div>将文件拖到此处，或者<em>点击上传</em></div>
        </el-upload>
      </el-tab-pane>
      <el-tab-pane label="远程加载" name="request">远程加载</el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'
import sourceMap from 'source-map-js'
import PreView from './PreView.vue'

// 错误信息列表
let js_error = ref<any>(null)
// 是否有错误信息
let isError = ref<boolean>(false)

const activeName = ref<string>('1')
const tabActiveName = ref<string>('local')
const dialogVisible = ref<boolean>(false)
let stackFrameObj = {
  line: 0,
  column: 0,
  index: 0,
}

const openDialog = (item: any, index: number) => {
  dialogVisible.value = true

  stackFrameObj = {
    line: item.lineNumber,
    column: item.columnNumber,
    index: index,
  }
}
const handleClose = (done: () => void) => {
  dialogVisible.value = false
}

const sourceMapUpload = (file: File) => {
  // 这里解析可能会有问题本地，线上环境可以，因为这里有上传的动作

  if (!file.name.endsWith('.map')) {
    ElMessage.error('请上传正确的sourceMap文件')
    return
  }
  const reader = new FileReader()
  reader.onload = async function (evt) {
    const code = await getSource(evt.target?.result, stackFrameObj.line, stackFrameObj.column)

    if (code) {
      console.log(code)

      js_error.value.stack_frames[stackFrameObj.index].origin = code
    }
    dialogVisible.value = false
  }

  reader.readAsText(file, 'UTF-8')

  return false //阻止自动上传（因为我们手动处理了文件读取逻辑
}

const getSource = async (sourcemap: any, line: number, column: number) => {
  try {
    const consumer = new sourceMap.SourceMapConsumer(JSON.parse(sourcemap))
    const originalPosition = consumer.originalPositionFor({
      line,
      column,
    })
    const source = consumer.sourceContentFor(originalPosition.source)
    return {
      source,
      column: originalPosition.column,
      line: originalPosition.line,
    }
  } catch (e) {
    console.log(e)

    ElMessage.error('sourceMap解析失败')
  }
}

onMounted(() => {
  //获取之前本地存储的错误数据
  try {
    let jsErrorList = localStorage.getItem('jsErrorList')
    if (jsErrorList) {
      js_error.value = JSON.parse(jsErrorList)
      isError.value = true
      console.log(js_error)
    }
  } catch (e) {}
})
</script>
