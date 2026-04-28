<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
    <div class="max-w-4xl mx-auto py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div class="flex i  tems-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        <button @click="router.back()" class="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors -ml-2 sm:ml-0">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </button>
        <h1 class="text-2xl sm:text-3xl font-bold">Настройки</h1>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl shadow sm:p-6 p-4 border border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-semibold mb-5">Внешний вид</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <div>
            <h3 class="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">Тема оформления</h3>
            <div class="flex flex-col gap-4">
              <label class="flex items-center gap-3 cursor-pointer group">
                <input type="radio" value="light" v-model="theme" @change="updateTheme" class="w-4 h-4 text-accent-600 bg-gray-100 border-gray-300 focus:ring-accent-500 dark:focus:ring-accent-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 transition-all">
                <span class="text-sm font-medium group-hover:text-accent-500 transition-colors">Светлая тема</span>
              </label>
              <label class="flex items-center gap-3 cursor-pointer group">
                <input type="radio" value="dark" v-model="theme" @change="updateTheme" class="w-4 h-4 text-accent-600 bg-gray-100 border-gray-300 focus:ring-accent-500 dark:focus:ring-accent-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 transition-all">
                <span class="text-sm font-medium group-hover:text-accent-500 transition-colors">Темная тема</span>
              </label>
              <label class="flex items-center gap-3 cursor-pointer group">
                <input type="radio" value="system" v-model="theme" @change="updateTheme" class="w-4 h-4 text-accent-600 bg-gray-100 border-gray-300 focus:ring-accent-500 dark:focus:ring-accent-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 transition-all">
                <span class="text-sm font-medium group-hover:text-accent-500 transition-colors">Как в системе</span>
              </label>
            </div>
          </div>

          <div>
            <h3 class="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">Акцентный цвет</h3>
            <div class="flex gap-3 flex-wrap">
              <label class="cursor-pointer" title="Синий (стандартный)">
                <input type="radio" value="blue" v-model="colorScheme" @change="updateColorScheme" class="peer sr-only">
                <div class="w-8 h-8 rounded-full bg-accent-500 ring-2 ring-offset-2 ring-transparent peer-checked:ring-accent-500 transition-all dark:ring-offset-gray-800"></div>
              </label>
              <label class="cursor-pointer" title="Красный">
                <input type="radio" value="red" v-model="colorScheme" @change="updateColorScheme" class="peer sr-only">
                <div class="w-8 h-8 rounded-full bg-red-500 ring-2 ring-offset-2 ring-transparent peer-checked:ring-red-500 transition-all dark:ring-offset-gray-800"></div>
              </label>
              <label class="cursor-pointer" title="Зеленый">
                <input type="radio" value="green" v-model="colorScheme" @change="updateColorScheme" class="peer sr-only">
                <div class="w-8 h-8 rounded-full bg-green-500 ring-2 ring-offset-2 ring-transparent peer-checked:ring-green-500 transition-all dark:ring-offset-gray-800"></div>
              </label>
              <label class="cursor-pointer" title="Фиолетовый">
                <input type="radio" value="purple" v-model="colorScheme" @change="updateColorScheme" class="peer sr-only">
                <div class="w-8 h-8 rounded-full bg-purple-500 ring-2 ring-offset-2 ring-transparent peer-checked:ring-purple-500 transition-all dark:ring-offset-gray-800"></div>
              </label>
              <label class="cursor-pointer" title="Изумрудный (Emerald)">
                <input type="radio" value="emerald" v-model="colorScheme" @change="updateColorScheme" class="peer sr-only">
                <div class="w-8 h-8 rounded-full bg-emerald-500 ring-2 ring-offset-2 ring-transparent peer-checked:ring-emerald-500 transition-all dark:ring-offset-gray-800"></div>
              </label>
              <label class="cursor-pointer" title="Янтарный (Amber)">
                <input type="radio" value="amber" v-model="colorScheme" @change="updateColorScheme" class="peer sr-only">
                <div class="w-8 h-8 rounded-full bg-amber-500 ring-2 ring-offset-2 ring-transparent peer-checked:ring-amber-500 transition-all dark:ring-offset-gray-800"></div>
              </label>
              <label class="cursor-pointer" title="Розовый (Pink)">
                <input type="radio" value="pink" v-model="colorScheme" @change="updateColorScheme" class="peer sr-only">
                <div class="w-8 h-8 rounded-full bg-pink-500 ring-2 ring-offset-2 ring-transparent peer-checked:ring-pink-500 transition-all dark:ring-offset-gray-800"></div>
              </label>
              <label class="cursor-pointer" title="Голубой (Cyan)">
                <input type="radio" value="cyan" v-model="colorScheme" @change="updateColorScheme" class="peer sr-only">
                <div class="w-8 h-8 rounded-full bg-cyan-500 ring-2 ring-offset-2 ring-transparent peer-checked:ring-cyan-500 transition-all dark:ring-offset-gray-800"></div>
              </label>
                <label class="cursor-pointer" title="Индиго (Indigo)">
                <input type="radio" value="indigo" v-model="colorScheme" @change="updateColorScheme" class="peer sr-only">
                <div class="w-8 h-8 rounded-full bg-indigo-500 ring-2 ring-offset-2 ring-transparent peer-checked:ring-indigo-500 transition-all dark:ring-offset-gray-800" style="background-color: #6366f1;"></div>
              </label>
              <label class="cursor-pointer" title="Фуксия (Fuchsia)">
                <input type="radio" value="fuchsia" v-model="colorScheme" @change="updateColorScheme" class="peer sr-only">
                <div class="w-8 h-8 rounded-full bg-fuchsia-500 ring-2 ring-offset-2 ring-transparent peer-checked:ring-fuchsia-500 transition-all dark:ring-offset-gray-800" style="background-color: #d946ef;"></div>
              </label>
              <label class="cursor-pointer" title="Ярко-розовый (Rose)">
                <input type="radio" value="rose" v-model="colorScheme" @change="updateColorScheme" class="peer sr-only">
                <div class="w-8 h-8 rounded-full bg-rose-500 ring-2 ring-offset-2 ring-transparent peer-checked:ring-rose-500 transition-all dark:ring-offset-gray-800" style="background-color: #f43f5e;"></div>
              </label>
              <label class="cursor-pointer" title="Лаймовый (Lime)">
                <input type="radio" value="lime" v-model="colorScheme" @change="updateColorScheme" class="peer sr-only">
                <div class="w-8 h-8 rounded-full bg-lime-500 ring-2 ring-offset-2 ring-transparent peer-checked:ring-lime-500 transition-all dark:ring-offset-gray-800" style="background-color: #84cc16;"></div>
              </label>
            </div>

            <div class="mt-6 p-4 rounded-xl bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800 transition-colors duration-500">
              <h4 class="text-sm font-semibold text-accent-700 dark:text-accent-300 mb-2">Предпросмотр акцента</h4>
              <div class="flex items-center gap-3">
                <button class="px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
                  Пример кнопки
                </button>
                <span class="text-sm text-accent-600 dark:text-accent-400 font-medium cursor-pointer hover:underline">
                  Пример ссылки
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- Управление аккаунтом и безопасность -->
      <div class="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow sm:p-6 p-4 border border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-semibold mb-5 flex items-center gap-2">
          <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
          Управление аккаунтом и безопасность
        </h2>

        <div class="space-y-6">
          <!-- Смена пароля -->
          <div class="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 class="text-md font-medium text-gray-800 dark:text-gray-200 mb-2">Изменение пароля</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">Рекомендуется использовать надежный пароль, который вы не используете на других сайтах.</p>
            <button @click="showPasswordModal = true" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition">
              Сменить пароль
            </button>
          </div>

          <!-- Привязка аккаунтов -->
          <div class="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 class="text-md font-medium text-gray-800 dark:text-gray-200 mb-2">Связанные аккаунты</h3>
            <div class="flex items-center justify-between py-2">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-500">
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                  </svg>
                </div>
                <div>
                  <div class="text-sm font-medium">Google</div>
                  <div class="text-xs text-gray-500">Не подключен</div>
                </div>
              </div>
              <button class="text-accent-600 dark:text-accent-400 text-sm font-medium hover:underline">Подключить</button>
            </div>
          </div>

          <!-- Сессии -->
          <div class="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 class="text-md font-medium text-gray-800 dark:text-gray-200 mb-2">Активные сессии</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">Выйти со всех остальных устройств, кроме текущего.</p>
            <button class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition">
              Завершить другие сессии
            </button>
          </div>

          <!-- Удаление аккаунта -->
          <div>
            <h3 class="text-md font-medium text-red-600 mb-2">Удаление аккаунта</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">Навсегда удалить аккаунт и все связанные с ним данные досок, задач и комментариев. Это действие необратимо.</p>
            <button @click="confirmDeleteAccount" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition">
              Удалить аккаунт
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const theme = ref('system')
const colorScheme = ref('blue')

const showPasswordModal = ref(false)

const confirmDeleteAccount = () => {
  if (confirm('Вы уверены, что хотите навсегда удалить свой аккаунт? Это действие отменить нельзя.')) {
     alert('Функция удаления аккаунта требует подтверждения через API.')
  }
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    theme.value = savedTheme
  } else {
    theme.value = 'system'
  }

  const savedColor = localStorage.getItem('colorScheme')
  if (savedColor) {
    colorScheme.value = savedColor
    updateColorScheme()
  }
})

const updateTheme = () => {
  if (theme.value === 'dark') {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else if (theme.value === 'light') {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  } else {
    localStorage.removeItem('theme')
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
}

const updateColorScheme = () => {
  document.documentElement.setAttribute('data-theme', colorScheme.value)
  localStorage.setItem('colorScheme', colorScheme.value)
}
</script>
