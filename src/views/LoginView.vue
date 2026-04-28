<template>
  <div class="flex-1 bg-gray-50 dark:bg-gray-900 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
    <div class="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 transition-colors duration-300">
      <div class="text-center mb-8">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white transition-colors">Вход в аккаунт</h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">С возвращением в Drag-Dropicks</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">Email</label>
          <input
            v-model="email"
            type="email"
            required
            placeholder="Введите email"
            class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all duration-300"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">Пароль</label>
          <input
            v-model="password"
            type="password"
            required
            placeholder="Введите пароль"
            class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all duration-300"
          />
        </div>

        <div class="pt-2">
          <button type="submit" class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 dark:focus:ring-offset-gray-900 transition-all duration-300">
            Войти
          </button>
        </div>

        <div class="text-center mt-4">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Нет аккаунта?
            <router-link to="/register" class="font-medium text-accent-600 hover:text-accent-500 transition-colors">Зарегистрироваться</router-link>
          </p>
        </div>

        <div v-if="error" class="p-3 mt-4 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 rounded-lg text-center">
          {{ error }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '../services/auth.service';

const email = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();

const handleLogin = async () => {
  error.value = '';
  try {
    await authService.login(email.value, password.value);
    router.push('/board');
  } catch (err) {
    error.value = 'Ошибка входа. Проверьте почту и пароль.';
    console.error(err);
  }
};
</script>

<style scoped>
</style>
