<template>
  <div class="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans overflow-hidden transition-colors duration-300">
    <div
      class="transition-all duration-300 flex flex-col items-center py-5 border-r z-20"
      :class="isSidebarOpen ? 'w-64 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700' : 'w-16 bg-transparent border-transparent shadow-none'"
    >
      <div class="flex w-full px-4 gap-2 mb-5">
        <button @click="toggleSidebar"
                class="text-gray-500 dark:text-gray-400 p-2 rounded-lg transition-colors flex flex-1 justify-center"
                :class="isSidebarOpen ? 'hover:bg-gray-100 dark:hover:bg-gray-700' : 'bg-transparent !bg-transparent hover:bg-transparent hover:text-gray-900 dark:hover:text-gray-100'">
          <svg v-if="isSidebarOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path></svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path></svg>
        </button>
        <button v-if="isSidebarOpen" @click="toggleTheme" class="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors flex justify-center" title="Сменить тему">
          <svg v-if="isDark" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
        </button>
      </div>

      <div v-if="isSidebarOpen" class="w-full px-4 flex flex-col gap-3">
        <h2 class="text-gray-800 dark:text-gray-200 text-xl font-bold mb-2">Доски</h2>
        <div v-for="board in boards" :key="board.id"
             @click="selectBoard(board.id)"
             class="p-2 rounded cursor-pointer transition-colors text-gray-700 dark:text-gray-300 flex items-center"
             :class="currentView === 'board' && activeBoardId === board.id ? 'bg-gray-100 dark:bg-gray-700 border-l-2 border-gray-400 dark:border-gray-500 font-medium shadow-sm' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 border-l-2 border-transparent'">
          {{ board.title }}
        </div>

        <div class="mt-4 flex gap-2">
          <input v-model="newBoardTitle" @keyup.enter="addBoard" type="text" placeholder="Новая доска" class="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 transition-colors">
          <button @click="addBoard" class="text-gray-500 dark:text-gray-400 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-transparent">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          </button>
        </div>

        <div class="mt-4 flex items-center justify-between mb-2">
          <h2 class="text-gray-800 dark:text-gray-200 text-xl font-bold cursor-pointer hover:text-blue-500 transition-colors flex items-center gap-1" @click="isTasksOpen = !isTasksOpen">
            <svg class="w-4 h-4 transition-transform" :class="{'rotate-90': isTasksOpen}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            Задачи
          </h2>
        </div>
        <div v-show="isTasksOpen" class="flex flex-col gap-1 transition-all overflow-hidden">
          <div v-for="task in standaloneTasks" :key="task.id"
               @click="selectTask(task.id)"
               class="p-2 rounded cursor-pointer transition-colors text-gray-700 dark:text-gray-300 flex items-center"
               :class="currentView === 'task' && activeTaskId === task.id ? 'bg-gray-100 dark:bg-gray-700 border-l-2 border-blue-400 dark:border-blue-500 font-medium shadow-sm' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 border-l-2 border-transparent'">
            {{ task.title || 'Новая задача' }}
          </div>
        </div>
      </div>

      <div v-if="isSidebarOpen" class="mt-auto w-full px-4 pb-6">
        <button @click="goHome" class="w-full py-2 px-4 rounded-lg bg-transparent border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200 transition-colors flex items-center justify-center gap-2 text-sm font-medium">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
          Вернуться на главную
        </button>
      </div>
    </div>

    <div class="flex-1 flex flex-col p-5 overflow-hidden">
      <BoardHeader :board-title="currentView === 'board' ? activeBoard?.title : 'Задача'" @add-task="addGeneralTask" />

      <div v-if="currentView === 'board' && activeBoard" class="flex gap-6 overflow-x-auto items-stretch pb-5 w-full flex-1 h-full">
        <div v-for="column in activeBoard.columns" :key="column.id"
             class="flex-none w-80 bg-gray-100 dark:bg-gray-800 rounded-xl p-4 shadow-sm border-t-4 max-h-full flex flex-col transition-colors border-x border-b border-gray-200/50 dark:border-gray-700"
             :style="{ borderTopColor: column.color || '#9ca3af' }">
          <div class="flex justify-between items-center mb-4 group/header">
            <h3 class="mt-0 text-lg font-semibold transition-colors" :style="{ color: column.color || 'inherit' }">{{ column.title }}</h3>
            <div class="flex items-center gap-2">
              <span class="text-gray-600 dark:text-gray-300 text-xs font-medium bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">{{ column.tasks.length }}</span>
              <button @click="editColumn(column)" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-opacity p-1">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              </button>
            </div>
          </div>

          <draggable
            v-model="column.tasks"
            group="tasks"
            item-key="id"
            handle=".task-handle"
            :animation="200"
            :force-fallback="true"
            fallback-class="sortable-fallback"
            class="flex-1 flex flex-col gap-3 overflow-y-auto min-h-[150px] p-1 pb-6"
            ghost-class="sortable-ghost"
            drag-class="sortable-drag"
          >
            <template #item="{element}">
              <div class="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 group relative transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md" >

                <!-- Стандартный Bubble/Floating Menu от Tiptap для имитации контекстного меню -->
                <bubble-menu
                  :editor="element.editor"
                  :tippy-options="{ duration: 100 }"
                  v-if="element.editor"
                  class="flex bg-white dark:bg-gray-800 rounded shadow-lg border border-gray-200 dark:border-gray-600 overflow-hidden items-center"
                >
                  <button @click="element.editor.chain().focus().toggleHeading({ level: 1 }).run()" :class="{ 'bg-gray-100 dark:bg-gray-700': element.editor.isActive('heading', { level: 1 }) }" class="p-2 hover:bg-gray-50 dark:hover:bg-gray-700/80 text-sm font-semibold text-gray-700 dark:text-gray-200">H1</button>
                  <button @click="element.editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'bg-gray-100 dark:bg-gray-700': element.editor.isActive('heading', { level: 2 }) }" class="p-2 hover:bg-gray-50 dark:hover:bg-gray-700/80 text-sm font-semibold text-gray-700 dark:text-gray-200">H2</button>
                  <button @click="element.editor.chain().focus().toggleBold().run()" :class="{ 'bg-gray-100 dark:bg-gray-700': element.editor.isActive('bold') }" class="p-2 hover:bg-gray-50 dark:hover:bg-gray-700/80 text-sm font-bold text-gray-700 dark:text-gray-200">B</button>
                  <button @click="element.editor.chain().focus().toggleItalic().run()" :class="{ 'bg-gray-100 dark:bg-gray-700': element.editor.isActive('italic') }" class="p-2 hover:bg-gray-50 dark:hover:bg-gray-700/80 text-sm italic text-gray-700 dark:text-gray-200">I</button>
                  <button @click="element.editor.chain().focus().toggleHighlight().run()" :class="{ 'bg-gray-100 dark:bg-gray-700': element.editor.isActive('highlight') }" class="p-2 hover:bg-gray-50 dark:hover:bg-gray-700/80 text-sm text-gray-700 dark:text-gray-200">Mark</button>
                  <div class="h-4 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
                  <input type="color" @input="(event) => element.editor.chain().focus().setColor(event.target.value).run()" :value="element.editor.getAttributes('textStyle').color || '#000000'" class="w-6 h-6 p-0 border-none cursor-pointer bg-transparent mx-1 rounded" title="Цвет текста" />
                 </bubble-menu>

                <!-- Хендл для перетаскивания задачи (по клику сюда перетаскивается вся карточка) -->
                <div class="task-handle absolute right-2 top-2 opacity-50 hover:opacity-100 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 cursor-grab active:cursor-grabbing text-gray-500 dark:text-gray-400 transition-all z-10" title="Перетащить карточку">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9h8M8 15h8"></path></svg>
                </div>

                <editor-content :editor="element.editor" class="focus:outline-none min-h-[40px] prose prose-sm dark:prose-invert max-w-none pr-10 pl-1 pt-1" />
                <div class="mt-2 text-xs text-gray-500 dark:text-gray-400 font-medium border-t border-gray-100 dark:border-gray-600 pt-2 flex justify-between items-center">
                  <span>{{ new Date(element.createdAt).toLocaleDateString() }}</span>
                  <button @click="deleteTask(column.id, element.id)" class="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1.5 bg-transparent rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Удалить карточку">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </div>
              </div>
            </template>
          </draggable>

          <div class="mt-2 pt-3 border-t border-gray-200 dark:border-gray-700">
            <button @click="addTask(column.id)" class="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 bg-transparent rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <svg class="w-4 h-4 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
              Добавить карточку
            </button>
          </div>
        </div>

        <div class="flex-none w-80 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 flex items-center justify-center cursor-pointer hover:bg-gray-200/50 dark:hover:bg-gray-800 transition-colors" @click="addColumn">
          <span class="text-gray-500 dark:text-gray-400 font-medium flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            Добавить колонку
          </span>
        </div>
      </div>
      <div v-else-if="currentView === 'task' && activeTask" class="flex-1 flex flex-col overflow-y-auto relative">
        <div class="max-w-4xl w-full mx-auto pb-10">
          <input v-model="activeTask.title" type="text" placeholder="Название задачи" class="w-full text-3xl font-bold text-gray-900 dark:text-gray-100 bg-transparent border-none focus:outline-none mb-6 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 min-h-[400px] relative" @contextmenu.prevent>
            <div class="custom-drag-handle flex items-center justify-center w-5 h-6 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-grab active:cursor-grabbing transition-colors z-50">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
            </div>
            <bubble-menu
              :editor="activeTask.editor"
              :tippy-options="{ duration: 100 }"
              v-if="activeTask.editor"
              class="flex bg-white dark:bg-gray-800 rounded shadow-lg border border-gray-200 dark:border-gray-600 overflow-hidden items-center"
            >
              <button @click="activeTask.editor.chain().focus().toggleHeading({ level: 1 }).run()" :class="{ 'bg-gray-100 dark:bg-gray-700': activeTask.editor.isActive('heading', { level: 1 }) }" class="p-2 hover:bg-gray-50 dark:hover:bg-gray-700/80 text-sm font-semibold text-gray-700 dark:text-gray-200">H1</button>
              <button @click="activeTask.editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'bg-gray-100 dark:bg-gray-700': activeTask.editor.isActive('heading', { level: 2 }) }" class="p-2 hover:bg-gray-50 dark:hover:bg-gray-700/80 text-sm font-semibold text-gray-700 dark:text-gray-200">H2</button>
              <button @click="activeTask.editor.chain().focus().toggleBold().run()" :class="{ 'bg-gray-100 dark:bg-gray-700': activeTask.editor.isActive('bold') }" class="p-2 hover:bg-gray-50 dark:hover:bg-gray-700/80 text-sm font-bold text-gray-700 dark:text-gray-200">B</button>
              <button @click="activeTask.editor.chain().focus().toggleItalic().run()" :class="{ 'bg-gray-100 dark:bg-gray-700': activeTask.editor.isActive('italic') }" class="p-2 hover:bg-gray-50 dark:hover:bg-gray-700/80 text-sm italic text-gray-700 dark:text-gray-200">I</button>
              <button @click="activeTask.editor.chain().focus().toggleHighlight().run()" :class="{ 'bg-gray-100 dark:bg-gray-700': activeTask.editor.isActive('highlight') }" class="p-2 hover:bg-gray-50 dark:hover:bg-gray-700/80 text-sm text-gray-700 dark:text-gray-200">Mark</button>
              <div class="h-4 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
              <input type="color" @input="(event) => activeTask.editor.chain().focus().setColor(event.target.value).run()" :value="activeTask.editor.getAttributes('textStyle').color || '#000000'" class="w-6 h-6 p-0 border-none cursor-pointer bg-transparent mx-1 rounded" title="Цвет текста" />
             </bubble-menu>
            <editor-content :editor="activeTask.editor" class="focus:outline-none prose prose-lg dark:prose-invert max-w-none" />
          </div>
          <div class="mt-4 flex justify-end">
            <button @click="deleteStandaloneTask(activeTask.id)" class="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 bg-transparent rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors px-4 py-2 font-medium flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              Удалить задачу
            </button>
          </div>
        </div>
      </div>
      <div v-else class="flex-1 flex items-center justify-center">
        <div class="text-gray-500 dark:text-gray-400 text-xl font-medium">Выберите или создайте доску слева</div>
      </div>
    </div>

    <!-- Модальное окно редактирования колонки -->
    <div v-if="editingColumn" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-96 border border-gray-200 dark:border-gray-700">
        <h2 class="text-xl text-gray-900 dark:text-gray-100 mb-4 font-bold">Настройки колонки</h2>
        <div class="mb-4">
          <label class="block text-gray-700 dark:text-gray-300 text-sm mb-2 font-medium">Название</label>
          <input v-model="editColData.title" type="text" class="w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded p-2 focus:outline-none focus:ring-1 focus:ring-gray-400">
        </div>
        <div class="mb-6">
          <label class="block text-gray-700 dark:text-gray-300 text-sm mb-2 font-medium">Цвет (верхняя граница и заголовок)</label>
          <input v-model="editColData.color" type="color" class="w-full h-10 border-0 bg-transparent rounded cursor-pointer">
        </div>
        <div class="flex justify-end gap-2 items-center">
          <button @click="deleteColumn(editingColumn.id)" class="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 mr-auto p-2 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center" title="Удалить колонку">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
          <button @click="closeEditColumn" class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 px-3 py-2 rounded transition-colors text-sm font-medium">Отмена</button>
          <button @click="saveColumnEdit" class="text-gray-900 dark:text-gray-100 px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium">Сохранить</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount, onMounted, markRaw } from 'vue'
import { useRouter } from 'vue-router'
import draggable from 'vuedraggable'
import BoardHeader from './BoardHeader.vue'
import { Editor, EditorContent } from '@tiptap/vue-3'
import { BubbleMenu } from '@tiptap/vue-3/menus'
import StarterKit from '@tiptap/starter-kit'
import { Highlight } from '@tiptap/extension-highlight'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import GlobalDragHandle from 'tiptap-extension-global-drag-handle'

const router = useRouter()
const goHome = () => {
  router.push({ name: 'Home' })
}

const isDark = ref(false)
const toggleTheme = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark') {
    isDark.value = true
    document.documentElement.classList.add('dark')
  } else if (savedTheme === 'light') {
    isDark.value = false
    document.documentElement.classList.remove('dark')
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }
})

const isSidebarOpen = ref(true)
const toggleSidebar = () => { isSidebarOpen.value = !isSidebarOpen.value }

const createEditor = (content) => {
  return markRaw(new Editor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Highlight,
      GlobalDragHandle.configure({
        dragHandleWidth: 20,
        scrollTreshold: 100,
        dragHandleSelector: '.custom-drag-handle'
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert xl:prose-base m-1 focus:outline-none max-h-48 overflow-y-auto pl-6 relative',
      },
    },
  }))
}

const generateId = () => Math.random().toString(36).substr(2, 9)

const boards = ref([
  {
    id: 'b1',
    title: 'Моя первая доска',
    columns: [
      {
        id: 'c1',
        title: 'К выполнению',
        tasks: [
          { id: 't1', editor: createEditor('<p><strong>Создать дизайн</strong> доски</p>'), createdAt: Date.now() },
          { id: 't4', editor: createEditor('<p>Настроить WebSockets</p>'), createdAt: Date.now() }
        ]
      },
      {
        id: 'c2',
        title: 'В процессе',
        tasks: [
          { id: 't2', editor: createEditor('<p>Написать базовый код</p>'), createdAt: Date.now() }
        ]
      },
      {
        id: 'c3',
        title: 'Готово',
        tasks: [
          { id: 't3', editor: createEditor('<h3>Установить Vue.js</h3>'), createdAt: Date.now() }
        ]
      }
    ]
  }
])

const activeBoardId = ref('b1')
const activeBoard = computed(() => boards.value.find(b => b.id === activeBoardId.value))

const newBoardTitle = ref('')
const addBoard = () => {
  if (newBoardTitle.value.trim()) {
    const newBoard = {
      id: generateId(),
      title: newBoardTitle.value.trim(),
      columns: [
        { id: generateId(), title: 'К выполнению', tasks: [] },
        { id: generateId(), title: 'В процессе', tasks: [] },
        { id: generateId(), title: 'Готово', tasks: [] }
      ]
    }
    boards.value.push(newBoard)
    activeBoardId.value = newBoard.id
    currentView.value = 'board'
    newBoardTitle.value = ''
  }
}

const currentView = ref('board') // 'board' or 'task'

const selectBoard = (id) => {
  activeBoardId.value = id
  currentView.value = 'board'
}

const standaloneTasks = ref([])
const activeTaskId = ref(null)
const activeTask = computed(() => standaloneTasks.value.find(t => t.id === activeTaskId.value))
const isTasksOpen = ref(true)

const selectTask = (id) => {
  activeTaskId.value = id
  currentView.value = 'task'
}

const addColumn = () => {
  if (activeBoard.value) {
    const title = prompt('Название колонки:')
    if (title?.trim()) {
      activeBoard.value.columns.push({ id: generateId(), title: title.trim(), color: '#9ca3af', tasks: [] })
    }
  }
}

// Logic for editing column
const editingColumn = ref(null)
const editColData = ref({ title: '', color: '#9ca3af' })

const editColumn = (column) => {
  editingColumn.value = column
  editColData.value = { title: column.title, color: column.color || '#9ca3af' }
}

const closeEditColumn = () => {
  editingColumn.value = null
}

const saveColumnEdit = () => {
  if (editingColumn.value && activeBoard.value) {
    const col = activeBoard.value.columns.find(c => c.id === editingColumn.value.id)
    if (col) {
      col.title = editColData.value.title
      col.color = editColData.value.color
    }
    closeEditColumn()
  }
}

const deleteColumn = (columnId) => {
  if (confirm('Вы уверены, что хотите удалить эту колонку со всеми задачами?')) {
    if (activeBoard.value) {
      activeBoard.value.columns = activeBoard.value.columns.filter(c => c.id !== columnId)
    }
    closeEditColumn()
  }
}

const addTask = (columnId) => {
  const column = activeBoard.value.columns.find(c => c.id === columnId)
  if (column) {
    column.tasks.push({
      id: generateId(),
      editor: createEditor('<p>Новая задача...</p>'),
      createdAt: Date.now(),
      showMenu: false // Новое состояние для UI
    })
  }
}

const addGeneralTask = () => {
  const newTaskId = generateId()
  const newTask = {
    id: newTaskId,
    title: 'Новая задача',
    editor: createEditor('<p>Начните писать здесь...</p>'),
    createdAt: Date.now()
  }
  standaloneTasks.value.push(newTask)
  activeTaskId.value = newTaskId
  currentView.value = 'task'
}

const deleteStandaloneTask = (id) => {
  if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
    const index = standaloneTasks.value.findIndex(t => t.id === id)
    if (index !== -1) {
      standaloneTasks.value[index].editor.destroy()
      standaloneTasks.value.splice(index, 1)
      if (standaloneTasks.value.length > 0) {
        activeTaskId.value = standaloneTasks.value[0].id
      } else {
        currentView.value = 'board'
      }
    }
  }
}

const deleteTask = (columnId, taskId) => {
  const column = activeBoard.value.columns.find(c => c.id === columnId)
  if (column) {
    const index = column.tasks.findIndex(t => t.id === taskId)
    if (index !== -1) {
      column.tasks[index].editor.destroy()
      column.tasks.splice(index, 1)
    }
  }
}

onBeforeUnmount(() => {
  boards.value.forEach(board => {
    board.columns.forEach(column => {
      column.tasks.forEach(task => task.editor.destroy())
    })
  })
  standaloneTasks.value.forEach(task => task.editor.destroy())
})
</script>

<style scoped>
/* Классы стилей для перетаскивания */
.sortable-fallback {
  opacity: 1 !important;
  transform: rotate(1deg) scale(1.02) !important;
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25) !important;
  cursor: grabbing !important;
  z-index: 50 !important;
}
.sortable-ghost {
  opacity: 0.3 !important;
  border: 2px dashed #9ca3af !important;
  border-radius: 0.5rem !important;
  transform: scale(0.95) !important;
}
:global(.dark) .sortable-ghost {
  border-color: #6b7280 !important;
}
.sortable-drag {
  visibility: hidden !important;
}

/* Кастомные scrollbar'ы */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background-color: #d1d5db; /* tailwind gray-300 */
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background-color: #9ca3af; /* tailwind gray-400 */
}
:global(.dark) ::-webkit-scrollbar-thumb {
  background-color: #4b5563; /* tailwind gray-600 */
}
:global(.dark) ::-webkit-scrollbar-thumb:hover {
  background-color: #6b7280; /* tailwind gray-500 */
}

/* Прячем scrollbar, если не хватает места или если это не нужно, но оставляем его там где нужен скролл */
* {
  scrollbar-width: thin;
  scrollbar-color: #d1d5db transparent;
}
:global(.dark) * {
  scrollbar-color: #4b5563 transparent;
}

.prose :deep(p) { margin: 0; }
.prose :deep(strong) { font-weight: 700; }
.prose :deep(h1), .prose :deep(h2), .prose :deep(h3) { margin: 0; font-weight: 600; }
</style>
