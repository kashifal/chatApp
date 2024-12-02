<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { authService, chatService } from '../services/api'
 

const port = ref(false);
const portInput = ref('');

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

const ping = ref(false);
async function handlePortSubmit() {
  localStorage.setItem('apiPort', portInput.value);
 

  const response =  await chatService.getPing();
  console.log(response);
  ping.value = response.data.ping;
  if(ping.value){
    router.push('/login');
    port.value = true;
  }
}
</script>

<template>
 
  <div   :class="[ping ? 'min-h-screen border-2 border-green-500 flex items-center justify-center bg-gray-50' : 'min-h-screen border-2 border-red-500 flex items-center justify-center bg-gray-50']">

    <div v-if="!port" class="flex max-w-2xl w-full gap-2 rounded-lg justify-center p-12 bg-white flex flex-col items-center">
      <h2 class="text-center text-3xl font-extrabold p-3 text-gray-900">Port <small class="text-gray-500 font-normal text-sm">(Example: 50001)</small></h2>
      <input type="text" placeholder="Enter Port" required class="bg-gray-100 max-w-2xl px-6 py-2 w-full rounded-lg" v-model="portInput" name="" id="">
      <button :disabled="!portInput" @click="handlePortSubmit" :class="portInput ? 'bg-indigo-600 text-white px-4 py-2 rounded-lg' : 'bg-gray-300 cursor-not-allowed text-gray-600 px-4 py-2 rounded-lg'  ">Enter Port</button>
    </div>
    <div v-else class="max-w-6xl w-full   p-8  rounded-lg grid gap-12 grid-cols-2 shadow">
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