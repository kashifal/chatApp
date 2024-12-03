<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { chatService, userService } from '../services/api'

const authStore = useAuthStore()
const users = ref<string[]>([])
const selectedUser = ref('')
const message = ref('')
const messages = ref<Array<{ from: string; message: string }>>([])
let pollInterval: number


onMounted(async () => {
  const fetchUsers = async () => {
    try {
      const response = await userService.getAllUsers()
      console.log(response.data.online)
      users.value = response.data.online.filter((user: string) => user !== authStore.username)
    } catch (err) {
      console.error('Failed to fetch users:', err)
    }
  }

  try {
    await fetchUsers()
    startPolling()
    setInterval(fetchUsers, 1000)
  } catch (err) {
    console.error('Failed to fetch users:', err) 
  }
})

onUnmounted(() => {
  clearInterval(pollInterval)
})

function startPolling() {
  pollInterval = setInterval(async () => {
    //response example {messages: [{message: 'Hi', username: 'kashif' }]}
    try {
      const response = await chatService.pollMessages(authStore.token!)
      if (response.data.messages) {
        messages.value = [...messages.value, ...response.data.messages]
      }
    } catch (err) {
      console.error('Polling failed:', err)
    }
  }, 1000)
}

async function sendMessage() {
  if (!message.value || !selectedUser.value) return
  
  try {
    const response = await chatService.sendMessage(
      authStore.token!,
      selectedUser.value, 
      message.value
    )
    console.log('Send message response:', response)
    
    if (response.data.send) {
      // Add message to messages array with correct sender
      const newMessage = {
        from: authStore.username,
        message: message.value
      }
      messages.value.push(newMessage)
      
      // Store messages in localStorage
      localStorage.setItem('chatMessages', JSON.stringify(messages.value))
    }
    
    message.value = ''
  } catch (err) {
    console.error('Failed to send message:', err)
  }
}
</script>

<template>
  <div class="h-full flex flex-col">
    
    <div class="mb-4">
      <select
        v-model="selectedUser"
        class="w-full p-2 border rounded"
      >
        <option value="">Select a user</option>
        <option v-for="user in users" :key="user" :value="user">
          {{ user }}
        </option>
      </select>
    </div>

    <div class="flex-1 border rounded p-4 mb-4 overflow-y-auto">
      <div v-for="(msg, index) in messages" :key="index" class="mb-2">
        <div
          :class="[
            'p-2 rounded max-w-xs',
            msg.from === authStore.username
              ? 'bg-indigo-600 text-white ml-auto'
              : 'bg-gray-200'
          ]"
        >
          <div class="rounded-full my-2 h-8 w-8 flex items-center justify-center bg-gray-300 text-gray-600 text-xs">{{ msg.username }}</div>
         
          <p>{{ msg.message }}</p>
        </div>
      </div>
    </div>

    <div class="flex space-x-2">
      <input
        v-model="message"
        type="text"
        class="flex-1 p-2 border rounded"
        placeholder="Type a message..."
        @keyup.enter="sendMessage"
      />
      <button
        @click="sendMessage"
        class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        :disabled="!selectedUser"
      >
        Send
      </button>
    </div>
  </div>
</template> 