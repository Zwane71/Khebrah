import axios from "../plugins/axios";

export default {
  namespaced: true,

  state: () => ({
  }),

  getters: {
  },

  actions: {
    getOrder({ commit }, id) {
      return new Promise((resolve, reject) => {
        axios
          .get("/api/order-detail/" + id + "/")
          .then((response) => {
            resolve(response.data)
          })
          .catch((error) => {
            reject(error)
          });
      });
    },
    reportOrder({ commit }, data) {
      return new Promise((resolve, reject) => {
        axios
          .post("/api/report/", data)
          .then((response) => {
            resolve(response.data)
          })
          .catch((error) => {
            reject(error)
          });
      });
    },
    updateStatus({}, { id, status }) {
      return new Promise((resolve, reject) => {
        axios
          .patch("/activity/update-order-status/" + id + "/", { status })
          .then((response) => {
            resolve(response.data)
          })
          .catch((error) => {
            reject(error)
          });
      });
    },
    fetchMeetingToken({}, id) {
      return new Promise((resolve, reject) => {
        axios
          .get("/agora/get-token/" + id + "/")
          .then((response) => {
            resolve(response.data)
          })
          .catch((error) => {
            reject(error)
          });
      });
    },
    fetchPaymentDetails({}, orderId) {
      return new Promise((resolve, reject) => {
        axios
          .get("/api/payment-status/booking/" + orderId + "/")
          .then((response) => {
            resolve(response.data)
          })
          .catch((error) => {
            reject(error)
          });
      });
    },
    addReview({}, data) {
      return new Promise((resolve, reject) => {
        axios.post('/api/rating-review/', data)
          .then(response => {
            resolve(response.data)
          }).catch(error => {
            reject(error.response)
          })
      })
    },
    updateReview({}, data) {
      const id = data.id
      delete data.id
      return new Promise((resolve, reject) => {
        axios.patch('/api/rating-review/' + id + '/', data)
          .then(response => {
            resolve(response.data)
          }).catch(error => {
            reject(error.response)
          })
      })
    },
    reschedule({}, data) {
      return new Promise((resolve, reject) => {
        axios.post('/activity/reschedule-order/', data)
          .then(response => {
            resolve(response.data)
          }).catch(error => {
            reject(error.response)
          })
      })
    }
  },

  mutations: {
  },
};
