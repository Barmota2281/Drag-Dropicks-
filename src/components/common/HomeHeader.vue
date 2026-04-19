<template>
  <header class="w-full bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 shrink-0">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div class="flex-shrink-0 flex items-center">
        <span class="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Drag<span class="text-blue-500">&</span>Dropicks
        </span>
      </div>
      <nav class="flex items-center gap-4">
        <button @click="$emit('go-to-board')" class="px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-sm">
          Открыть доску
        </button>
        <div class="relative" @mouseenter="isMenuOpen = true" @mouseleave="isMenuOpen = false">
          <button @click="openProfile" class="p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm" title="Профиль">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          </button>
          <div v-show="isMenuOpen" class="absolute right-0 top-full pt-2 z-10 w-48">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 overflow-hidden">
              <button @click="openProfile" class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Открыть профиль</button>
              <button @click="switchAccount" class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Сменить аккаунт</button>
              <button @click="logout" class="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 transition-colors">Выйти из профиля</button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['go-to-board', 'go-to-profile'])

const isMenuOpen = ref(false)

const openProfile = () => {
  isMenuOpen.value = false
  emit('go-to-profile')
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
