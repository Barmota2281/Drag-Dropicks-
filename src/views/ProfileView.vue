<script setup>
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 flex flex-col items-center justify-center">
    <div class="max-w-xl w-full bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 text-center">
      <div class="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-500 dark:text-gray-400">
        <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
      </div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Профиль пользователя</h1>
      <p class="text-gray-600 dark:text-gray-400 mb-8">Здесь скоро появятся настройки вашего профиля.</p>

      <router-link to="/" class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm">
        Вернуться на главную
      </router-link>
    </div>
  </div>
</template>
