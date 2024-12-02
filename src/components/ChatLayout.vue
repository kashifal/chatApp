<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { authService } from '../services/api'
import SingleChat from './SingleChat.vue'
import GroupChat from './GroupChat.vue'

const router = useRouter()
const activeTab = ref('single')
const authStore = useAuthStore()

async function handleLogout() {
  try {
    if (authStore.token) {
      await authService.logout(authStore.token)
    }
    authStore.clearAuth()
    router.push('/login')
  } catch (err) {
    console.error('Logout failed:', err)
    // Still clear auth and redirect even if the API call fails
    authStore.clearAuth()
    router.push('/login')
  }
}
</script>

<template>
  <div class="h-screen flex flex-col">
    <header class="bg-indigo-600 text-white p-4 flex justify-between items-center">
      <h1 class="text-xl font-bold">Chat App</h1>
      <div class="flex items-center space-x-4">
        <span>{{ authStore.username }}</span>
        <button
          @click="handleLogout"
          class="px-3 py-1 rounded bg-indigo-700 hover:bg-indigo-800"
        >
          Logout
        </button>
      </div>
    </header>

    <div class="flex-1 flex">
      <nav class="w-64 bg-gray-100 p-4">
        <div class="space-y-2">
          <button
            @click="activeTab = 'single'"
            :class="[
              'w-full p-2 text-left rounded',
              activeTab === 'single' ? 'bg-indigo-600 text-white' : 'hover:bg-gray-200'
            ]"
          >
            Single Chat
          </button>
          <button
            @click="activeTab = 'group'"
            :class="[
              'w-full p-2 text-left rounded',
              activeTab === 'group' ? 'bg-indigo-600 text-white' : 'hover:bg-gray-200'
            ]"
          >
            Group Chat
          </button>
        </div>
      </nav>

      <main class="flex-1 p-4">
        <SingleChat v-if="activeTab === 'single'" />
        <GroupChat v-else />
      </main>
    </div>
  </div>
</template> 