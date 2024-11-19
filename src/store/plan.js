import axios from "../plugins/axios";

export default {
  namespaced: true,

  state: () => ({

  }),

  actions: {
    fetchPlans({ commit }) {
      return new Promise((resolve, reject) => {
        axios
          .get("/user/user_plan/")
          .then((response) => {
            resolve(response.data)
          })
          .catch((error) => {
            console.log(error)
            reject(error)
          });
      });
    },
    fetchPaymentDetails({}, orderId) {
      return new Promise((resolve, reject) => {
        axios
          .get("/api/payment-status/plan/" + orderId + "/")
          .then((response) => {
            resolve(response.data)
          })
          .catch((error) => {
            reject(error)
          });
      });
    },
    selectPlan({}, data) {
      return new Promise((resolve, reject) => {
        axios
          .post("/user/user_plan_selection/", data)
          .then((response) => {
            resolve(response.data)
          })
          .catch((error) => {
            reject(error)
          });
      });
    },
    // makePayment({}, data) {
    //   return new Promise((resolve, reject) => {
    //     axios
    //       .post("/api/payment/" + id + "/", data)
    //       .then((response) => {
    //         resolve(response.data)
    //       })
    //       .catch((error) => {
    //         reject(error)
    //       });
    //   });
    // },
  },

  mutations: {

  }
}