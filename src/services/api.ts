import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:50001',
  headers: {
    'Content-Type': 'application/json'
  }
})

export const authService = {
  login: (username: string, password: string) => 
    api.post('/user/login', { username, password }),
  
  register: (username: string, password: string) => 
    api.post('/user/register', { username, password }),
    
  logout: (token: string) => 
    api.post('/user/logout', { token })
}

export const chatService = {
  // Single Chat
  sendMessage: (token: string, username: string, message: string) =>
    api.post('/chat/send', { token, username, message }),
    
  pollMessages: (token: string) =>
    api.post('/chat/poll', { token }),

  // Group Chat
  getGroups: () => 
    api.get('/chatroom'),
    
  createGroup: (token: string, chatroomName: string, clients: string[]) =>
    api.post('/chatroom/create', { token, chatroomName, clients }),
    
  joinGroup: (token: string, chatroomId: number) =>
    api.post('/chatroom/join', { token, chatroomId }),
    
  sendGroupMessage: (token: string, chatroomId: number, message: string) =>
    api.post('/chat/send', { token, chatroomId, message }),
    
  leaveGroup: (token: string, chatroomId: number) =>
    api.post('/chatroom/leave', { token, chatroomId }),
    
  getGroupMembers: (token: string, chatroomId: number) =>
    api.post('/chatroom/users', { token, chatroomId })
}

export const userService = {
  getAllUsers: () => 
    api.get('/users'),
    
  getOnlineUsers: () => 
    api.get('/users/online')
} 