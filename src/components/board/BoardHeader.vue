<template>
  <header class="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
    <h1 class="text-gray-900 dark:text-gray-100 text-2xl font-bold tracking-tight truncate mr-4">{{ boardTitle || 'Drag&Dropicks' }}</h1>

    <div class="flex items-center gap-4 flex-1 justify-end min-w-0">

      <div class="relative w-full max-w-3xl">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
        <input type="text" placeholder="Поиск задач и досок..." class="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 transition-colors shadow-sm">
      </div>
      <button @click="$emit('add-task')" class="px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-sm hidden sm:block shrink-0">
        Добавить задачу
      </button>
      <div class="relative shrink-0" @mouseenter="isMenuOpen = true" @mouseleave="isMenuOpen = false">
        <button @click="goToProfile" class="p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm" title="Профиль">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
        </button>
        <div v-show="isMenuOpen" class="absolute right-0 top-full pt-2 z-10 w-48">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 overflow-hidden">
            <button @click="goToProfile" class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Открыть профиль</button>
            <button @click="switchAccount" class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Сменить аккаунт</button>
            <button @click="logout" class="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 transition-colors">Выйти из профиля</button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

defineProps({
  boardTitle: {
    type: String,
    default: 'Drag&Dropicks'
  }
})

defineEmits(['add-task'])

const router = useRouter()
const isMenuOpen = ref(false)

// Переход в профиль
const goToProfile = () => {
  isMenuOpen.value = false
  router.push({ name: 'Profile' })
}

const switchAccount = () => {
  isMenuOpen.value = false
  alert('Смена аккаунта...')
}

const logout = () => {
  isMenuOpen.value = false
  alert('Выход из профиля...')
}
</script>
