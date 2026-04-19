<template>
  <header class="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
    <h1 class="text-gray-900 dark:text-gray-100 text-2xl font-bold tracking-tight">{{ boardTitle || 'Drag&Dropicks' }}</h1>

    <div class="flex items-center gap-4">
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
        <input type="text" placeholder="Поиск задач и досок..." class="w-64 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 transition-colors shadow-sm">
      </div>
      <button @click="goToProfile" class="p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm" title="Профиль">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
      </button>
    </div>
  </header>
</template>

<script setup>
defineProps({
  boardTitle: {
    type: String,
    default: 'Drag&Dropicks'
  }
})

// Переход в профиль (в будущем подключим vue-router, если нужно)
const goToProfile = () => {
  alert('Переход на страницу профиля...')
}
</script>

