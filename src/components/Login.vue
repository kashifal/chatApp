<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { authService, chatService, api } from '../services/api'
 

const port = ref(false);
const urlInput = ref('')
const ping = ref(false)

const router = useRouter()
const username = ref('')
const password = ref('')
const signupUsername = ref('')
const signupPassword = ref('')
const confirmPassword = ref('')
const error = ref('')
const authStore = useAuthStore()

async function handleLogin() {
  try {
    const response = await authService.login(username.value, password.value)
    console.log(response);
    authStore.setAuth(response.data.token, username.value)

    router.push('/chat')
  } catch (err) {
    error.value = 'Login failed'
  }
}

async function handleSignup() {
  if (signupPassword.value !== confirmPassword.value) {
    error.value = 'Passwords do not match!'
    return
  }

  try {
    const port = localStorage.getItem('apiPort') || '50001';
    const response = await fetch(`http://javaprojects.ch:${port}/user/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: signupUsername.value,
        password: signupPassword.value,
        token: Math.random().toString(36).substring(2),
        online: true
      })
    })

    
   
    if (!response.ok) {
      throw new Error('Signup failed')
    }

    const userData = await response.json()
    console.log(userData);
    return;
    // authStore.setToken(userData.token)
    // authStore.setAuth( userData.token, username.value)
    router.push('/chat')
  } catch (error) {
    console.error('Signup error:', error)
    error.value = 'Failed to sign up. Please try again.'
  }
}

async function handleUrlSubmit() {
  try {
    // Validate URL
    new URL(urlInput.value); // This will throw if URL is invalid
    
    // Store the full URL
    localStorage.setItem('apiUrl', urlInput.value);
    
    // Update API base URL
    api.defaults.baseURL = urlInput.value;

    // Test connection
    const response = await chatService.getPing();
    ping.value = response.data.ping;
    if(ping.value) {
      port.value = true;
    }
  } catch (error) {
    console.error('Invalid URL or connection failed:', error);
    ping.value = false;
  }
}
</script>

<template>
 
  <div   :class="[ping ? 'min-h-screen flex flex-col border-8 border-green-500 flex items-center justify-center gap-4 bg-gray-50' : 'min-h-screen flex flex-col  gap-4 border-8 border-red-500 flex items-center justify-center bg-gray-50']">

    <div   class="flex max-w-2xl w-full gap-2 rounded-lg justify-center p-12 bg-white flex flex-col items-center">
      <h2 class="text-center text-3xl font-extrabold p-3 text-gray-900">Port <small class="text-gray-500 font-normal text-sm">(Example: 50001)</small></h2>
      <input 
      class="py-2 px-4 bg-gray-100 w-full rounded-md"
        v-model="urlInput"
        type="text"
        placeholder="Enter API URL (e.g., http://javaprojects.ch:50001)"
      />
      <button class="bg-indigo-600 py-2 px-4 rounded-md text-white" @click="handleUrlSubmit">Connect</button>
      <p>Port is {{ ping ? 'online' : 'offline' }}</p>
    </div>
    <div  class="max-w-6xl w-full   p-8  rounded-lg grid gap-12 grid-cols-2 shadow">
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
              v-model="signupUsername"
              type="text"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Username"
            />
          </div>
          <div>
            <input
              v-model="signupPassword"
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