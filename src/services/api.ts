import axios from 'axios'

const getBaseUrl = () => {
  return localStorage.getItem('apiUrl') || 'http://javaprojects.ch:50001';
};

const updateBaseUrl = () => {
  const url = localStorage.getItem('apiUrl');
  if (url) {
    api.defaults.baseURL = url;
  }
};

// Reduce polling frequency to something more reasonable
setInterval(updateBaseUrl, 0); // Check every 2 minutes

export const api = axios.create({
  baseURL: getBaseUrl(),
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
  sendMessage: (token: string, username: string, message: string) => {
    console.log('Sending message to:', username,token,message)
    return api.post('/chat/send', { token, username, message })
  },
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
    api.post('/chatroom/users', { token, chatroomId }),

  getPing: () =>
    api.get('/ping')
}

export const userService = {
  getAllUsers: () => 
    api.get('/users/online'),
    
  getOnlineUsers: () => 
    api.get('/users/online')
} 