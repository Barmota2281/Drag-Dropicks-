<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchAllBoards } from '../services/board.service.js'

const router = useRouter()
const boards = ref([])
const currentDate = ref(new Date())

const loadTasks = async () => {
  try {
    boards.value = await fetchAllBoards()
  } catch (error) {
    console.error('Ошибка при загрузке задач:', error)
  }
}

onMounted(() => {
  loadTasks()
})

const daysInMonth = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const date = new Date(year, month, 1)
  const days = []
  while (date.getMonth() === month) {
    days.push(new Date(date))
    date.setDate(date.getDate() + 1)
  }
  return days
})

const monthName = computed(() => {
  return currentDate.value.toLocaleString('ru-RU', { month: 'long', year: 'numeric' })
})

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.setMonth(currentDate.value.getMonth() + 1))
}

const prevMonth = () => {
  currentDate.value = new Date(currentDate.value.setMonth(currentDate.value.getMonth() - 1))
}

const getTasksForDate = (date) => {
  const dateString = date.toISOString().split('T')[0]
  const tasksForDay = []

  boards.value.forEach(board => {
    board.columns?.forEach(column => {
      column.tasks?.forEach(task => {
        if (task.deadline === dateString) {
          tasksForDay.push({ ...task, boardId: board.id, boardName: board.title, columnId: column.id, columnName: column.title })
        }
      })
    })
  })

  return tasksForDay
}

const goBack = () => {
  router.push('/board')
}
</script>

<template>
  <div class="h-screen w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col p-4 md:p-8 overflow-hidden">
    <div class="flex items-center justify-between mb-6 shrink-0">
      <div class="flex items-center gap-4">
        <button @click="goBack" class="p-2 rounded-lg text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        </button>
        <h1 class="text-2xl font-bold">Календарь дедлайнов</h1>
      </div>

      <div class="flex items-center gap-4">
        <button @click="prevMonth" class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <span class="text-lg font-medium capitalize min-w-[150px] text-center">{{ monthName }}</span>
        <button @click="nextMonth" class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>

    <!-- Calendar Grid -->
    <div class="flex-1 overflow-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
      <div class="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 sticky top-0 z-10">
        <div v-for="day in ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']" :key="day" class="p-3 text-center text-sm font-semibold text-gray-500">
          {{ day }}
        </div>
      </div>

      <div class="grid grid-cols-7 auto-rows-fr h-full min-h-[600px]">
        <!-- Empty cells for padding start of month -->
        <div v-for="blank in daysInMonth[0].getDay()" :key="'blank-'+blank" class="border-b border-r border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20"></div>

        <div v-for="date in daysInMonth" :key="date.toISOString()" class="border-b border-r border-gray-200 dark:border-gray-700 p-2 overflow-hidden flex flex-col hover:bg-gray-50 dark:hover:bg-gray-700/30 transition"
             :class="{ 'bg-accent-50/30 dark:bg-accent-900/10': date.toISOString().split('T')[0] === new Date().toISOString().split('T')[0] }">
          <div class="text-right mb-1 shrink-0 flex justify-end">
            <span class="text-xs font-medium flex items-center justify-center w-6 h-6 rounded-full"
                  :class="date.toISOString().split('T')[0] === new Date().toISOString().split('T')[0] ? 'bg-accent-500 text-white shadow-sm' : 'text-gray-400'">
              {{ date.getDate() }}
            </span>
          </div>
          <div class="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
            <div v-for="task in getTasksForDate(date)" :key="task.id"
                 class="px-2 py-1 text-xs rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm cursor-pointer hover:border-accent-500 dark:hover:border-accent-400 transition"
                 @click="goBack"
                 :title="task.boardName + ' → ' + task.columnName">
              <span class="truncate block font-medium" v-html="task.content?.replace(/<[^>]*>?/gm, '') || 'Без названия'"></span>
              <span class="text-[10px] text-gray-400 truncate block">{{ task.boardName }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #475569; }
</style>
