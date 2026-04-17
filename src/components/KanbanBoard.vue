<template>
  <div class="flex flex-col items-center min-h-screen p-5 bg-[#2b1f1a] font-sans">
    <h1 class="text-[#c7d297] mb-7 text-4xl tracking-wide">Drag&Dropicks</h1>
    <div class="flex gap-6 overflow-x-auto items-start pb-5 w-full max-w-6xl">
      <div v-for="column in columns" :key="column.id" class="flex-none w-80 bg-[#3e2e25] rounded-xl p-4 shadow-md border-t-4 border-[#6b8e23]">
        <h3 class="text-[#a3b86c] mt-0 mb-4 text-xl font-semibold">{{ column.title }}</h3>

        <draggable
          v-model="column.tasks"
          group="tasks"
          item-key="id"
          class="min-h-[150px] flex flex-col gap-3"
          ghost-class="opacity-50 bg-[#c7d297] border-2 border-dashed border-[#6b8e23]"
        >
          <template #item="{element}">
            <div class="bg-[#f7f3e8] text-[#2b1f1a] p-4 rounded-lg shadow cursor-grab font-medium transition-all duration-200 hover:-translate-y-0.5 active:cursor-grabbing">
              {{ element.title }}
            </div>
          </template>
        </draggable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import draggable from 'vuedraggable'

const columns = ref([
  {
    id: '1',
    title: 'К выполнению',
    tasks: [
      { id: 't1', title: 'Создать дизайн доски' },
      { id: 't4', title: 'Настроить WebSockets' }
    ]
  },
  {
    id: '2',
    title: 'В процессе',
    tasks: [
      { id: 't2', title: 'Написать базовый код' }
    ]
  },
  {
    id: '3',
    title: 'Готово',
    tasks: [
      { id: 't3', title: 'Установить Vue.js' }
    ]
  }
])
</script>

<style scoped>
/* Tailwind is used instead of traditional CSS */
</style>
