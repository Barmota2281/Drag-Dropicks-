<template>
  <AppNav />
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppNav from './AppNav.vue'

const router = useRouter()
const isMenuOpen = ref(false)

const openProfile = () => {
  isMenuOpen.value = false
  router.push('/profile')
}

const openSettings = () => {
  isMenuOpen.value = false
  router.push('/settings')
}

const switchAccount = () => {
  isMenuOpen.value = false
  alert('Смена аккаунта...')
}

const logout = () => {
  isMenuOpen.value = false
  localStorage.removeItem('token')
  router.push('/login')
}
</script>
