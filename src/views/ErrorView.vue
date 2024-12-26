<template>
  <div class="about">
    <p @click="triggerTypeError">触发 TypeError</p>
    <el-divider></el-divider>
    <p @click="triggerReferenceError">触发ReferenceError</p>
    <el-divider> </el-divider>
    <p @click="triggerSyntaxError">触发SyntaxError</p>
  </div>
</template>
<script lang="ts" setup>
const triggerTypeError = () => {
  if (typeError.length > 0) {
    console.log('error!')
  }
}
const triggerReferenceError = () => {
  throw new ReferenceError('Hello')
}

const triggerSyntaxError = () => {
  throw new SyntaxError('Hello')
}
</script>
