import axios from '../plugins/axios'

export default {
  namespaced: true,

  state: () => ({
    notifications: [],
    socket: null,
    unreadCount: 0
  }),

  getters: {
    notifications: state => state.notifications,
    socket: state => state.socket,
    unreadCount: state => state.unreadCount
  },

  actions: {
    fetchNotifications({ commit, dispatch, rootGetters }) {
      return new Promise((resolve, reject) => {
        axios.get('/api/notifications/',{ params: { limit: 20, offset: 0 } })
          .then(response => {
            commit('setNotifications', response.data)
            resolve(response.data)
          })
          .catch(error => reject(error))
      })
    },

    initSocket({ commit, dispatch, rootGetters }, id) {
      dispatch('closeSocket')
      const token = rootGetters['auth/token']
      const socket = new WebSocket(process.env.VUE_APP_NOTIFICATION_SOCKET + `?token=${token}`)
      socket.onmessage = (e) => {
        const data = JSON.parse(e.data)
        // console.log(data)
        if (data.unseen_notifications) {
          commit('setUnreadCount', data.unseen_notifications)
        } else if(data.action) {
          commit('appendNotification', data)
          commit('incrementUnreadCount')
        }
      }
      socket.onclose = () => {}
      commit('updateSocket', socket)
    },

    markAllAsRead({ commit }) {
      return new Promise((resolve, reject) => {
        axios.get('/api/mark-notifications-read/')
          .then(response => {
            commit('clearUnreadCount')
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
    setNotifications(state, notifications) {
      state.notifications = notifications
    },
    updateSocket(state, socket) {
      state.socket = socket
    },
    appendNotification(state, data) {
      state.notifications.unshift(data)
    },
    setUnreadCount(state, count) {
      state.unreadCount = count
    },
    clearUnreadCount(state) {
      state.unreadCount = 0
    },
    incrementUnreadCount(state) {
      state.unreadCount += 1
    },
    reset(state) {
      state.notifications = []
      state.unreadCount = 0
    }
  }
}