<template>
  <div class="flex h-screen bg-[#2b1f1a] font-sans overflow-hidden">
    <div
      class="bg-[#3e2e25] transition-all duration-300 flex flex-col items-center py-5 border-r border-[#6b8e23]"
      :class="isSidebarOpen ? 'w-64' : 'w-16'"
    >
      <button @click="toggleSidebar" class="mb-5 text-[#c7d297] hover:bg-[#6b8e23]/20 p-2 rounded-lg transition-colors w-full flex justify-center">
        <svg v-if="isSidebarOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path></svg>
        <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path></svg>
      </button>

      <div v-if="isSidebarOpen" class="w-full px-4 flex flex-col gap-3">
        <h2 class="text-[#c7d297] text-xl font-bold mb-2">Доски</h2>
        <div v-for="board in boards" :key="board.id"
             @click="selectBoard(board.id)"
             class="p-2 rounded cursor-pointer transition-colors text-[#f7f3e8]"
             :class="activeBoardId === board.id ? 'bg-[#6b8e23]/30 border-l-4 border-[#c7d297]' : 'hover:bg-[#6b8e23]/10 border-l-4 border-transparent'">
          {{ board.title }}
        </div>

        <div class="mt-4 flex gap-2">
          <input v-model="newBoardTitle" @keyup.enter="addBoard" type="text" placeholder="Новая доска" class="w-full bg-[#2b1f1a] text-[#f7f3e8] border border-[#6b8e23] rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#c7d297]">
          <button @click="addBoard" class="bg-[#6b8e23] text-[#2b1f1a] p-2 rounded hover:bg-[#a3b86c] transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          </button>
        </div>
      </div>
    </div>

    <div class="flex-1 flex flex-col p-5 overflow-hidden">
      <h1 class="text-[#c7d297] mb-7 text-4xl tracking-wide font-bold">{{ activeBoard?.title || 'Drag&Dropicks' }}</h1>

      <div v-if="activeBoard" class="flex gap-6 overflow-x-auto items-start pb-5 w-full flex-1">
        <div v-for="column in activeBoard.columns" :key="column.id"
             class="flex-none w-80 bg-[#3e2e25] rounded-xl p-4 shadow-md border-t-4 max-h-full flex flex-col transition-colors"
             :style="{ borderTopColor: column.color || '#6b8e23' }">
          <div class="flex justify-between items-center mb-4 group/header">
            <h3 class="mt-0 text-xl font-semibold transition-colors" :style="{ color: column.color || '#a3b86c' }">{{ column.title }}</h3>
            <div class="flex items-center gap-2">
              <span class="text-[#f7f3e8] text-sm bg-[#2b1f1a] px-2 py-1 rounded">{{ column.tasks.length }}</span>
              <button @click="editColumn(column)" class="text-gray-400 hover:text-white opacity-0 group-hover/header:opacity-100 transition-opacity p-1">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              </button>
            </div>
          </div>

          <draggable
            v-model="column.tasks"
            group="tasks"
            item-key="id"
            class="flex-1 flex flex-col gap-3 overflow-y-auto"
            ghost-class="opacity-50 bg-[#c7d297] border-2 border-dashed border-[#6b8e23]"
          >
            <template #item="{element}">
              <div class="bg-[#f7f3e8] text-[#2b1f1a] p-3 rounded-lg shadow group relative transition-all duration-200 hover:-translate-y-0.5" >

                <!-- Собственный Drag Handle с контекстным меню поверх -->
                <div class="absolute left-[-15px] top-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div class="relative inline-block text-left" @mouseleave="element.showMenu = false">
                    <button @click="element.showMenu = !element.showMenu" class="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-800 bg-gray-100 rounded tiptap-drag-handle">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    </button>
                    <!-- Всплывающее контекстное меню (Drag Context Menu) -->
                    <div v-if="element.showMenu" class="absolute z-50 left-full top-0 ml-1 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div class="py-1" role="menu">
                        <button @click="element.editor.chain().focus().toggleHeading({ level: 1 }).run(); element.showMenu = false" class="text-gray-700 block px-4 py-2 text-sm w-full text-left hover:bg-gray-100">Заголовок H1</button>
                        <button @click="element.editor.chain().focus().toggleHighlight().run(); element.showMenu = false" class="text-gray-700 block px-4 py-2 text-sm w-full text-left hover:bg-gray-100">Выделить</button>
                        <button @click="deleteTask(column.id, element.id)" class="text-red-600 block px-4 py-2 text-sm w-full text-left hover:bg-red-50">Удалить карточку</button>
                      </div>
                    </div>
                  </div>
                </div>

                <editor-content :editor="element.editor" class="focus:outline-none min-h-[40px] prose prose-sm max-w-none pr-2 pl-4" />
                <div class="mt-2 text-xs text-gray-500 font-medium border-t border-gray-200 pt-1 flex justify-between">
                  <span>{{ new Date(element.createdAt).toLocaleDateString() }}</span>
                  <button @click="deleteTask(column.id, element.id)" class="text-red-500 hover:text-red-700">Удалить</button>
                </div>
              </div>
            </template>
          </draggable>

          <div class="mt-4 pt-4 border-t border-[#2b1f1a]">
            <button @click="addTask(column.id)" class="w-full flex items-center gap-2 justify-center py-2 bg-[#2b1f1a]/50 text-[#a3b86c] hover:text-[#c7d297] hover:bg-[#2b1f1a] rounded transition-colors border border-transparent hover:border-[#6b8e23]">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
              Добавить карточку
            </button>
          </div>
        </div>

        <div class="flex-none w-80 bg-[#3e2e25]/50 border-2 border-dashed border-[#6b8e23] rounded-xl p-4 flex items-center justify-center cursor-pointer hover:bg-[#3e2e25] transition-colors" @click="addColumn">
          <span class="text-[#a3b86c] font-semibold flex items-center gap-2">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            Добавить колонку
          </span>
        </div>
      </div>
      <div v-else class="flex-1 flex items-center justify-center">
        <div class="text-[#a3b86c] text-xl">Выберите или создайте доску слева</div>
      </div>
    </div>

    <!-- Модальное окно редактирования колонки -->
    <div v-if="editingColumn" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div class="bg-[#3e2e25] p-6 rounded-xl shadow-xl w-96 border border-[#6b8e23]">
        <h2 class="text-xl text-[#c7d297] mb-4 font-bold">Настройки колонки</h2>
        <div class="mb-4">
          <label class="block text-[#f7f3e8] text-sm mb-2">Название</label>
          <input v-model="editColData.title" type="text" class="w-full bg-[#2b1f1a] text-[#f7f3e8] border border-[#6b8e23] rounded p-2 focus:outline-none focus:ring-1 focus:ring-[#c7d297]">
        </div>
        <div class="mb-6">
          <label class="block text-[#f7f3e8] text-sm mb-2">Цвет (верхняя граница и заголовок)</label>
          <input v-model="editColData.color" type="color" class="w-full h-10 border-0 bg-transparent rounded cursor-pointer">
        </div>
        <div class="flex justify-end gap-3 items-center">
          <button @click="deleteColumn(editingColumn.id)" class="text-red-500 hover:text-red-400 mr-auto text-sm">Удалить колонку</button>
          <button @click="closeEditColumn" class="text-gray-400 hover:text-white px-3 py-2 rounded">Отмена</button>
          <button @click="saveColumnEdit" class="bg-[#6b8e23] text-[#2b1f1a] px-4 py-2 rounded hover:bg-[#a3b86c] transition-colors font-medium">Сохранить</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import draggable from 'vuedraggable'
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { Highlight } from '@tiptap/extension-highlight'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import GlobalDragHandle from 'tiptap-extension-global-drag-handle'

const isSidebarOpen = ref(true)
const toggleSidebar = () => { isSidebarOpen.value = !isSidebarOpen.value }

const createEditor = (content) => {
  return new Editor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Highlight,
      GlobalDragHandle.configure({
        dragHandleWidth: 20, // width of the generated drag handle
        scrollTreshold: 100,
        dragHandleSelector: '.custom-drag-handle' // Optional, but usually handled implicitly by the plugin
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm xl:prose-base m-1 focus:outline-none max-h-48 overflow-y-auto pl-6 relative',
      },
    },
  })
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
    newBoardTitle.value = ''
  }
}

const selectBoard = (id) => { activeBoardId.value = id }

const addColumn = () => {
  if (activeBoard.value) {
    const title = prompt('Название колонки:')
    if (title?.trim()) {
      activeBoard.value.columns.push({ id: generateId(), title: title.trim(), color: '#6b8e23', tasks: [] })
    }
  }
}

// Logic for editing column
const editingColumn = ref(null)
const editColData = ref({ title: '', color: '#6b8e23' })

const editColumn = (column) => {
  editingColumn.value = column
  editColData.value = { title: column.title, color: column.color || '#6b8e23' }
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
})
</script>

<style scoped>
.prose :deep(p) { margin: 0; }
.prose :deep(strong) { font-weight: 700; }
.prose :deep(h1), .prose :deep(h2), .prose :deep(h3) { margin: 0; font-weight: 600; }
</style>
