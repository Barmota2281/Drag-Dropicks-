<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api'
import HomeHeader from "@/components/common/HomeHeader.vue";

const router = useRouter()

const isLoginMode = ref(true)
const user = ref(null)
const email = ref('')
const password = ref('')
const displayName = ref('')
const avatarUrl = ref('')
const phoneNumber = ref('')
const errorMsg = ref('')
const loading = ref(false)

const loadUserProfile = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    user.value = null;
    return;
  }

  try {
    // Получаем профиль от бэкенда
    const response = await api.get('/auth/me');
    user.value = response.data;
    if (user.value) {
      email.value = user.value.email;
      displayName.value = user.value.displayName || '';
      avatarUrl.value = user.value.avatarUrl || '';
      phoneNumber.value = user.value.phoneNumber || '';
    }
  } catch (e) {
    console.error('Ошибка загрузки профиля', e);
    // Если токен невалиден
    if (e.response?.status === 401 || e.response?.status === 403) {
      handleLogout();
    }
  }
}

onMounted(() => {
  loadUserProfile();
})

const handleAuth = async () => {
  if (!email.value || !password.value) {
    errorMsg.value = "Заполните все поля";
    return;
  }
  loading.value = true;
  errorMsg.value = '';
  try {
    if (isLoginMode.value) {
      // ФУНКЦИЯ ВХОДА (ЧЕРЕЗ БЭКЕНД)
      const response = await api.post('/auth/login', {
        email: email.value,
        password: password.value
      });
      localStorage.setItem("token", response.data.token);
      await loadUserProfile();

    } else {
      // ФУНКЦИЯ РЕГИСТРАЦИИ (ЧЕРЕЗ БЭКЕНД)
      const response = await api.post('/auth/register', {
        email: email.value,
        password: password.value,
        displayName: displayName.value
      });
      localStorage.setItem("token", response.data.token);
      alert("Успешная регистрация!");
      await loadUserProfile();
    }
  } catch (err) {
    errorMsg.value = "Ошибка: " + (err.response?.data?.message || err.message);
  } finally {
    loading.value = false;
  }
}

const handleUpdateProfile = async () => {
  if (!user.value) return;
  loading.value = true;
  errorMsg.value = '';
  try {
    const response = await api.put('/auth/me', {
      displayName: displayName.value,
      avatarUrl: avatarUrl.value,
      phoneNumber: phoneNumber.value
    });
    alert("Профиль успешно обновлен!");
    user.value = response.data;
  } catch (err) {
    errorMsg.value = "Ошибка: " + (err.response?.data?.message || err.message);
  } finally {
    loading.value = false;
  }
}

const handleGoogleAuth = () => {
  window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/oauth2/authorization/google`;
}

const handleLogout = () => {
  localStorage.removeItem('token');
  user.value = null;
  email.value = '';
  password.value = '';
  displayName.value = '';
  router.push('/');
}

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-300">
  <HomeHeader @go-home="goHome" />

    <div class="flex-1 flex flex-col items-center justify-center p-8">
      <div class="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">

        <div v-if="!user" class="text-center">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            {{ isLoginMode ? 'Вход в аккаунт' : 'Регистрация' }}
          </h2>

          <div v-if="errorMsg" class="mb-4 bg-red-100 p-3 rounded text-red-700 text-sm">
            {{ errorMsg }}
          </div>

          <form @submit.prevent="handleAuth" class="space-y-4">
            <div v-if="!isLoginMode" class="text-left">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Имя пользователя</label>
              <input v-model="displayName" type="text" class="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors">
            </div>

            <div class="text-left">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input v-model="email" type="email" required class="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors">
            </div>

            <div class="text-left">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Пароль</label>
              <input v-model="password" type="password" required class="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors">
            </div>

            <button :disabled="loading" type="submit" class="w-full py-3 bg-accent-600 hover:bg-accent-700 text-white font-medium rounded-lg transition-colors shadow-sm mt-6">
              {{ loading ? 'Загрузка...' : (isLoginMode ? 'Войти' : 'Создать аккаунт') }}
            </button>
          </form>

          <div class="mt-4">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white dark:bg-gray-800 text-gray-500">Или войти через</span>
              </div>
            </div>
            <div class="mt-4">
              <button @click="handleGoogleAuth" type="button" class="w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 transition-colors">
                <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </button>
            </div>
          </div>

          <div class="mt-6 text-sm text-gray-500 dark:text-gray-400">
            {{ isLoginMode ? 'Нет аккаунта?' : 'Уже есть аккаунт?' }}
            <button @click="isLoginMode = !isLoginMode; errorMsg = ''" class="text-accent-600 hover:underline hover:text-accent-700">
              {{ isLoginMode ? 'Зарегистрироваться' : 'Войти' }}
            </button>
          </div>
        </div>

        <div v-else class="text-center">
          <div class="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-500 dark:text-gray-400 overflow-hidden shadow-inner">
            <svg v-if="!user.avatarUrl" class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            <img v-else :src="user.avatarUrl" alt="Avatar" class="w-full h-full object-cover">
          </div>

          <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Профиль</h2>
          <p class="text-gray-500 dark:text-gray-400 mb-6">{{ user.email }}</p>

          <div v-if="errorMsg" class="mb-4 bg-red-100 p-3 rounded text-red-700 text-sm">
            {{ errorMsg }}
          </div>

          <form @submit.prevent="handleUpdateProfile" class="space-y-4 mb-6">
            <div class="text-left">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Отображаемое имя</label>
              <input v-model="displayName" type="text" class="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors shadow-sm">
            </div>

            <div class="text-left">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL Аватарки</label>
              <input v-model="avatarUrl" type="url" placeholder="https://..." class="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors shadow-sm">
            </div>

            <div class="text-left">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Номер телефона</label>
              <input v-model="phoneNumber" type="tel" placeholder="+7 (999) 000-00-00" class="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors shadow-sm">
            </div>

            <button :disabled="loading" type="submit" class="w-full py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors">
              {{ loading ? 'Сохранение...' : 'Сохранить изменения' }}
            </button>
          </form>

          <hr class="border-gray-200 dark:border-gray-700 mb-6">

          <button @click="handleLogout" class="px-6 py-2 w-full text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/30 font-medium rounded-lg transition-colors">
            Выйти из аккаунта
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
