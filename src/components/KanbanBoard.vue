<template>
  <div class="kanban-container">
    <h1 class="kanban-title">Drag&Dropicks</h1>
    <div class="board">
      <div v-for="column in columns" :key="column.id" class="column">
        <h3 class="column-title">{{ column.title }}</h3>

        <draggable
          v-model="column.tasks"
          group="tasks"
          item-key="id"
          class="task-list"
          ghost-class="ghost-task"
        >
          <template #item="{element}">
            <div class="task-card">
              {{ element.title }}
            </div>
          </template>
        </draggable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import draggable from 'vuedraggable'

const columns = ref([
  {
    id: '1',
    title: 'К выполнению',
    tasks: [
      { id: 't1', title: 'Создать дизайн доски' },
      { id: 't4', title: 'Настроить WebSockets' }
    ]
  },
  {
    id: '2',
    title: 'В процессе',
    tasks: [
      { id: 't2', title: 'Написать базовый код' }
    ]
  },
  {
    id: '3',
    title: 'Готово',
    tasks: [
      { id: 't3', title: 'Установить Vue.js' }
    ]
  }
])
</script>

<style scoped>
.kanban-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background-color: #2b1f1a;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.kanban-title {
  color: #c7d297;
  margin-bottom: 30px;
  font-size: 2.5rem;
  letter-spacing: 1px;
}

.board {
  display: flex;
  gap: 24px;
  overflow-x: auto;
  align-items: flex-start;
  padding-bottom: 20px;
  width: 100%;
  max-width: 1200px;
}

.column {
  flex: 0 0 320px;
  background: #3e2e25; /* Slightly lighter brown for column */
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  border-top: 5px solid #6b8e23; /* Olive green top border */
}

.column-title {
  color: #a3b86c; /* Soft olive text */
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 1.25rem;
  font-weight: 600;
  text-transform: uppercase;
}

.task-list {
  min-height: 150px; /* To allow dropping on empty columns */
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-card {
  background: #f7f3e8; /* Off-white for cards to be readable */
  color: #2b1f1a; /* Dark brown text */
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  cursor: grab;
  font-weight: 500;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border-left: 4px solid #6b8e23; /* Olive accent */
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.task-card:active {
  cursor: grabbing;
}

/* Styled for the element being dragged */
:deep(.ghost-task) {
  opacity: 0.5;
  background: #c7d297; /* Olive ghost */
  border: 2px dashed #6b8e23;
}
</style>
