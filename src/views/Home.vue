<script setup>
import { useRouter } from 'vue-router';
import HomeHeader from '../components/common/HomeHeader.vue';

const router = useRouter();
const goToBoard = () => {
  router.push({ name: 'Board' });
}

const stats = [
  { value: '100%', label: 'Бесплатно' },
  { value: '∞', label: 'Задач и колонок' },
  { value: '0', label: 'Лишних кликов' },
];

const steps = [
  { number: '01', title: 'Создайте доску', desc: 'Назовите проект и добавьте нужные колонки — «В работе», «Готово» или любые свои.' },
  { number: '02', title: 'Добавьте задачи', desc: 'Создавайте карточки с описанием и расставляйте приоритеты.' },
  { number: '03', title: 'Перетаскивайте', desc: 'Меняйте статус задач одним движением мыши — быстро и наглядно.' },
];

const features = [
  { icon: '🎨', title: 'Темы оформления', desc: 'Выбирайте из множества цветовых схем — синяя, пурпурная, розовая и другие.' },
  { icon: '🌙', title: 'Тёмный режим', desc: 'Переключайтесь между светлой и тёмной темой в один клик.' },
  { icon: '📋', title: 'Гибкие колонки', desc: 'Создавайте любое количество колонок под ваш уникальный рабочий процесс.' },
  { icon: '⚡', title: 'Мгновенный отклик', desc: 'Интерфейс реагирует мгновенно — никаких задержек и перезагрузок.' },
  { icon: '💾', title: 'Автосохранение', desc: 'Все изменения сохраняются автоматически, ничего не потеряется.' },
  { icon: '📱', title: 'Адаптивность', desc: 'Работает на любом устройстве — компьютере, планшете и телефоне.' },
];
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col dark:bg-gray-900">
    <HomeHeader />

    <!-- Hero -->
    <main class="flex-grow flex flex-col items-center p-6 text-center">
      <div class="max-w-4xl w-full space-y-8 pt-12 pb-20">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 bg-accent-100 dark:bg-accent-900/40 text-accent-700 dark:text-accent-300 rounded-full text-sm font-medium">
          <span class="w-2 h-2 rounded-full bg-accent-500 animate-pulse inline-block"></span>
          Канбан-доска нового поколения
        </div>

        <h1 class="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight leading-tight">
          Управляйте своими задачами с
          <span class="bg-clip-text text-transparent bg-gradient-to-r from-accent-500 to-indigo-600"> Drag&Dropicks</span>
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
          Простой, мощный и удобный канбан-ассистент. Планируйте, отслеживайте прогресс и достигайте целей быстрее, перетаскивая задачи по доскам без лишних усилий.
        </p>

        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <button @click="goToBoard" class="px-8 py-4 bg-accent-600 text-white text-lg font-semibold rounded-xl hover:bg-accent-700 transition-all shadow-lg shadow-accent-500/30 hover:shadow-accent-500/50 hover:-translate-y-0.5">
            Перейти к доске →
          </button>
          <a href="#how-it-works" class="px-8 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-lg font-semibold rounded-xl border border-gray-200 dark:border-gray-700 hover:border-accent-400 dark:hover:border-accent-500 transition-all hover:-translate-y-0.5">
            Как это работает
          </a>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-3 gap-6 pt-8 max-w-lg mx-auto">
          <div v-for="stat in stats" :key="stat.label" class="text-center">
            <div class="text-3xl font-extrabold text-accent-600 dark:text-accent-400">{{ stat.value }}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ stat.label }}</div>
          </div>
        </div>

        <!-- Feature cards -->
        <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div class="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-accent-300 dark:hover:border-accent-600 hover:shadow-md transition-all">
            <div class="text-accent-500 mb-4 text-3xl">✨</div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Интуитивно</h3>
            <p class="text-gray-600 dark:text-gray-400">Перетаскивайте карточки одним движением, организуя свой рабочий процесс.</p>
          </div>
          <div class="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-accent-300 dark:hover:border-accent-600 hover:shadow-md transition-all">
            <div class="text-accent-500 mb-4 text-3xl">🚀</div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Продуктивно</h3>
            <p class="text-gray-600 dark:text-gray-400">Фокусируйтесь на самом важном, используя современные инструменты планирования.</p>
          </div>
          <div class="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-accent-300 dark:hover:border-accent-600 hover:shadow-md transition-all">
            <div class="text-accent-500 mb-4 text-3xl">🔒</div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Надежно</h3>
            <p class="text-gray-600 dark:text-gray-400">Ваши задачи надежно сохраняются, обеспечивая постоянный доступ к проектам.</p>
          </div>
        </div>
      </div>

      <!-- How it works -->
      <section id="how-it-works" class="w-full max-w-4xl py-20 border-t border-gray-200 dark:border-gray-700">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100">Как это работает</h2>
          <p class="mt-4 text-gray-500 dark:text-gray-400 text-lg">Три шага до идеально организованного рабочего процесса</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-left relative">
          <!-- connector line (desktop) -->
          <div class="hidden md:block absolute top-8 left-1/6 right-1/6 h-px bg-gradient-to-r from-accent-200 via-accent-400 to-accent-200 dark:from-accent-800 dark:via-accent-500 dark:to-accent-800 z-0"></div>

          <div v-for="step in steps" :key="step.number" class="relative z-10 flex flex-col items-start gap-4 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div class="w-12 h-12 rounded-xl bg-accent-600 text-white font-extrabold text-lg flex items-center justify-center shadow-md shadow-accent-500/30 flex-shrink-0">
              {{ step.number }}
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">{{ step.title }}</h3>
              <p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{{ step.desc }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- All Features -->
      <section class="w-full max-w-4xl py-20 border-t border-gray-200 dark:border-gray-700">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100">Всё что нужно — уже здесь</h2>
          <p class="mt-4 text-gray-500 dark:text-gray-400 text-lg">Никаких лишних настроек — просто открываете и работаете</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-left">
          <div
              v-for="feature in features"
              :key="feature.title"
              class="flex gap-4 p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-accent-300 dark:hover:border-accent-600 hover:shadow-sm transition-all"
          >
            <div class="text-2xl flex-shrink-0 mt-0.5">{{ feature.icon }}</div>
            <div>
              <h4 class="font-bold text-gray-900 dark:text-gray-100 mb-1">{{ feature.title }}</h4>
              <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{{ feature.desc }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Banner -->
      <section class="w-full max-w-4xl pb-20">
        <div class="rounded-2xl bg-gradient-to-r from-accent-600 to-indigo-600 p-10 text-center text-white shadow-xl shadow-accent-500/20">
          <h2 class="text-3xl font-extrabold mb-3">Готов начать?</h2>
          <p class="text-accent-100 text-lg mb-8 max-w-md mx-auto">Откройте свою первую канбан-доску прямо сейчас — это занимает меньше минуты.</p>
          <button @click="goToBoard" class="px-10 py-4 bg-white text-accent-700 font-bold rounded-xl hover:bg-accent-50 transition-all shadow-lg hover:-translate-y-0.5">
            Открыть доску 🚀
          </button>
        </div>
      </section>
    </main>
  </div>
</template>