import axios from '../plugins/axios'

export default {
  namespaced: true,

  state: () => ({
    socket: null,
    unreadCount: 0,
    rooms: [],
    activeRoomId: null,
    expertRoom: null,
    activeRoomMessages: [],
    pendingScroll: false
  }),

  getters: {
    rooms: state => state.rooms,
    socket: state => state.socket,
    unreadCount: state => state.unreadCount,
    activeRoomId: state => state.activeRoomId,
    activeRoomMessages: state => state.activeRoomMessages,
    expertRoom: state => state.expertRoom,
    pendingScroll: state => state.pendingScroll
  },

  actions: {
    initSocket({ commit, dispatch, getters, rootGetters }, id) {
      dispatch('closeSocket')
      const token = rootGetters['auth/token']
      const socket = new WebSocket(process.env.VUE_APP_MESSAGE_SOCKET + `?token=${token}`)
      socket.onmessage = (e) => {
        const data = JSON.parse(e.data)
        // console.log(data)
        if (data.unseen_messages) {
          commit('setUnreadCount', data.unseen_messages)
        } else if(data.id) {
          const activeRoomId = getters['activeRoomId']
          if (data.room.room_name === activeRoomId) {
            commit('appendMessage', data)
            commit('setPendingScroll', true)
            commit('setLastMessage', { roomId: data.room.room_name, message: data })
            commit('pushRoomToTop', data.room)
            dispatch('markAllAsRead', activeRoomId)
          } else if(getters.rooms.find(r => r.room_name === data.room.room_name)) {
            commit('addUnreadInRoom', { roomId: data.room.room_name })
            commit('setLastMessage', { roomId: data.room.room_name, message: data })
            commit('pushRoomToTop', data.room)
          } else {
            dispatch('fetchRooms')
          }
        }
      }
      socket.onclose = () => {}
      commit('updateSocket', socket)
    },

    fetchRooms({ commit, getters }) {
      return new Promise((resolve, reject) => {
        axios.get('/api/chat/get-rooms/')
          .then(response => {
            commit('setRooms', response.data)
            const unreadCount = response.data.reduce((acc, room) => acc + (room.unread_messages || 0), 0)
            commit('setUnreadCount', unreadCount)
            if (getters.expertRoom) {
              if (!response.data.find(r => r.room_name === getters.expertRoom.room_name)) {
                commit('insertRoomAtTop', getters.expertRoom)
                commit('clearExpertRoom')
              }
            }
            resolve(response.data)
          })
          .catch(error => reject(error))
      })
    },

    fetchMessages({ commit }, { room, filters = {} }) {
      return new Promise((resolve, reject) => {
        axios.get('/api/chat/get-chat/' + room + '/', { params: filters })
          .then(response => {
            commit('setMessages', response.data.result)
            resolve(response.data)
          })
          .catch(error => reject(error))
      })
    },

    loadMoreMessages({ commit, getters }, filters = {}) {
      if (!getters.activeRoomId) return Promise.reject()
      return new Promise((resolve, reject) => {
        axios.get('/api/chat/get-chat/' + getters.activeRoomId + '/', { params: filters })
          .then(response => {
            commit('setPreviousMessages', response.data.result)
            resolve(response.data)
          })
          .catch(error => reject(error))
      })
    },

    fetchOrCreateRoom({ commit }, data) {
      return new Promise((resolve, reject) => {
        axios.post('/api/chat/get-create-room/', data)
          .then(response => {
            resolve(response.data)
          })
          .catch(error => reject(error))
      })
    },

    postMessage({ getters }, { room, data }) {
      return new Promise((resolve, reject) => {
        if (getters.socket) {
          const message = { room_name: room, ...data}
          getters.socket.send(JSON.stringify(message))
          resolve()
          return
        }
        axios.post('/api/chat/add-message/' + room + '/', data)
          .then(response => {
            resolve(response.data)
          })
          .catch(error => reject(error))
      })
    },

    markAllAsRead({ commit }, roomId) {
      return new Promise((resolve, reject) => {
        axios.get('/api/chat/mark-all-as-read/' + roomId + '/')
          .then(response => {
            commit('clearUnreadInRoom', roomId)
            resolve(response.data)
          })
          .catch(error => reject(error))
      })
    },

    closeSocket({ getters }) {
      if (getters.socket) getters.socket.close()
    }
  },

  mutations: {
    setRooms(state, rooms) {
      state.rooms = rooms
    },
    setUnreadCount(state, count) {
      state.unreadCount = count
    },
    clearUnreadInRoom(state, roomId) {
      state.rooms
      .filter(room => room.room_name === roomId)
      .forEach(room => {
        state.unreadCount = Math.max(state.unreadCount - room.unread_messages, 0)
        room.unread_messages = 0
      })
    },
    addUnreadInRoom(state, { roomId, count = 1 }) {
      state.rooms
      .filter(room => room.room_name === roomId)
      .forEach(room => {
        state.unreadCount += count
        room.unread_messages += count
      })
    },
    clearMessages(state) {
      state.activeRoomMessages = []
    },
    setMessages(state, data) {
      state.activeRoomMessages = data
    },
    setPreviousMessages(state, data) {
      state.activeRoomMessages = [...state.activeRoomMessages, ...data]
    },
    appendMessage(state, data) {
      state.activeRoomMessages.unshift(data)
    },
    updateSocket(state, socket) {
      state.socket = socket
    },
    setActiveRoomId(state, id) {
      state.activeRoomId = id
    },
    setExpertRoom(state, room) {
      state.expertRoom = room
    },
    clearExpertRoom(state, room) {
      state.expertRoom = null
    },
    setLastMessage(state, { roomId, message }) {
      state.rooms
      .filter(room => room.room_name === roomId)
      .forEach(room => {
        room.last_message = message
      })
    },
    pushRoomToTop(state, room) {
      const existingIndex = state.rooms.findIndex(r => r.room_name === room.room_name) 
      if (existingIndex) {
        const [existingRoom] = state.rooms.splice(existingIndex, 1)
        state.rooms.unshift(existingRoom)
      } else {
        // state.rooms.unshift(room)
      }
    },
    insertRoomAtTop(state, room) {
      state.rooms.unshift(room)
    },
    setPendingScroll(state, value) {
      state.pendingScroll = value
    },
    reset(state) {
      state.activeRoomId = null
      state.unreadCount = 0
      state.rooms = []
      state.activeRoomMessages = []
    }
  }
}