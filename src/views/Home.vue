<script setup>
import { useRouter } from 'vue-router';
import HomeHeader from '../components/common/HomeHeader.vue';

const router = useRouter();
const goToBoard = () => {
    router.push({ name: 'Board' });
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col dark:bg-gray-900">
    <HomeHeader />

    <main class="flex-grow flex flex-col items-center justify-center p-6 text-center">
      <div class="max-w-3xl space-y-8">
        <h1 class="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
          Управляйте своими задачами с <span class="bg-clip-text text-transparent bg-gradient-to-r from-accent-500 to-indigo-600">Drag&Dropicks</span>
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
          Простой, мощный и удобный канбан-ассистент. Планируйте, отслеживайте прогресс и достигайте целей быстрее, перетаскивая задачи по доскам без лишних усилий.
        </p>

        <div class="flex justify-center gap-4">
          <button @click="goToBoard" class="px-8 py-4 bg-accent-600 text-white text-lg font-semibold rounded-xl hover:bg-accent-700 transition-colors shadow-lg shadow-accent-500/30">
            Перейти к доске
          </button>
        </div>

        <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div class="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div class="text-accent-500 mb-4 text-3xl">✨</div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Интуитивно</h3>
            <p class="text-gray-600 dark:text-gray-400">Перетаскивайте карточки одним движением, организуя свой рабочий процесс.</p>
          </div>
          <div class="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div class="text-accent-500 mb-4 text-3xl">🚀</div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Продуктивно</h3>
            <p class="text-gray-600 dark:text-gray-400">Фокусируйтесь на самом важном, используя современные инструменты планирования.</p>
          </div>
          <div class="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div class="text-accent-500 mb-4 text-3xl">🔒</div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Надежно</h3>
            <p class="text-gray-600 dark:text-gray-400">Ваши задачи надежно сохраняются, обеспечивая постоянный доступ к проектам.</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
