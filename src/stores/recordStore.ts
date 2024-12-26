import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { eventWithTime } from '@rrweb/types'

export const useRecordStore = defineStore('record', () => {
  const events = ref<eventWithTime[]>([]);

  const setEvents = (recordEvents: eventWithTime[]) => {
    events.value = recordEvents;
  }

  const getEvents = () => {
    return events.value;
  }
  return { setEvents, getEvents }
})
