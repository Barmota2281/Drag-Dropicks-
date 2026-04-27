<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppFooter from './components/common/AppFooter.vue'

const route = useRoute()
const showFooter = computed(() => route.name && route.name !== 'Board')
</script>

<template>
  <div class="flex flex-col min-h-screen content-wrapper">
    <router-view class="flex-1" />
    <AppFooter v-if="showFooter" />
  </div>
</template>

<style scoped>
.content-wrapper {
  min-height: 100vh;
}
</style>
