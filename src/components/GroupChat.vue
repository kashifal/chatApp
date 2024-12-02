<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { chatService } from '../services/api'

const authStore = useAuthStore()
const groups = ref<Array<{ id: number; name: string }>>([])
const selectedGroup = ref<number | null>(null)
const newGroupName = ref('')
const message = ref('')
const messages = ref<Array<{ from: string; message: string }>>([])
const showCreateModal = ref(false)

onMounted(async () => {
  await fetchGroups()
})

async function fetchGroups() {
  try {
    const response = await chatService.getGroups()
    groups.value = response.data
  } catch (err) {
    console.error('Failed to fetch groups:', err)
  }
}

async function createGroup() {
  if (!newGroupName.value) return
  
  try {
    await chatService.createGroup(authStore.token!, newGroupName.value, [])
    showCreateModal.value = false
    newGroupName.value = ''
    await fetchGroups()
  } catch (err) {
    console.error('Failed to create group:', err)
  }
}

async function joinGroup(groupId: number) {
  try {
    await chatService.joinGroup(authStore.token!, groupId)
    selectedGroup.value = groupId
  } catch (err) {
    console.error('Failed to join group:', err)
  }
}

async function sendMessage() {
  if (!message.value || !selectedGroup.value) return
  
  try {
    await chatService.sendGroupMessage(
      authStore.token!,
      selectedGroup.value,
      message.value
    )
    message.value = ''
  } catch (err) {
    console.error('Failed to send message:', err)
  }
}
</script>

<template>
  <div class="h-full flex flex-col">
    <div class="mb-4 flex justify-between items-center">
      <h2 class="text-xl font-bold">Groups</h2>
      <button
        @click="showCreateModal = true"
        class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        Create Group
      </button>
    </div>

    <div class="grid grid-cols-3 gap-4 mb-4">
      <div
        v-for="group in groups"
        :key="group.id"
        class="p-4 border rounded hover:shadow-lg cursor-pointer"
        :class="{ 'bg-indigo-100': selectedGroup === group.id }"
        @click="joinGroup(group.id)"
      >
        <h3 class="font-bold">{{ group.name }}</h3>
      </div>
    </div>

    <div v-if="selectedGroup" class="flex-1 flex flex-col">
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
            <p class="text-sm font-bold">{{ msg.from }}</p>
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
        >
          Send
        </button>
      </div>
    </div>

    <!-- Create Group Modal -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div class="bg-white p-6 rounded-lg w-96">
        <h3 class="text-lg font-bold mb-4">Create New Group</h3>
        <input
          v-model="newGroupName"
          type="text"
          class="w-full p-2 border rounded mb-4"
          placeholder="Group name"
        />
        <div class="flex justify-end space-x-2">
          <button
            @click="showCreateModal = false"
            class="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            @click="createGroup"
            class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  </div>
</template> 