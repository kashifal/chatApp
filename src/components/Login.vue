<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { authService } from '../services/api'

const router = useRouter()
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const authStore = useAuthStore()

async function handleLogin() {
  try {
    const response = await authService.login(username.value, password.value)
    authStore.setAuth(response.data.token, username.value)
    router.push('/chat')
  } catch (err) {
    error.value = 'Login failed'
  }
}

async function handleSignup() {
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match!'
    return
  }

  try {
    const response = await fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
        token: Math.random().toString(36).substring(2),
        online: true
      })
    })

    if (!response.ok) {
      throw new Error('Signup failed')
    }

    const userData = await response.json()
    
    authStore.setToken(userData.token)
    router.push('/chat')
  } catch (error) {
    console.error('Signup error:', error)
    error.value = 'Failed to sign up. Please try again.'
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-6xl w-full   p-8  rounded-lg grid gap-12 grid-cols-2 shadow">
      <div class="bg-white p-8 rounded-lg">
        <h2 class="text-center text-3xl font-extrabold pb-12 text-gray-900">Sign in</h2>
      
      <form @submit.prevent="handleLogin" class=" space-y-6">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <input
              v-model="username"
              type="text"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Username"
            />
          </div>
          <div>
            <input
              v-model="password"
              type="password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Password"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign in
          </button>
        </div>
      </form>
      </div>
      
    <div class="bg-white p-8 rounded-lg">
      <h2 class="text-center text-3xl font-extrabold pb-12 text-gray-900 ">Sign Up</h2>
      
      <form @submit.prevent="handleSignup" class=" space-y-6">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <input
              v-model="username"
              type="text"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Username"
            />
          </div>
          <div>
            <input
              v-model="password"
              type="password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Password"
            />
          </div>
          <div>
            <input
              v-model="confirmPassword"
              type="password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Confirm Password"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign up
          </button>
        </div>
      </form>
    </div>
      
      <p v-if="error" class="mt-2 text-center text-sm text-red-600">
        {{ error }}
      </p>
    </div>
  </div>
</template> 