<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api'

const router = useRouter()

const isLoginMode = ref(true)
const user = ref(null)
const email = ref('')
const password = ref('')
const displayName = ref('')
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
    const response = await api.put('/auth/profile', { displayName: displayName.value });
    alert("Профиль успешно обновлен в базе!");
    user.value = response.data;
  } catch (err) {
    errorMsg.value = "Ошибка: " + (err.response?.data?.message || err.message);
  } finally {
    loading.value = false;
  }
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
    <div class="p-4 bg-white dark:bg-gray-800 shadow-sm flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
      <h1 class="text-xl font-bold text-gray-800 dark:text-gray-200">DragAndDropicks</h1>
      <button @click="goHome" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium transition-colors">
        Вернуться на главную
      </button>
    </div>

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

          <div class="mt-6 text-sm text-gray-500 dark:text-gray-400">
            {{ isLoginMode ? 'Нет аккаунта?' : 'Уже есть аккаунт?' }}
            <button @click="isLoginMode = !isLoginMode; errorMsg = ''" class="text-accent-600 hover:underline hover:text-accent-700">
              {{ isLoginMode ? 'Зарегистрироваться' : 'Войти' }}
            </button>
          </div>
        </div>

        <div v-else class="text-center">
          <div class="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-500 dark:text-gray-400 overflow-hidden shadow-inner">
            <svg v-if="!user.photoURL" class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            <img v-else :src="user.photoURL" alt="Avatar" class="w-full h-full object-cover">
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
