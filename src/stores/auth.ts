import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const username = ref<string | null>(null)

  function setAuth(newToken: string, user: string) {
    token.value = newToken
    username.value = user
  }

  function clearAuth() {
    token.value = null
    username.value = null
  }

  return { token, username, setAuth, clearAuth }
}) 