import axios from "../plugins/axios";

export default {
  namespaced: true,

  state: () => ({
    order: null
  }),

  getters: {
    order: state => state.order
  },

  actions: {
    bookService ({ commit }, { id, data }) {
      return new Promise((resolve, reject) => {
        axios
          .post("/activity/book_service/" + id + '/', data)
          .then((response) => {
            resolve(response.data)
          })
          .catch((error) => reject(error));
      });
    },
    makePayment({}, data) {
      return new Promise((resolve, reject) => {
        axios
          .post("/api/payments/", data)
          .then((response) => {
            resolve(response.data)
          })
          .catch((error) => {
            reject(error)
          });
      });
    },

  },

  mutations: {
    fetchOrderFromStorage(state) {
      const order = localStorage.getItem('currentOrder')
      if (order) state.order = JSON.parse(order)
    },
    setOrder(state, order) {
      state.order = order
      localStorage.setItem('currentOrder', JSON.stringify(order))
    },
    clearOrder(state) {
      state.order = null
      localStorage.removeItem('currentOrder')
    }
  }
}