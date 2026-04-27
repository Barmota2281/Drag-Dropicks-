<template>
  <footer class="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row justify-between items-center gap-4">
        <!-- Logo/Title -->
        <div class="flex items-center gap-2">
          <svg class="w-6 h-6 text-accent-600 dark:text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          <span class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent-600 to-indigo-600 dark:from-accent-400 dark:to-indigo-400">
            Drag&Dropicks
          </span>
        </div>

        <!-- Navigation Links -->
        <nav class="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium text-gray-500 dark:text-gray-400">
          <router-link to="/" class="hover:text-accent-600 dark:hover:text-accent-400 transition-colors">Главная</router-link>
          <router-link to="/board" class="hover:text-accent-600 dark:hover:text-accent-400 transition-colors">Доски</router-link>
          <router-link to="/profile" class="hover:text-accent-600 dark:hover:text-accent-400 transition-colors">Профиль</router-link>
          <router-link to="/settings" class="hover:text-accent-600 dark:hover:text-accent-400 transition-colors">Настройки</router-link>
        </nav>

        <!-- Copyright -->
        <div class="text-sm text-gray-400 dark:text-gray-500">
          &copy; {{ new Date().getFullYear() }} Drag&Dropicks. Все права защищены.
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>

