import axios from "../plugins/axios";

export default {
  namespaced: true,

  state: () => ({
  }),

  getters: {
  },

  actions: {
    bookSlot ({ commit }, data) {
      return new Promise((resolve, reject) => {
        axios
          .post("/api/booked-slot/", data)
          .then((response) => {
            resolve(response)
          })
          .catch((error) => reject(error));
      });
    },
    fetchBookedSlots({ commit }, params) {
      return new Promise((resolve, reject) => {
        axios
          .get('/api/booked-slot/', { params })
          .then(response => {
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    fetchAvailableSlots({ commit }, data) {
      return new Promise((resolve, reject) => {
        axios
          // .post('/api/available-slots/', data)
          .post('/api/get-availabilities/', data)
          .then(response => {
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    fetchAvailability({}, data) {
      return new Promise((resolve, reject) => {
        axios
          // .get('/api/availabilities/')
          .get('/api/schedules/')
          .then(response => {
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    create({}, data) {
      return new Promise((resolve, reject) => {
        axios
          .post(`/api/schedules/`, data)
          .then(response => {
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    updateAvailability({}, data) {
      return new Promise((resolve, reject) => {
        const { id, ...fields } = data
        axios
          // .post('/api/available-slot-update-all/', data)
          // .post('/api/availabilities/', data)
          .patch(`/api/schedules/${id}/`, { ...fields })
          .then(response => {
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    deleteAvailability({}, id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`/api/schedules/${id}/`)
          .then(response => {
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

  }
}