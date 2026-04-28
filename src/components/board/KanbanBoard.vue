<template>
  <div class="flex flex-col md:flex-row h-screen h-[100dvh] bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans overflow-hidden transition-colors duration-300">

    <!-- ── Toast notifications ─────────────────────────────────────────── -->
    <Teleport to="body">
      <div class="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        <TransitionGroup
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="opacity-0 translate-x-8 scale-95"
            enter-to-class="opacity-100 translate-x-0 scale-100"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="opacity-100 translate-x-0 scale-100"
            leave-to-class="opacity-0 translate-x-8 scale-95"
        >
          <div
              v-for="toast in toasts"
              :key="toast.id"
              class="pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl shadow-xl border min-w-[280px] max-w-sm"
              :class="{
              'bg-white dark:bg-gray-800 border-green-200 dark:border-green-700': toast.type === 'success',
              'bg-white dark:bg-gray-800 border-red-200 dark:border-red-700': toast.type === 'error',
              'bg-white dark:bg-gray-800 border-yellow-200 dark:border-yellow-700': toast.type === 'warning',
              'bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-700': toast.type === 'info',
            }"
          >
            <svg v-if="toast.type === 'success'" class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            <svg v-else-if="toast.type === 'error'" class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <svg v-else-if="toast.type === 'warning'" class="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            <svg v-else class="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <div class="flex-1 min-w-0">
              <div v-if="toast.title" class="text-sm font-semibold text-gray-900 dark:text-gray-100">{{ toast.title }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400 leading-snug">{{ toast.message }}</div>
            </div>
            <button @click="dismissToast(toast.id)" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex-shrink-0 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
        </TransitionGroup>
      </div>
    </Teleport>

    <!-- ── Sidebar ──────────────────────────────────────────────────────── -->
    <!-- Mobile overlay -->
    <div v-if="isSidebarOpen && isMobile" class="fixed inset-0 z-[19] bg-black/30 md:hidden" @click="isSidebarOpen = false"></div>
    <div
        class="transition-all duration-300 flex flex-col items-center py-5 border-r z-20 flex-shrink-0"
        :class="[
        isSidebarOpen
          ? 'w-64 bg-white dark:bg-gray-900/60 border-gray-200 dark:border-gray-700'
          : 'w-0 md:w-14 overflow-hidden md:overflow-visible bg-transparent border-transparent',
        isMobile && isSidebarOpen ? 'fixed left-0 top-0 h-full shadow-2xl' : ''
      ]"
    >
      <div class="flex w-full px-4 gap-2 mb-5">
        <button @click="toggleSidebar" class="text-gray-500 dark:text-gray-400 p-2 rounded-lg transition-colors flex flex-1 justify-center"
                :class="isSidebarOpen ? 'hover:bg-gray-100 dark:hover:bg-gray-700' : 'bg-transparent !bg-transparent hover:bg-transparent hover:text-gray-900 dark:hover:text-gray-100'">
          <svg v-if="isSidebarOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/></svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"/></svg>
        </button>
        <button v-if="isSidebarOpen" @click="toggleTheme" class="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors flex justify-center" title="Сменить тему">
          <svg v-if="isDark" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
        </button>
      </div>

      <div v-if="isSidebarOpen" class="w-full px-4 flex flex-col gap-3 overflow-y-auto flex-1">
        <!-- Export buttons -->
        <div class="flex gap-1.5 mb-1">
          <button @click="exportBoard('json')" :disabled="!activeBoard" title="Экспорт в JSON"
                  class="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs font-medium border transition-all disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-accent-400">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
            JSON
          </button>
          <button @click="exportBoard('markdown')" :disabled="!activeBoard" title="Экспорт в Markdown"
                  class="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs font-medium border transition-all disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-accent-400">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            MD
          </button>
          <button @click="exportBoard('csv')" :disabled="!activeBoard" title="Экспорт в CSV"
                  class="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs font-medium border transition-all disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-accent-400">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18M10 3v18M14 3v18M3 6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6z"/></svg>
            CSV
          </button>
        </div>

        <h2 class="text-gray-800 dark:text-gray-200 text-xl font-bold mb-2">Доски</h2>
        <div v-for="board in boards" :key="board.id"
             @click="selectBoard(board.id)"
             class="cursor-pointer px-3 py-2 rounded-lg text-sm transition-colors mb-1 truncate flex items-center gap-2"
             :class="currentView === 'board' && activeBoardId === board.id ? 'bg-accent-50 dark:bg-accent-900/20 text-accent-700 dark:text-accent-400 border-l-2 border-accent-500 font-medium shadow-sm' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 border-l-2 border-transparent'">
          {{ board.title }}
        </div>

        <div class="mt-4 flex flex-col gap-2">
          <input v-model="newBoardTitle" @keyup.enter="addBoard" type="text" placeholder="Название новой доски"
                 class="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded p-2 text-sm focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-colors">
          <div class="flex gap-2">
            <select v-model="newBoardTemplate" class="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded p-2 text-sm focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-colors text-gray-700 dark:text-gray-300">
              <template v-for="tmpl in boardTemplates" :key="tmpl.id">
                <option :value="tmpl.id">{{ tmpl.name }}</option>
              </template>
            </select>
            <button @click="addBoard" class="flex-shrink-0 text-gray-500 dark:text-gray-400 p-2 rounded hover:bg-accent-50 hover:text-accent-600 dark:hover:bg-accent-900/20 dark:hover:text-accent-400 transition-colors border border-transparent" title="Создать доску">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            </button>
          </div>
        </div>

        <div class="mt-8 flex items-center justify-between mb-2">
          <h2 class="text-gray-800 dark:text-gray-200 text-xl font-bold cursor-pointer hover:text-accent-500 transition-colors flex items-center gap-1" @click="isTasksOpen = !isTasksOpen">
            <svg class="w-4 h-4 transition-transform" :class="{'rotate-90': isTasksOpen}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            Задачи
          </h2>
        </div>
        <div v-show="isTasksOpen" class="flex flex-col gap-1 transition-all overflow-hidden">
          <div v-for="task in standaloneTasks" :key="task.id"
               @click="selectTask(task.id)"
               class="p-2 rounded cursor-pointer transition-colors text-gray-700 dark:text-gray-300 flex items-center"
               :class="currentView === 'task' && activeTaskId === task.id ? 'bg-accent-50 dark:bg-accent-900/20 text-accent-700 dark:text-accent-400 border-l-2 border-accent-500 font-medium shadow-sm' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 border-l-2 border-transparent'">
            {{ task.title || 'Новая задача' }}
          </div>
        </div>
      </div>

      <div v-if="isSidebarOpen" class="mt-auto w-full px-4 pb-6 pt-4 flex-shrink-0 space-y-2">
        <!-- Notification center button -->
        <button @click="isNotifPanelOpen = !isNotifPanelOpen"
                class="w-full py-2 px-4 rounded-lg border transition-colors flex items-center justify-between text-sm font-medium"
                :class="urgentCount > 0
            ? 'border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30'
            : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200'"
        >
          <span class="flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
            Уведомления
          </span>
          <span v-if="notifications.length" class="text-xs px-1.5 py-0.5 rounded-full font-bold"
                :class="urgentCount > 0 ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'">
            {{ notifications.length }}
          </span>
        </button>
        <!-- Export button -->
        <button @click="isExportModalOpen = true" :disabled="!activeBoard"
                class="w-full py-2 px-4 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200 transition-colors flex items-center justify-center gap-2 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
          Экспорт доски
        </button>
        <button @click="goHome" class="w-full py-2 px-4 rounded-lg bg-transparent border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200 transition-colors flex items-center justify-center gap-2 text-sm font-medium">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          Вернуться на главную
        </button>
      </div>
    </div>

    <!-- ── Main area ────────────────────────────────────────────────────── -->
    <div class="flex-1 flex flex-col p-3 md:p-5 overflow-hidden min-w-0">
      <div class="flex items-center gap-2 mb-0">
        <!-- Mobile sidebar toggle -->
        <button @click="isSidebarOpen = !isSidebarOpen" class="md:hidden p-2 -ml-1 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
        <BoardHeader
            class="flex-1 min-w-0"
            :board-title="currentView === 'board' ? activeBoard?.title : 'Задача'"
            :boards="boards"
            :standalone-tasks="standaloneTasks"
            @add-task="addGeneralTask"
            @jump-to-task="handleJumpToTask"
        />
      </div>

      <!-- Board view -->
      <!-- Single global bubble-menu outside draggable, tracks activeEditor -->
      <bubble-menu
          v-if="activeEditor"
          :editor="activeEditor"
          :tippy-options="{ duration: 100, placement: 'top' }"
          class="flex bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 overflow-hidden items-center z-[200]"
      >
        <button @click="activeEditor.chain().focus().toggleHeading({ level: 1 }).run()" :class="{ 'bg-gray-100 dark:bg-gray-700': activeEditor.isActive('heading', { level: 1 }) }" class="p-2 hover:bg-gray-50 dark:hover:bg-gray-700/80 text-sm font-semibold text-gray-700 dark:text-gray-200">H1</button>
        <button @click="activeEditor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'bg-gray-100 dark:bg-gray-700': activeEditor.isActive('heading', { level: 2 }) }" class="p-2 hover:bg-gray-50 dark:hover:bg-gray-700/80 text-sm font-semibold text-gray-700 dark:text-gray-200">H2</button>
        <button @click="activeEditor.chain().focus().toggleBold().run()" :class="{ 'bg-gray-100 dark:bg-gray-700': activeEditor.isActive('bold') }" class="p-2 hover:bg-gray-50 dark:hover:bg-gray-700/80 text-sm font-bold text-gray-700 dark:text-gray-200">B</button>
        <button @click="activeEditor.chain().focus().toggleItalic().run()" :class="{ 'bg-gray-100 dark:bg-gray-700': activeEditor.isActive('italic') }" class="p-2 hover:bg-gray-50 dark:hover:bg-gray-700/80 text-sm italic text-gray-700 dark:text-gray-200">I</button>
        <button @click="activeEditor.chain().focus().toggleHighlight().run()" :class="{ 'bg-gray-100 dark:bg-gray-700': activeEditor.isActive('highlight') }" class="p-2 hover:bg-gray-50 dark:hover:bg-gray-700/80 text-sm text-gray-700 dark:text-gray-200">Mark</button>
        <div class="h-4 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
        <input type="color" @input="(e) => activeEditor.chain().focus().setColor(e.target.value).run()" :value="activeEditor.getAttributes('textStyle').color || '#000000'" class="w-6 h-6 p-0 border-none cursor-pointer bg-transparent mx-1 rounded" title="Цвет текста"/>
        <div class="h-4 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
        <button @click="copySelection(activeEditor)" class="p-2 hover:bg-gray-50 dark:hover:bg-gray-700/80 text-gray-700 dark:text-gray-200 rounded transition-colors" title="Копировать">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
        </button>
      </bubble-menu>

      <div v-if="currentView === 'board' && activeBoard" class="flex gap-4 overflow-x-auto items-stretch pb-5 w-full flex-1 h-full px-0">
        <div v-for="column in activeBoard.columns" :key="column.id"
             class="flex-none w-72 sm:w-80 bg-gray-100 dark:bg-gray-900/60 rounded-xl p-4 shadow-sm border-t-4 max-h-full flex flex-col transition-colors border-x border-b border-gray-200/50 dark:border-gray-700"
             :style="{ borderTopColor: column.color || '#9ca3af' }">
          <div class="flex justify-between items-center mb-4 group/header">
            <h3 class="mt-0 text-lg font-semibold transition-colors" :style="{ color: column.color || 'inherit' }">{{ column.title }}</h3>
            <div class="flex items-center gap-2">
              <span class="text-gray-600 dark:text-gray-300 text-xs font-medium bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">{{ column.tasks.length }}</span>
              <button @click="editColumn(column)" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-opacity p-1">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
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
              @change="(evt) => onTaskChange(evt, column.id)"
          >
            <template #item="{element}">
              <div
                  :data-task-id="element.id"
                  class="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 group relative transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md overflow-hidden"
                  :class="{
                  'border-l-4 !border-l-red-500': element.priority === 'high',
                  'border-l-4 !border-l-yellow-400': element.priority === 'medium',
                  'border-l-4 !border-l-green-500': element.priority === 'low',
                }"
              >
                <!-- Priority stripe: always rendered, height 0 when no priority -->
                <div
                    class="w-full transition-all"
                    :class="{
                    'h-0.5 bg-red-500': element.priority === 'high',
                    'h-0.5 bg-yellow-400': element.priority === 'medium',
                    'h-0.5 bg-green-500': element.priority === 'low',
                    'h-0': !element.priority,
                  }"
                ></div>

                <div class="p-3">
                  <!-- Drag handle -->
                  <div class="task-handle absolute right-2 top-2 opacity-50 hover:opacity-100 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 cursor-grab active:cursor-grabbing text-gray-500 dark:text-gray-400 transition-all z-10">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9h8M8 15h8"/></svg>
                  </div>

                  <!-- Editor -->
                  <editor-content :editor="element.editor" class="focus:outline-none min-h-[40px] prose prose-sm dark:prose-invert max-w-none pr-10 pl-1 pt-1"/>

                  <!-- Badges: always rendered, hidden via v-show (no VNode branching) -->
                  <div
                      class="flex flex-wrap items-center gap-1.5 mt-2"
                      v-show="element.priority || element.deadline"
                  >
                    <span
                        v-show="element.priority"
                        class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-xs font-medium"
                        :class="{
                        'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400': element.priority === 'high',
                        'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400': element.priority === 'medium',
                        'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400': element.priority === 'low',
                      }"
                    >
                      <span class="w-2 h-2 rounded-full flex-shrink-0" :style="{ backgroundColor: priorityConfig[element.priority]?.color }"></span>
                      {{ priorityConfig[element.priority]?.label }}
                    </span>
                    <span
                        v-show="element.deadline"
                        class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-xs font-medium"
                        :class="deadlineClass(element.deadline)"
                    >
                      <svg class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                      {{ formatDeadline(element.deadline) }}
                    </span>
                  </div>

                  <!-- Footer -->
                  <div class="mt-2 text-xs text-gray-500 dark:text-gray-400 font-medium border-t border-gray-100 dark:border-gray-600 pt-2 flex justify-between items-center">
                    <span>{{ new Date(element.createdAt).toLocaleDateString('ru-RU') }}</span>
                    <div class="flex items-center gap-0.5">
                      <button @click="openTaskMeta(element, column.id)" class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-400 hover:text-accent-600 dark:hover:text-accent-400 transition-colors" title="Дедлайн и приоритет">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>
                      </button>
                      <button @click="deleteTask(column.id, element.id)" class="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1.5 bg-transparent rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Удалить">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </draggable>

          <div class="mt-2 pt-3 border-t border-gray-200 dark:border-gray-700">
            <button @click="addTask(column.id)" class="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-accent-600 dark:hover:text-accent-400 bg-transparent rounded-lg hover:bg-accent-50 dark:hover:bg-accent-900/20 transition-colors">
              <svg class="w-4 h-4 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
              Добавить карточку
            </button>
          </div>
        </div>

        <div class="flex-none w-80 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 flex items-center justify-center cursor-pointer hover:bg-accent-50 dark:hover:bg-accent-900/20 hover:border-accent-500 transition-colors group" @click="addColumn">
          <span class="text-gray-500 dark:text-gray-400 group-hover:text-accent-600 dark:group-hover:text-accent-400 font-medium flex items-center gap-2 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            Добавить колонку
          </span>
        </div>
      </div>

      <!-- Standalone task view -->
      <div v-else-if="currentView === 'task' && activeTask" class="flex-1 flex flex-col overflow-y-auto relative">
        <div class="max-w-4xl w-full mx-auto pb-10">
          <input v-model="activeTask.title" type="text" placeholder="Название задачи" class="w-full text-3xl font-bold text-gray-900 dark:text-gray-100 bg-transparent border-none focus:outline-none mb-6 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 min-h-[400px] relative" @contextmenu.prevent>
            <div class="custom-drag-handle flex items-center justify-center w-5 h-6 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-grab active:cursor-grabbing transition-colors z-50">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/></svg>
            </div>
            <bubble-menu :editor="activeTask.editor" :tippy-options="{ duration: 100 }" v-if="activeTask.editor"
                         class="flex bg-white dark:bg-gray-800 rounded shadow-lg border border-gray-200 dark:border-gray-600 overflow-hidden items-center">
              <button @click="activeTask.editor.chain().focus().toggleHeading({ level: 1 }).run()" :class="{ 'bg-gray-100 dark:bg-gray-700': activeTask.editor.isActive('heading', { level: 1 }) }" class="p-2 hover:bg-gray-50 dark:hover:bg-gray-700/80 text-sm font-semibold text-gray-700 dark:text-gray-200">H1</button>
              <button @click="activeTask.editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'bg-gray-100 dark:bg-gray-700': activeTask.editor.isActive('heading', { level: 2 }) }" class="p-2 hover:bg-gray-50 dark:hover:bg-gray-700/80 text-sm font-semibold text-gray-700 dark:text-gray-200">H2</button>
              <button @click="activeTask.editor.chain().focus().toggleBold().run()" :class="{ 'bg-gray-100 dark:bg-gray-700': activeTask.editor.isActive('bold') }" class="p-2 hover:bg-gray-50 dark:hover:bg-gray-700/80 text-sm font-bold text-gray-700 dark:text-gray-200">B</button>
              <button @click="activeTask.editor.chain().focus().toggleItalic().run()" :class="{ 'bg-gray-100 dark:bg-gray-700': activeTask.editor.isActive('italic') }" class="p-2 hover:bg-gray-50 dark:hover:bg-gray-700/80 text-sm italic text-gray-700 dark:text-gray-200">I</button>
              <button @click="activeTask.editor.chain().focus().toggleHighlight().run()" :class="{ 'bg-gray-100 dark:bg-gray-700': activeTask.editor.isActive('highlight') }" class="p-2 hover:bg-gray-50 dark:hover:bg-gray-700/80 text-sm text-gray-700 dark:text-gray-200">Mark</button>
              <div class="h-4 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
              <input type="color" @input="(event) => activeTask.editor.chain().focus().setColor(event.target.value).run()" :value="activeTask.editor.getAttributes('textStyle').color || '#000000'" class="w-6 h-6 p-0 border-none cursor-pointer bg-transparent mx-1 rounded" title="Цвет текста"/>
              <div class="h-4 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
              <button @click="copySelection(activeTask.editor)" class="p-2 hover:bg-gray-50 dark:hover:bg-gray-700/80 text-gray-700 dark:text-gray-200 rounded transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
              </button>
            </bubble-menu>
            <editor-content :editor="activeTask.editor" class="focus:outline-none prose prose-lg dark:prose-invert max-w-none"/>
          </div>
          <div class="mt-4 flex justify-end">
            <button @click="deleteStandaloneTask(activeTask.id)" class="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 bg-transparent rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors px-4 py-2 font-medium flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              Удалить задачу
            </button>
          </div>
        </div>
      </div>

      <div v-else class="flex-1 flex items-center justify-center">
        <div class="text-gray-500 dark:text-gray-400 text-xl font-medium">Выберите или создайте доску слева</div>
      </div>
    </div>

    <!-- ── Modal: Edit column ───────────────────────────────────────────── -->
    <div v-if="editingColumn" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm" @click.self="closeEditColumn">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-96 border border-gray-200 dark:border-gray-700">
        <h2 class="text-xl text-gray-900 dark:text-gray-100 mb-4 font-bold">Настройки колонки</h2>
        <div class="mb-4">
          <label class="block text-gray-700 dark:text-gray-300 text-sm mb-2 font-medium">Название</label>
          <input v-model="editColData.title" type="text" class="w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded p-2 focus:outline-none focus:ring-1 focus:ring-gray-400">
        </div>
        <div class="mb-6">
          <label class="block text-gray-700 dark:text-gray-300 text-sm mb-2 font-medium">Цвет</label>
          <input v-model="editColData.color" type="color" class="w-full h-10 border-0 bg-transparent rounded cursor-pointer">
        </div>
        <div class="flex justify-end gap-2 items-center">
          <button @click="deleteColumn(editingColumn.id)" class="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 mr-auto p-2 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Удалить колонку">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          </button>
          <button @click="closeEditColumn" class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 px-3 py-2 rounded transition-colors text-sm font-medium">Отмена</button>
          <button @click="saveColumnEdit" class="text-gray-900 dark:text-gray-100 px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium">Сохранить</button>
        </div>
      </div>
    </div>

    <!-- ── Notification panel (slide-in from left) ───────────────────── -->
    <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 -translate-x-4"
        enter-to-class="opacity-100 translate-x-0"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 translate-x-0"
        leave-to-class="opacity-0 -translate-x-4"
    >
      <div v-if="isNotifPanelOpen" class="fixed left-0 top-0 h-full w-80 z-[60] bg-white dark:bg-gray-800 shadow-2xl border-r border-gray-200 dark:border-gray-700 flex flex-col" @click.stop>
        <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
          <div>
            <h2 class="text-base font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <svg class="w-4 h-4 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
              Уведомления
            </h2>
            <p class="text-xs text-gray-400 mt-0.5">Дедлайны и напоминания</p>
          </div>
          <div class="flex items-center gap-2">
            <button v-if="notifications.length" @click="clearAllNotifications"
                    class="text-xs text-gray-400 hover:text-red-500 transition-colors px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20">
              Очистить
            </button>
            <button @click="isNotifPanelOpen = false" class="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto">
          <div v-if="notifications.length === 0" class="flex flex-col items-center justify-center h-full text-center px-6 py-16">
            <div class="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
            </div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Всё спокойно</p>
            <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">Нет просроченных или срочных задач</p>
          </div>

          <div v-else class="divide-y divide-gray-100 dark:divide-gray-700">
            <div v-for="notif in notifications" :key="notif.id"
                 class="flex items-start gap-3 px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors group"
            >
              <div class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-lg mt-0.5"
                   :class="{
                  'bg-red-100 dark:bg-red-900/30': notif.urgency === 'overdue',
                  'bg-orange-100 dark:bg-orange-900/30': notif.urgency === 'today',
                  'bg-yellow-100 dark:bg-yellow-900/30': notif.urgency === 'tomorrow',
                  'bg-blue-100 dark:bg-blue-900/30': notif.urgency === 'soon',
                }">
                <svg v-if="notif.urgency === 'overdue'" class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>
                <svg v-else-if="notif.urgency === 'today'" class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                <svg v-else-if="notif.urgency === 'tomorrow'" class="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <svg v-else class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2">
                  <p class="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-snug">{{ notif.title }}</p>
                  <button @click="dismissNotification(notif.id)"
                          class="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-gray-500 dark:hover:text-gray-300 transition-all flex-shrink-0 mt-0.5">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{{ notif.taskText }}</p>
                <div class="flex items-center gap-2 mt-1.5">
                  <span class="text-xs px-2 py-0.5 rounded-full font-medium"
                        :class="{
                      'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400': notif.urgency === 'overdue',
                      'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400': notif.urgency === 'today',
                      'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400': notif.urgency === 'tomorrow',
                      'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400': notif.urgency === 'soon',
                    }">
                    {{ notif.urgency === 'overdue' ? 'Просрочено' : notif.urgency === 'today' ? 'Сегодня' : notif.urgency === 'tomorrow' ? 'Завтра' : 'Скоро' }}
                  </span>
                  <span class="text-xs text-gray-400">{{ notif.boardTitle }} / {{ notif.columnTitle }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Summary footer -->
        <div v-if="notifications.length" class="border-t border-gray-100 dark:border-gray-700 px-5 py-3 bg-gray-50/50 dark:bg-gray-800/50">
          <div class="grid grid-cols-2 gap-2 text-center">
            <div class="py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20">
              <div class="text-sm font-bold text-red-600 dark:text-red-400">{{ notifications.filter(n => n.urgency === 'overdue').length }}</div>
              <div class="text-xs text-red-500 dark:text-red-500">Просрочено</div>
            </div>
            <div class="py-1.5 rounded-lg bg-orange-50 dark:bg-orange-900/20">
              <div class="text-sm font-bold text-orange-600 dark:text-orange-400">{{ notifications.filter(n => ['today','tomorrow'].includes(n.urgency)).length }}</div>
              <div class="text-xs text-orange-500 dark:text-orange-500">Срочно</div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
    <!-- overlay for notif panel -->
    <div v-if="isNotifPanelOpen" class="fixed inset-0 z-[59] bg-black/20" @click="isNotifPanelOpen = false"></div>

    <!-- ── Modal: Export board ─────────────────────────────────────────── -->
    <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0 scale-95">
      <div v-if="isExportModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm" @click.self="isExportModalOpen = false">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <div>
              <h2 class="text-lg font-bold text-gray-900 dark:text-gray-100">Экспорт доски</h2>
              <p class="text-xs text-gray-400 mt-0.5">{{ activeBoard?.title }}</p>
            </div>
            <button @click="isExportModalOpen = false" class="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          <!-- Stats preview -->
          <div class="px-6 pt-5">
            <div class="grid grid-cols-3 gap-3 mb-5">
              <div class="text-center py-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                <div class="text-xl font-bold text-gray-900 dark:text-gray-100">{{ activeBoard?.columns?.length || 0 }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Колонок</div>
              </div>
              <div class="text-center py-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                <div class="text-xl font-bold text-gray-900 dark:text-gray-100">{{ activeBoard?.columns?.reduce((s, c) => s + c.tasks.length, 0) || 0 }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Задач</div>
              </div>
              <div class="text-center py-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                <div class="text-xl font-bold text-gray-900 dark:text-gray-100">{{ activeBoard?.columns?.reduce((s, c) => s + c.tasks.filter(t => t.deadline).length, 0) || 0 }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">С дедлайном</div>
              </div>
            </div>

            <p class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Выберите формат</p>
            <div class="space-y-2">
              <button @click="exportBoard('json'); isExportModalOpen = false"
                      class="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-accent-400 hover:bg-accent-50 dark:hover:bg-accent-900/20 transition-all group text-left">
                <div class="w-10 h-10 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center flex-shrink-0"><svg class="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg></div>
                <div class="flex-1">
                  <div class="text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-accent-700 dark:group-hover:text-accent-400">JSON</div>
                  <div class="text-xs text-gray-400 mt-0.5">Полный экспорт с метаданными, для импорта</div>
                </div>
                <svg class="w-4 h-4 text-gray-300 group-hover:text-accent-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              </button>
              <button @click="exportBoard('markdown'); isExportModalOpen = false"
                      class="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-accent-400 hover:bg-accent-50 dark:hover:bg-accent-900/20 transition-all group text-left">
                <div class="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0"><svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg></div>
                <div class="flex-1">
                  <div class="text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-accent-700 dark:group-hover:text-accent-400">Markdown</div>
                  <div class="text-xs text-gray-400 mt-0.5">Читаемый текст, для Notion / GitHub</div>
                </div>
                <svg class="w-4 h-4 text-gray-300 group-hover:text-accent-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              </button>
              <button @click="exportBoard('csv'); isExportModalOpen = false"
                      class="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-accent-400 hover:bg-accent-50 dark:hover:bg-accent-900/20 transition-all group text-left">
                <div class="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0"><svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18M10 3v18M14 3v18M3 6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6z"/></svg></div>
                <div class="flex-1">
                  <div class="text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-accent-700 dark:group-hover:text-accent-400">CSV</div>
                  <div class="text-xs text-gray-400 mt-0.5">Таблица для Excel / Google Sheets</div>
                </div>
                <svg class="w-4 h-4 text-gray-300 group-hover:text-accent-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              </button>
            </div>
          </div>
          <div class="px-6 py-4 mt-2">
            <button @click="isExportModalOpen = false" class="w-full py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Отмена</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ── Modal: Task meta (priority + deadline) ─────────────────────── -->
    <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
      <div v-if="editingTaskMeta" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm" @click.self="closeTaskMeta">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <h2 class="text-lg font-bold text-gray-900 dark:text-gray-100">Параметры задачи</h2>
            <button @click="closeTaskMeta" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          <div class="px-6 py-5 space-y-5">
            <!-- Priority picker -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Приоритет</label>
              <div class="grid grid-cols-4 gap-2">
                <button
                    v-for="(cfg, key) in priorityConfig" :key="key"
                    @click="taskMetaForm.priority = taskMetaForm.priority === key ? null : key"
                    class="flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-xl border-2 text-xs font-semibold transition-all"
                    :class="taskMetaForm.priority === key ? cfg.selectedClass : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500'"
                >
                  <span class="w-3 h-3 rounded-full flex-shrink-0" :style="{ backgroundColor: cfg.color }"></span>
                  <span>{{ cfg.label }}</span>
                </button>
              </div>
            </div>

            <!-- Deadline picker -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Дедлайн</label>
              <div class="flex items-center gap-2">
                <input
                    v-model="taskMetaForm.deadline"
                    type="date"
                    :min="todayStr"
                    class="flex-1 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors"
                />
                <button v-if="taskMetaForm.deadline" @click="taskMetaForm.deadline = ''"
                        class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Убрать дедлайн">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
              <!-- Quick deadline shortcuts -->
              <div class="flex gap-1.5 mt-2 flex-wrap">
                <button v-for="shortcut in deadlineShortcuts" :key="shortcut.label"
                        @click="taskMetaForm.deadline = shortcut.value"
                        class="px-2.5 py-1 text-xs rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-accent-50 dark:hover:bg-accent-900/20 hover:border-accent-400 hover:text-accent-700 dark:hover:text-accent-400 transition-all">
                  {{ shortcut.label }}
                </button>
              </div>
            </div>

            <!-- Reminder toggle -->
            <div class="flex items-center justify-between py-1">
              <div>
                <div class="text-sm font-semibold text-gray-700 dark:text-gray-300">Напоминание</div>
                <div class="text-xs text-gray-400 mt-0.5">Уведомление о приближении дедлайна</div>
              </div>
              <button @click="taskMetaForm.reminder = !taskMetaForm.reminder"
                      class="relative w-11 h-6 rounded-full transition-colors flex-shrink-0"
                      :class="taskMetaForm.reminder ? 'bg-accent-600' : 'bg-gray-200 dark:bg-gray-600'">
                <span class="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all"
                      :class="taskMetaForm.reminder ? 'left-6' : 'left-1'"></span>
              </button>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex gap-3">
            <button @click="closeTaskMeta" class="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Отмена</button>
            <button @click="saveTaskMeta" class="flex-1 py-2.5 rounded-xl bg-accent-600 text-white text-sm font-semibold hover:bg-accent-700 transition-colors shadow-sm">Сохранить</button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount, onMounted, markRaw, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import draggable from 'vuedraggable'
import BoardHeader from './BoardHeader.vue'
import { Editor, EditorContent } from '@tiptap/vue-3'
import { BubbleMenu } from '@tiptap/vue-3/menus'
import StarterKit from '@tiptap/starter-kit'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { Highlight } from '@tiptap/extension-highlight'
import { CharacterCount } from '@tiptap/extension-character-count'
import { Emoji, gitHubEmojis } from '@tiptap/extension-emoji'
import api from '../../api'
import emojiSuggestion from './emojiSuggestion.js'

const router = useRouter()
const goHome = () => router.push({ name: 'Home' })

// ── Theme ───────────────────────────────────────────────────────────────────
const isSidebarOpen = ref(window.innerWidth >= 768)
const isMobile = ref(window.innerWidth < 768)
const toggleSidebar = () => { nextTick(() => { isSidebarOpen.value = !isSidebarOpen.value }) }
const isDark = ref(false)
const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

const generateId = () => Math.random().toString(36).substr(2, 9)

// ── Toast system ────────────────────────────────────────────────────────────
const toasts = ref([])
const addToast = (message, type = 'info', title = '', duration = 4500) => {
  const id = generateId()
  toasts.value.push({ id, message, type, title })
  setTimeout(() => dismissToast(id), duration)
}
const dismissToast = (id) => { toasts.value = toasts.value.filter(t => t.id !== id) }

// ── Notification center ─────────────────────────────────────────────────────
const isNotifPanelOpen = ref(false)
const isExportModalOpen = ref(false)
const notifications = ref([])

const urgentCount = computed(() =>
    notifications.value.filter(n => n.urgency === 'overdue' || n.urgency === 'today').length
)

const dismissNotification = (id) => {
  notifications.value = notifications.value.filter(n => n.id !== id)
}

const clearAllNotifications = () => {
  notifications.value = []
}

const buildNotifications = () => {
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const result = []
  boards.value.forEach(board => {
    board.columns?.forEach(col => {
      col.tasks?.forEach(task => {
        if (!task.deadline) return
        const dl = new Date(task.deadline + 'T00:00:00')
        const diff = Math.ceil((dl - today) / 86400000)
        let urgency = null
        if (diff < 0) urgency = 'overdue'
        else if (diff === 0) urgency = 'today'
        else if (diff === 1) urgency = 'tomorrow'
        else if (diff <= 3) urgency = 'soon'
        if (urgency) {
          const taskText = task.editor?.getText?.().trim().slice(0, 60) || '(без текста)'
          result.push({
            id: task.id + '_' + task.deadline,
            taskText,
            boardTitle: board.title,
            columnTitle: col.title,
            urgency,
            diff,
            title: urgency === 'overdue'
                ? `Просрочено на ${Math.abs(diff)} дн.`
                : urgency === 'today' ? 'Дедлайн сегодня!'
                    : urgency === 'tomorrow' ? 'Дедлайн завтра'
                        : `Дедлайн через ${diff} дня`
          })
        }
      })
    })
  })
  // Sort: overdue first, then today, tomorrow, soon
  const order = { overdue: 0, today: 1, tomorrow: 2, soon: 3 }
  result.sort((a, b) => order[a.urgency] - order[b.urgency] || a.diff - b.diff)
  notifications.value = result
}

// ── Priority config ─────────────────────────────────────────────────────────
const priorityConfig = {
  none:   { label: 'Нет',     color: '#9ca3af', selectedClass: 'border-gray-400 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200' },
  low:    { label: 'Низкий',  color: '#22c55e', selectedClass: 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400' },
  medium: { label: 'Средний', color: '#eab308', selectedClass: 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' },
  high:   { label: 'Высокий', color: '#ef4444', selectedClass: 'border-red-500 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400' },
}

// ── Deadline helpers ────────────────────────────────────────────────────────
const todayStr = new Date().toISOString().split('T')[0]

const deadlineShortcuts = computed(() => {
  const d = (days) => {
    const dt = new Date(); dt.setDate(dt.getDate() + days)
    return dt.toISOString().split('T')[0]
  }
  return [
    { label: 'Завтра', value: d(1) },
    { label: '3 дня',  value: d(3) },
    { label: 'Неделя', value: d(7) },
    { label: 'Месяц',  value: d(30) },
  ]
})

const deadlineClass = (deadline) => {
  if (!deadline) return ''
  const today = new Date(); today.setHours(0,0,0,0)
  const dl = new Date(deadline + 'T00:00:00')
  const diff = Math.ceil((dl - today) / 86400000)
  if (diff < 0) return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
  if (diff <= 2) return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
  if (diff <= 7) return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
  return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
}

const formatDeadline = (deadline) => {
  if (!deadline) return ''
  const today = new Date(); today.setHours(0,0,0,0)
  const dl = new Date(deadline + 'T00:00:00')
  const diff = Math.ceil((dl - today) / 86400000)
  if (diff < 0) return `Просрочено ${Math.abs(diff)} дн.`
  if (diff === 0) return 'Сегодня!'
  if (diff === 1) return 'Завтра'
  if (diff <= 7) return `Через ${diff} дн.`
  return dl.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

// ── Task meta modal ─────────────────────────────────────────────────────────
const editingTaskMeta = ref(null) // { task, columnId }
const taskMetaForm = ref({ priority: null, deadline: '', reminder: false })

const openTaskMeta = (task, columnId) => {
  editingTaskMeta.value = { task, columnId }
  taskMetaForm.value = {
    priority: task.priority || null,
    deadline: task.deadline || '',
    reminder: task.reminder || false
  }
}

const closeTaskMeta = () => { editingTaskMeta.value = null }

const saveTaskMeta = async () => {
  const { task, columnId } = editingTaskMeta.value
  task.priority = taskMetaForm.value.priority
  task.deadline = taskMetaForm.value.deadline
  task.reminder = taskMetaForm.value.reminder
  closeTaskMeta()

  if (activeBoard.value) {
    try {
      await api.put(`/boards/${activeBoard.value.id}/tasks/${task.id}`, {
        columnId,
        priority: task.priority,
        deadline: task.deadline,
        reminder: task.reminder
      })
    } catch(e) { console.warn('Ошибка сохранения параметров задачи:', e) }
  }

  // Rebuild notifications to reflect deadline changes immediately
  buildNotifications()
  addToast('Параметры задачи сохранены', 'success')
}

// ── Deadline notification checker ──────────────────────────────────────────
const checkDeadlines = () => {
  // Build notification center items
  buildNotifications()

  const today = new Date(); today.setHours(0,0,0,0)
  boards.value.forEach(board => {
    board.columns?.forEach(col => {
      col.tasks?.forEach(task => {
        if (!task.deadline || !task.reminder) return
        const dl = new Date(task.deadline + 'T00:00:00')
        const diff = Math.ceil((dl - today) / 86400000)
        const text = task.editor?.getText?.().slice(0, 40) || 'Задача'
        const notifiedKey = `notified_${task.id}_${task.deadline}`
        if (localStorage.getItem(notifiedKey)) return
        if (diff < 0) {
          addToast(`${text}...`, 'error', 'Просроченная задача', 8000)
          localStorage.setItem(notifiedKey, '1')
        } else if (diff === 0) {
          addToast(`${text}...`, 'warning', 'Дедлайн сегодня', 8000)
          localStorage.setItem(notifiedKey, '1')
        } else if (diff === 1) {
          addToast(`${text}...`, 'info', 'Дедлайн завтра', 6000)
          localStorage.setItem(notifiedKey, '1')
        }
      })
    })
  })
}

// ── Export board ────────────────────────────────────────────────────────────
const exportBoard = (format) => {
  if (!activeBoard.value) return
  const board = activeBoard.value
  const filename = `${board.title.replace(/\s+/g, '_')}`

  if (format === 'json') {
    const data = {
      title: board.title,
      exportedAt: new Date().toISOString(),
      columns: board.columns.map(col => ({
        title: col.title,
        color: col.color,
        tasks: col.tasks.map(t => ({
          text: t.editor?.getText?.() || '',
          priority: t.priority || null,
          deadline: t.deadline || null,
          createdAt: new Date(t.createdAt).toISOString()
        }))
      }))
    }
    downloadFile(`${filename}.json`, JSON.stringify(data, null, 2), 'application/json')
    addToast(`Доска "${board.title}" экспортирована в JSON`, 'success', '📥 Экспорт')

  } else if (format === 'markdown') {
    let md = `# ${board.title}\n\n> Экспортировано: ${new Date().toLocaleDateString('ru-RU')}\n\n`
    board.columns.forEach(col => {
      md += `## ${col.title} (${col.tasks.length})\n\n`
      if (col.tasks.length === 0) {
        md += '_Нет задач_\n\n'
      } else {
        col.tasks.forEach(t => {
          const text = t.editor?.getText?.() || '(без текста)'
          const priority = t.priority ? ` [${priorityConfig[t.priority]?.label}]` : ''
          const deadline = t.deadline ? ` ${t.deadline}` : ''
          md += `- ${text}${priority}${deadline}\n`
        })
        md += '\n'
      }
    })
    downloadFile(`${filename}.md`, md, 'text/markdown')
    addToast(`Доска "${board.title}" экспортирована в Markdown`, 'success', '📥 Экспорт')

  } else if (format === 'csv') {
    const rows = [['Колонка', 'Задача', 'Приоритет', 'Дедлайн', 'Создана']]
    board.columns.forEach(col => {
      col.tasks.forEach(t => {
        rows.push([
          `"${col.title}"`,
          `"${(t.editor?.getText?.() || '').replace(/"/g, '""')}"`,
          `"${priorityConfig[t.priority]?.label || ''}"`,
          `"${t.deadline || ''}"`,
          `"${new Date(t.createdAt).toLocaleDateString('ru-RU')}"`
        ])
      })
    })
    downloadFile(`${filename}.csv`, rows.map(r => r.join(',')).join('\n'), 'text/csv')
    addToast(`Доска "${board.title}" экспортирована в CSV`, 'success', '📥 Экспорт')
  }
}

const downloadFile = (filename, content, mime) => {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

// ── Boards + data ───────────────────────────────────────────────────────────
const boards = ref([])
const activeBoardId = ref(null)

const loadBoards = async () => {
  try {
    const response = await api.get('/boards');
    const fetchedBoards = response.data;
    boards.value = fetchedBoards.map(board => ({
      ...board,
      columns: board.columns ? board.columns.map(col => ({
        ...col,
        tasks: col.tasks ? col.tasks.map(task => ({
          ...task,
          editor: createEditor(task.content || '<p></p>', task.id)
        })) : []
      })) : []
    }));
    if (boards.value.length > 0 && !activeBoardId.value) {
      activeBoardId.value = boards.value[0].id;
    }
  } catch (error) {
    boards.value = [
      {
        id: 'b1',
        title: 'Моя первая доска (локальная)',
        columns: [
          {
            id: 'c1', title: 'К выполнению', color: '#3b82f6',
            tasks: [
              { id: 't1', editor: createEditor('<p><strong>Создать дизайн</strong> доски</p>'), createdAt: Date.now(), priority: 'high', deadline: deadlineShortcuts.value[0].value, reminder: true },
              { id: 't4', editor: createEditor('<p>Настроить WebSockets</p>'), createdAt: Date.now(), priority: 'medium', deadline: '', reminder: false }
            ]
          },
          {
            id: 'c2', title: 'В процессе', color: '#f59e0b',
            tasks: [
              { id: 't2', editor: createEditor('<p>Настроить авторизацию</p>'), createdAt: Date.now(), priority: 'high', deadline: '', reminder: false }
            ]
          },
          {
            id: 'c3', title: 'Готово', color: '#10b981',
            tasks: [
              { id: 't3', editor: createEditor('<p>Инициализировать проект</p>'), createdAt: Date.now(), priority: 'low', deadline: '', reminder: false }
            ]
          }
        ]
      }
    ]
  }
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark') { isDark.value = true; document.documentElement.classList.add('dark') }
  else if (savedTheme === 'light') { isDark.value = false; document.documentElement.classList.remove('dark') }
  else if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) { isDark.value = true; document.documentElement.classList.add('dark') }

  loadBoards().then(() => {
    // Check deadlines after boards loaded, with small delay for UX
    setTimeout(checkDeadlines, 1500)
  })
})

const activeBoard = computed(() => boards.value.find(b => b.id === activeBoardId.value))

const createEditor = (content, taskId = null) => {
  const editor = markRaw(new Editor({
    extensions: [
      StarterKit, TextStyle, Color, Highlight,
      CharacterCount.configure({ limit: 10000 }),
      Emoji.configure({ emojis: gitHubEmojis, forceFallbackImages: true, enableEmoticons: true, suggestion: emojiSuggestion }),
    ],
    content,
    editorProps: {
      attributes: { class: 'prose prose-sm dark:prose-invert xl:prose-base m-1 focus:outline-none max-h-48 overflow-y-auto pl-6 relative' },
    },
    onFocus: () => { activeEditor.value = editor },
    onBlur: async ({ editor }) => {
      if (activeEditor.value === editor) activeEditor.value = null
      if (taskId && activeBoard.value) {
        try {
          await api.put(`/boards/${activeBoard.value.id}/tasks/${taskId}`, {
            content: editor.getHTML()
          })
        } catch(e) { console.warn('Автосохранение текста не удалось:', e) }
      }
    },
  }))
  return editor
}

const newBoardTitle = ref('')
const newBoardTemplate = ref('basic')
const boardTemplates = [
  { id: 'empty', name: 'Пустая доска', columns: [] },
  { id: 'basic', name: 'Базовый Канбан', columns: ['К выполнению', 'В процессе', 'Готово'] },
  { id: 'dev', name: 'Разработка ПО', columns: ['Бэклог', 'В планах', 'В работе', 'Ревью', 'Готово'] },
  { id: 'week', name: 'Недельный план', columns: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Выходные'] },
  { id: 'marketing', name: 'Маркетинг', columns: ['Идеи', 'В производстве', 'На проверке', 'Опубликовано'] }
]

const addBoard = async () => {
  if (newBoardTitle.value.trim()) {
    const template = boardTemplates.find(t => t.id === newBoardTemplate.value) || boardTemplates[1];
    const columns = template.columns.map((title, index) => ({ title, order: index, tasks: [] }));
    try {
      const response = await api.post('/boards', { title: newBoardTitle.value.trim(), columns });
      const newBoard = response.data;
      if (newBoard.columns) {
        newBoard.columns.forEach(col => {
          if (col.tasks) col.tasks.forEach(task => { task.editor = createEditor(task.content || '', task.id) })
          else col.tasks = []
        })
      }
      boards.value.push(newBoard)
      activeBoardId.value = newBoard.id
      currentView.value = 'board'
      newBoardTitle.value = ''
      addToast(`Доска "${newBoard.title}" создана`, 'success')
    } catch (e) {
      const id = generateId()
      boards.value.push({ id, title: newBoardTitle.value.trim(), columns: columns.map(c => ({ ...c, id: generateId(), tasks: [] })) })
      activeBoardId.value = id
      currentView.value = 'board'
      newBoardTitle.value = ''
      addToast('Доска создана локально', 'info')
    }
  }
}

const currentView = ref('board')
const selectBoard = (id) => { activeBoardId.value = id; currentView.value = 'board' }

const standaloneTasks = ref([])
const activeTaskId = ref(null)
const activeTask = computed(() => standaloneTasks.value.find(t => t.id === activeTaskId.value))
const isTasksOpen = ref(true)

const activeEditor = ref(null)

const onTaskChange = async (evt, columnId) => {
  if (evt.added && activeBoard.value) {
    const task = evt.added.element
    if (!task) return
    try {
      await api.put(`/boards/${activeBoard.value.id}/tasks/${task.id}`, { columnId, order: evt.added.newIndex })
    } catch(e) { console.warn('Ошибка при перемещении задачи', e) }
  } else if (evt.moved && activeBoard.value) {
    const task = evt.moved.element
    if (!task) return
    try {
      await api.put(`/boards/${activeBoard.value.id}/tasks/${task.id}`, { columnId, order: evt.moved.newIndex })
    } catch(e) { console.warn('Ошибка при изменении порядка задачи', e) }
  }
}

const copySelection = (editor) => {
  if (!editor) return
  const { from, to } = editor.state.selection
  const text = editor.state.doc.textBetween(from, to, ' ')
  if (text) navigator.clipboard.writeText(text).catch(err => console.error('Copy failed', err))
}

const selectTask = (id) => { activeTaskId.value = id; currentView.value = 'task' }

const addColumn = async () => {
  if (activeBoard.value) {
    const title = prompt('Название колонки:')
    if (title?.trim()) {
      try {
        const response = await api.post(`/boards/${activeBoard.value.id}/columns`, { title: title.trim(), color: '#9ca3af' });
        activeBoard.value.columns.push({ ...response.data, tasks: [] });
      } catch (e) {
        activeBoard.value.columns.push({ id: generateId(), title: title.trim(), color: '#9ca3af', tasks: [] })
      }
    }
  }
}

const editingColumn = ref(null)
const editColData = ref({ title: '', color: '#9ca3af' })
const editColumn = (column) => { editingColumn.value = column; editColData.value = { title: column.title, color: column.color || '#9ca3af' } }
const closeEditColumn = () => { editingColumn.value = null }

const saveColumnEdit = async () => {
  if (editingColumn.value && activeBoard.value) {
    const col = activeBoard.value.columns.find(c => c.id === editingColumn.value.id)
    if (col) {
      try { await api.put(`/boards/${activeBoard.value.id}/columns/${col.id}`, { title: editColData.value.title, color: editColData.value.color }) } catch {}
      col.title = editColData.value.title
      col.color = editColData.value.color
    }
    closeEditColumn()
  }
}

const deleteColumn = async (columnId) => {
  if (confirm('Вы уверены, что хотите удалить эту колонку со всеми задачами?')) {
    if (activeBoard.value) {
      try { await api.delete(`/boards/${activeBoard.value.id}/columns/${columnId}`) } catch {}
      activeBoard.value.columns = activeBoard.value.columns.filter(c => c.id !== columnId)
    }
    closeEditColumn()
  }
}

const addTask = async (columnId) => {
  const column = activeBoard.value.columns.find(c => c.id === columnId)
  if (column) {
    try {
      const response = await api.post(`/boards/${activeBoard.value.id}/tasks`, { columnId, content: '<p>Новая задача...</p>' });
      const newTask = { ...response.data, priority: null, deadline: '', reminder: false };
      newTask.editor = createEditor(response.data.content, newTask.id);
      column.tasks.push(newTask);
    } catch (e) {
      const tempId = generateId();
      column.tasks.push({ id: tempId, editor: createEditor('<p>Новая задача...</p>', tempId), createdAt: Date.now(), priority: null, deadline: '', reminder: false })
    }
  }
}

const addGeneralTask = async () => {
  const newTaskId = generateId()
  standaloneTasks.value.push({ id: newTaskId, title: 'Новая задача', editor: createEditor('<p>Начните писать здесь...</p>'), createdAt: Date.now() })
  activeTaskId.value = newTaskId
  currentView.value = 'task'
}

const deleteStandaloneTask = (id) => {
  if (confirm('Вы уверены?')) {
    const index = standaloneTasks.value.findIndex(t => t.id === id)
    if (index !== -1) {
      const task = standaloneTasks.value[index]
      const editorObj = task.editor
      task.editor = null
      standaloneTasks.value.splice(index, 1)
      if (editorObj && !editorObj.isDestroyed) {
        setTimeout(() => {
          try { editorObj.destroy() } catch(e){}
        }, 100)
      }
      if (standaloneTasks.value.length > 0) activeTaskId.value = standaloneTasks.value[0].id
      else currentView.value = 'board'
    }
  }
}

const deleteTask = async (columnId, taskId) => {
  const column = activeBoard.value.columns.find(c => c.id === columnId)
  if (column) {
    try { await api.delete(`/boards/${activeBoard.value.id}/tasks/${taskId}`) } catch (e) {
      console.warn('Ошибка при удалении:', e)
    }
    const index = column.tasks.findIndex(t => t.id === taskId)
    if (index !== -1) {
      const task = column.tasks[index]
      const editorObj = task.editor
      task.editor = null
      column.tasks.splice(index, 1)
      if (editorObj && !editorObj.isDestroyed) {
        setTimeout(() => {
          try { editorObj.destroy() } catch(e){}
        }, 100)
      }
    }
  }
}

const handleJumpToTask = ({ boardId, columnId, taskId, isStandalone }) => {
  if (isStandalone) {
    activeTaskId.value = taskId
    currentView.value = 'task'
  } else {
    activeBoardId.value = boardId
    currentView.value = 'board'
    setTimeout(() => {
      const el = document.querySelector(`[data-task-id="${taskId}"]`)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        el.classList.add('ring-2', 'ring-accent-500', 'ring-offset-2')
        setTimeout(() => el.classList.remove('ring-2', 'ring-accent-500', 'ring-offset-2'), 2000)
      }
    }, 150)
  }
}

onBeforeUnmount(() => {
  boards.value.forEach(board => { board.columns.forEach(column => { column.tasks.forEach(task => { if (task.editor && !task.editor.isDestroyed) { setTimeout(() => { try { task.editor.destroy() } catch(e){} }, 100) } }) }) })
  standaloneTasks.value.forEach(task => { if (task.editor && !task.editor.isDestroyed) { setTimeout(() => { try { task.editor.destroy() } catch(e){} }, 100) } })
})
</script>

<style scoped>
.sortable-fallback { opacity: 1 !important; transform: rotate(1deg) scale(1.02) !important; box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25) !important; cursor: grabbing !important; z-index: 50 !important; }
.sortable-ghost { opacity: 0.3 !important; border: 2px dashed #9ca3af !important; border-radius: 0.5rem !important; transform: scale(0.95) !important; }
:global(.dark) .sortable-ghost { border-color: #6b7280 !important; }
.sortable-drag { visibility: hidden !important; }
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background-color: #d1d5db; border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background-color: #9ca3af; }
:global(.dark) ::-webkit-scrollbar-thumb { background-color: #4b5563; }
:global(.dark) ::-webkit-scrollbar-thumb:hover { background-color: #6b7280; }
* { scrollbar-width: thin; scrollbar-color: #d1d5db transparent; }
:global(.dark) * { scrollbar-color: #4b5563 transparent; }
.prose :deep(p) { margin: 0; }
.prose :deep(strong) { font-weight: 700; }
.prose :deep(h1), .prose :deep(h2), .prose :deep(h3) { margin: 0; font-weight: 600; }
</style>

