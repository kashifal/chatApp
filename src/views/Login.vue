<template>
    <div class="min-h-screen bg-gray-100 flex items-center justify-center">
      <div class="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 class="text-2xl font-bold text-center text-gray-800 mb-8">Login</h2>
        
        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Username Input -->
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
            <input
              id="username"
              v-model="username"
              type="text"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
  
          <!-- Password Input -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
  
          <!-- Error Message -->
          <div v-if="error" class="text-red-500 text-sm text-center">
            {{ error }}
          </div>
  
          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <span v-if="isLoading">Loading...</span>
            <span v-else>Login</span>
          </button>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import axios from 'axios'
  
  const username = ref('')
  const password = ref('')
  const error = ref('')
  const isLoading = ref(false)
  
  const handleLogin = async () => {
    try {
      isLoading.value = true
      error.value = ''
  
      const response = await axios.post('http://localhost:50001/user/login', {
        username: username.value,
        password: password.value
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
  
      // Handle successful login
      const token = response.data.token
      
      // Store token in localStorage or your preferred state management solution
      localStorage.setItem('userToken', token)
      
      // Redirect to dashboard or home page
      // If using vue-router:
      // router.push('/dashboard')
      
      console.log('Login successful:', token)
  
    } catch (err) {
      error.value = err.response?.data?.message || 'Login failed. Please try again.'
      console.error('Login error:', err)
    } finally {
      isLoading.value = false
    }
  }
  </script>