<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// Check for existing token in localStorage on app mount
onMounted(() => {
  const savedToken = localStorage.getItem('token')
  const savedUsername = localStorage.getItem('username')
  if (savedToken && savedUsername) {
    authStore.setAuth(savedToken, savedUsername)
    router.push('/chat')
  } else {
    router.push('/login')
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>