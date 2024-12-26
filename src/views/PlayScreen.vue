<template>
  <div class="play">
    <el-button type="primary" @click="handlePlay">回放</el-button>
    <hr />
    <div id="doPlay"></div>
  </div>
</template>
<script setup lang="ts">
import rrwebPlayer from 'rrweb-player'
//引入样式
import 'rrweb-player/dist/style.css'

import { useRecordStore } from '@/stores/recordStore'

const recordStore = useRecordStore()
const handlePlay = () => {
  const events = recordStore.getEvents()
  console.log(events)
  if (events.length === 0) return

  //rrweb 播发
  new rrwebPlayer({
    target: document.getElementById('doPlay')!,
    props: {
      events, // 播放的事件
    },
  })
}
</script>
