<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden text-sm w-48 max-h-[250px] overflow-y-auto flex flex-col p-1 z-50">
    <template v-if="items.length > 0">
      <button
        v-for="(item, index) in items"
        :key="index"
        class="flex items-center gap-2 px-2 py-1.5 rounded transition-colors text-left w-full hover:bg-gray-100 dark:hover:bg-gray-700"
        :class="{ 'bg-gray-100 dark:bg-gray-700': index === selectedIndex }"
        @click="selectItem(index)"
        @mouseenter="selectedIndex = index"
      >
        <img v-if="item.fallbackImage" :src="item.fallbackImage" class="w-5 h-5 object-contain" />
        <span v-else class="text-base">{{ item.emoji }}</span>
        <span class="text-gray-700 dark:text-gray-300 font-medium truncate">:{{ item.name }}:</span>
      </button>
    </template>
    <div v-else class="text-gray-500 dark:text-gray-400 p-2 text-center text-xs">
      Нет результатов
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true,
    },
    command: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      selectedIndex: 0,
    }
  },
  watch: {
    items() {
      this.selectedIndex = 0
    },
  },
  methods: {
    onKeyDown({ event }) {
      if (event.key === 'ArrowUp') {
        this.upHandler()
        return true
      }
      if (event.key === 'ArrowDown') {
        this.downHandler()
        return true
      }
      if (event.key === 'Enter') {
        this.enterHandler()
        return true
      }
      return false
    },
    upHandler() {
      this.selectedIndex = (this.selectedIndex + this.items.length - 1) % this.items.length
    },
    downHandler() {
      this.selectedIndex = (this.selectedIndex + 1) % this.items.length
    },
    enterHandler() {
      this.selectItem(this.selectedIndex)
    },
    selectItem(index) {
      const item = this.items[index]
      if (item) {
        this.command({ name: item.name })
      }
    },
  },
}
</script>

