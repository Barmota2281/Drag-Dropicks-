<template>
  <header class="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700 shrink-0 gap-4">
    <!-- Title + back -->
    <div class="flex items-center gap-3 min-w-0">
      <button @click="router.push('/')" class="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all flex-shrink-0" title="На главную">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
      </button>
      <h1 class="text-gray-900 dark:text-gray-100 text-xl font-bold tracking-tight truncate">{{ boardTitle || 'Drag&Dropicks' }}</h1>
    </div>

    <div class="flex items-center gap-3 flex-1 justify-end min-w-0">
      <!-- Search -->
      <div class="relative w-full max-w-md" ref="searchRef">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        </div>
        <input
            ref="searchInputRef"
            v-model="searchQuery"
            type="text"
            placeholder="Поиск задач по всем доскам..."
            class="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-lg pl-9 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all focus:bg-transparent dark:focus:bg-gray-700 shadow-sm"
            @focus="isSearchOpen = true"
            @keydown.escape="closeSearch"
            @keydown.down.prevent="moveSelection(1)"
            @keydown.up.prevent="moveSelection(-1)"
            @keydown.enter.prevent="goToSelected"
        />
        <div class="absolute inset-y-0 right-0 pr-2.5 flex items-center gap-1">
          <button v-if="searchQuery" @click="clearSearch" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
          <kbd v-else class="hidden sm:flex items-center px-1.5 py-0.5 text-xs font-mono text-gray-400 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded">/</kbd>
        </div>

        <!-- Dropdown -->
        <Transition
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="opacity-0 translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-1"
        >
          <div v-if="isSearchOpen && (searchQuery.length > 0 || recentSearches.length > 0)"
               class="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden max-h-[480px] flex flex-col">

            <!-- No query — show recent -->
            <template v-if="!searchQuery">
              <div class="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <span>Недавний поиск</span>
                <button v-if="recentSearches.length" @click="clearRecent" class="text-gray-300 hover:text-gray-500 dark:hover:text-gray-300 transition-colors text-xs font-normal">Очистить</button>
              </div>
              <div v-if="recentSearches.length === 0" class="px-4 py-8 text-center text-sm text-gray-400">Начните вводить для поиска...</div>
              <button v-for="(term, i) in recentSearches" :key="i" @click="searchQuery = term"
                      class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left">
                <svg class="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                {{ term }}
              </button>
            </template>

            <!-- Has query — results -->
            <template v-else>
              <div v-if="searchResults.length === 0" class="px-4 py-10 text-center">
                <div class="text-3xl mb-3">🔍</div>
                <div class="text-sm font-medium text-gray-600 dark:text-gray-300">Ничего не найдено</div>
                <div class="text-xs text-gray-400 mt-1">Нет задач по запросу "{{ searchQuery }}"</div>
              </div>
              <div v-else class="overflow-y-auto flex flex-col">
                <div v-for="group in groupedResults" :key="group.boardTitle">
                  <div class="px-4 py-1.5 flex items-center gap-2 bg-gray-50 dark:bg-gray-750 border-b border-t border-gray-100 dark:border-gray-700 sticky top-0">
                    <svg class="w-3 h-3 text-accent-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"/></svg>
                    <span class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{{ group.boardTitle }}</span>
                    <span class="ml-auto text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded-full">{{ group.items.length }}</span>
                  </div>
                  <button
                      v-for="item in group.items" :key="item.globalIndex"
                      @click="selectResult(item)"
                      @mouseenter="selectedIndex = item.globalIndex"
                      class="w-full flex items-start gap-3 px-4 py-3 text-left transition-colors border-b border-gray-50 dark:border-gray-700/40 last:border-0"
                      :class="selectedIndex === item.globalIndex ? 'bg-accent-50 dark:bg-accent-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'"
                  >
                    <div class="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" :style="{ backgroundColor: item.columnColor || '#9ca3af' }"></div>
                    <div class="flex-1 min-w-0">
                      <div class="text-sm text-gray-800 dark:text-gray-200 font-medium leading-snug line-clamp-2" v-html="highlightMatch(item.text, searchQuery)"></div>
                      <div class="flex items-center gap-1.5 mt-1">
                        <span class="text-xs px-1.5 py-0.5 rounded-md font-medium" :style="{ backgroundColor: (item.columnColor || '#9ca3af') + '22', color: item.columnColor || '#9ca3af' }">{{ item.columnTitle }}</span>
                        <span class="text-xs text-gray-400">{{ formatDate(item.createdAt) }}</span>
                      </div>
                    </div>
                    <svg class="w-3.5 h-3.5 flex-shrink-0 mt-1 transition-colors" :class="selectedIndex === item.globalIndex ? 'text-accent-400' : 'text-gray-300 dark:text-gray-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                  </button>
                </div>
                <div class="px-4 py-2 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
                  <span class="text-xs text-gray-400">{{ searchResults.length }} {{ pluralResults(searchResults.length) }}</span>
                  <div class="hidden sm:flex items-center gap-3 text-xs text-gray-400">
                    <span><kbd class="px-1 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded font-mono">↑↓</kbd> навигация</span>
                    <span><kbd class="px-1 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded font-mono">↵</kbd> выбрать</span>
                    <span><kbd class="px-1 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded font-mono">Esc</kbd> закрыть</span>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </Transition>
      </div>

      <!-- Add task -->
      <button @click="$emit('add-task')" class="px-4 py-2 bg-accent-600 text-white text-sm font-semibold rounded-lg hover:bg-accent-700 transition-colors shadow-sm hidden sm:flex items-center gap-1.5 shrink-0">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
        Добавить
      </button>

      <!-- Profile -->
      <div class="relative shrink-0" ref="profileRef">
        <button @click="isProfileOpen = !isProfileOpen" class="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
          <div class="w-8 h-8 rounded-full bg-gradient-to-br from-accent-400 to-indigo-500 flex items-center justify-center text-white text-sm font-bold shadow-sm overflow-hidden">
            <img v-if="userAvatar" :src="userAvatar" alt="Avatar" class="w-full h-full object-cover" />
            <span v-else>{{ userInitial }}</span>
          </div>
          <svg class="w-3.5 h-3.5 text-gray-400 hidden sm:block transition-transform" :class="{ 'rotate-180': isProfileOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/></svg>
        </button>
        <Transition enter-active-class="transition duration-150 ease-out" enter-from-class="opacity-0 scale-95 translate-y-1" enter-to-class="opacity-100 scale-100 translate-y-0" leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0 scale-95">
          <div v-if="isProfileOpen" class="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-50 overflow-hidden">
            <div class="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
              <div class="text-sm font-semibold text-gray-900 dark:text-gray-100">Мой аккаунт</div>
              <div class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{{ userEmail }}</div>
            </div>
            <div class="py-1">
              <button @click="nav('/profile')" class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2.5">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                Профиль
              </button>
              <button @click="nav('/settings')" class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2.5">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                Настройки
              </button>
            </div>
            <div class="border-t border-gray-100 dark:border-gray-700 py-1">
              <button @click="logout" class="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                Выйти
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../../services/auth.service.js'

const props = defineProps({
  boardTitle: { type: String, default: 'Drag&Dropicks' },
  boards: { type: Array, default: () => [] },
  standaloneTasks: { type: Array, default: () => [] }
})
const emit = defineEmits(['add-task', 'jump-to-task'])

const router = useRouter()
const searchRef = ref(null)
const searchInputRef = ref(null)
const profileRef = ref(null)
const isSearchOpen = ref(false)
const isProfileOpen = ref(false)
const searchQuery = ref('')
const selectedIndex = ref(-1)
const recentSearches = ref(JSON.parse(localStorage.getItem('dnp_recent_searches') || '[]'))
const userEmail = ref('user@example.com')
const userAvatar = ref(null)

const userInitial = computed(() => {
  return userEmail.value ? userEmail.value.charAt(0).toUpperCase() : 'U'
})

const searchResults = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q && (!props.boards?.length && !props.standaloneTasks?.length)) return []
  if (!q) return []
  const results = []

  props.boards?.forEach(board => {
    board.columns?.forEach(col => {
      col.tasks?.forEach(task => {
        const text = task.editor?.getText?.() || ''
        if (text.toLowerCase().includes(q)) {
          results.push({
            boardId: board.id, boardTitle: board.title,
            columnId: col.id, columnTitle: col.title, columnColor: col.color,
            taskId: task.id, text: text.trim() || '(без текста)',
            createdAt: task.createdAt, globalIndex: results.length,
            isStandalone: false
          })
        }
      })
    })
  })

  props.standaloneTasks?.forEach(task => {
    const text = task.editor?.getText?.() || ''
    const title = task.title || ''
    if (text.toLowerCase().includes(q) || title.toLowerCase().includes(q)) {
      results.push({
        boardId: null, boardTitle: 'Общие задачи',
        columnId: null, columnTitle: '-', columnColor: '#9ca3af',
        taskId: task.id, text: (title + ' ' + text).trim() || '(без текста)',
        createdAt: task.createdAt, globalIndex: results.length,
        isStandalone: true
      })
    }
  })

  return results
})

const groupedResults = computed(() => {
  const groups = {}
  searchResults.value.forEach(item => {
    if (!groups[item.boardTitle]) groups[item.boardTitle] = { boardTitle: item.boardTitle, items: [] }
    groups[item.boardTitle].items.push(item)
  })
  return Object.values(groups)
})

watch(searchQuery, () => { selectedIndex.value = -1 })

const highlightMatch = (text, query) => {
  if (!query) return text
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return text.replace(new RegExp(`(${escaped})`, 'gi'), '<mark class="bg-yellow-200 dark:bg-yellow-800/60 text-yellow-900 dark:text-yellow-200 rounded px-0.5 not-italic font-semibold">$1</mark>')
}

const formatDate = (ts) => {
  if (!ts) return ''
  return new Date(ts).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

const pluralResults = (n) => {
  if (n % 10 === 1 && n % 100 !== 11) return 'результат'
  if ([2,3,4].includes(n % 10) && ![12,13,14].includes(n % 100)) return 'результата'
  return 'результатов'
}

const saveRecent = (q) => {
  if (!q.trim()) return
  const list = [q, ...recentSearches.value.filter(s => s !== q)].slice(0, 5)
  recentSearches.value = list
  localStorage.setItem('dnp_recent_searches', JSON.stringify(list))
}

const clearRecent = () => { recentSearches.value = []; localStorage.removeItem('dnp_recent_searches') }

const selectResult = (item) => {
  saveRecent(searchQuery.value)
  emit('jump-to-task', { boardId: item.boardId, columnId: item.columnId, taskId: item.taskId, isStandalone: item.isStandalone })
  closeSearch()
}

const moveSelection = (dir) => {
  const max = searchResults.value.length - 1
  if (max < 0) return
  selectedIndex.value = Math.max(0, Math.min(max, selectedIndex.value + dir))
}

const goToSelected = () => {
  const item = searchResults.value.find(r => r.globalIndex === selectedIndex.value)
  if (item) selectResult(item)
  else if (searchResults.value.length === 1) selectResult(searchResults.value[0])
}

const clearSearch = () => { searchQuery.value = ''; searchInputRef.value?.focus() }
const closeSearch = () => { isSearchOpen.value = false; selectedIndex.value = -1 }

const handleKeydown = (e) => {
  if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
    e.preventDefault()
    searchInputRef.value?.focus()
    isSearchOpen.value = true
  }
}

const handleClickOutside = (e) => {
  if (searchRef.value && !searchRef.value.contains(e.target)) closeSearch()
  if (profileRef.value && !profileRef.value.contains(e.target)) isProfileOpen.value = false
}

onMounted(async () => {
  document.addEventListener('keydown', handleKeydown)
  document.addEventListener('click', handleClickOutside)

  if (authService.isAuthenticated()) {
    try {
      const profile = await authService.getProfile()
      if (profile && profile.email) {
        userEmail.value = profile.email
      }
      if (profile && (profile.avatarURL || profile.avatarUrl)) {
        userAvatar.value = profile.avatarURL || profile.avatarUrl
      }
    } catch (e) {
      console.error('Не удалось загрузить профиль', e)
    }
  }
})
onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('click', handleClickOutside)
})

const nav = (path) => { isProfileOpen.value = false; router.push(path) }
const logout = () => {
  isProfileOpen.value = false;
  authService.logout()
  router.push('/login')
}
</script>