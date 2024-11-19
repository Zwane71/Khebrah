import axios from "../plugins/axios";

export default {
  namespaced: true,

  state: () => ({
    profile: null,
  }),

  getters: {
    profile: (state) => state.profile,
  },

  actions: {
    updateUser({ commit, rootGetters }, data) {
      const user = rootGetters["auth/user"];
      if (!user) return Promise.reject();
      return new Promise((resolve, reject) => {
        axios
          .patch("/api/users/" + user.pk + "/", data)
          .then((response) => {
            localStorage.setItem("KHEBRAH_USER", JSON.stringify(response.data));
            commit("auth/setUser", response.data, { root: true });
            resolve(response)
          })
          .catch((error) => reject(error));
      });
    },
    updatePassword({ commit }, data) {
      return new Promise((resolve, reject) => {
        axios
          .post("/password/change/", data)
          .then((response) => {
            resolve(response)
          })
          .catch((error) => reject(error));
      });
    },
    updateProfile({ commit, rootGetters }, data) {
      const user = rootGetters["auth/user"];
      if (!user) return Promise.reject();
      return new Promise((resolve, reject) => {
        axios
          .patch("/api/profiles/" + user.pk + "/", data)
          .then((response) => {
            resolve(response)
          })
          .catch((error) => reject(error));
      });
    },
    fetchProfile({ commit, rootGetters }) {
      const user = rootGetters["auth/user"];
      if (!user) return Promise.reject();
      return new Promise((resolve, reject) => {
        axios
          .get("/api/profiles/" + user.pk + "/")
          .then((response) => {
            commit("setProfile", response.data);
            commit("auth/setUser", response.data.profile, { root: true })
            localStorage.setItem("KHEBRAH_USER", JSON.stringify(response.data.profile));
            resolve(response.data)
          })
          .catch((error) => console.log(error));
      });
    },
    fetchBookings({ rootGetters }, filters = {}) {
      const user = rootGetters["auth/user"];
      if (!user) return Promise.reject();
      return new Promise((resolve, reject) => {
        axios
          //.get('/activity/your_orders/')
          .get('/activity/expert-booking-list/' + user.pk + '/', { params: filters })
          .then(response => {
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    fetchOrders({ rootGetters }, filters = {}) {
      const user = rootGetters["auth/user"];
      if (!user) return Promise.reject();
      return new Promise((resolve, reject) => {
        axios
          //.get('/activity/order_history/')
          //.get('/activity/your_orders/')
          .get('/activity/user-order-list/' + user.pk + '/', { params: filters })
          .then(response => {
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    fetchServices({ rootGetters }, filters) {
      const user = rootGetters["auth/user"];
      if (!user) return Promise.reject();
      return new Promise((resolve, reject) => {
        axios
          .get('/user/user-services/' + user.pk + '/', { params: filters })
          .then(response => {
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // fetchAvailability({ commit }, id) {
    //   return new Promise((resolve, reject) => {
    //     axios
    //       .get('/api/available-slot/', { params: { user: id }})
    //       .then(response => {
    //         resolve(response.data)
    //       })
    //       .catch(error => {
    //         reject(error)
    //       })
    //   })
    // },
    fetchPlan({ commit }, id) {
      return new Promise((resolve, reject) => {
        axios
          .get('/user/current-subscription/')
          .then(response => {
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    fetchSocialAuths({}) {
      return new Promise((resolve, reject) => {
        axios
          .get('/auth/social-auth/')
          .then(response => {
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    removeSocialAuth({ }, id) {
      return new Promise((resolve, reject) => {
        axios
          .delete('/auth/social-auth/' + id + '/')
          .then(response => {
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    fetchExpertPayments({ commit, rootGetters }, filters = {}) {
      const user = rootGetters["auth/user"];
      if (!user) return Promise.reject();
      return new Promise((resolve, reject) => {
        axios
          .get('/activity/expert-payments/' + user.pk + '/', { params: filters })
          .then(response => {
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    checkUsername({ commit }, username) {
      return new Promise((resolve, reject) => {
        axios
          .post('/check-username/', { username })
          .then(response => {
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    updateEmail ({ commit }, data) {
      return new Promise((resolve, reject) => {
        axios
          .post('/api/update-email/', data)
          .then(response => {
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    updateMobile ({ commit }, data) {
      return new Promise((resolve, reject) => {
        axios
          .post('/api/update-mobile/', data)
          .then(response => {
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    subscribeToNewsletter({}, email) {
      return new Promise((resolve, reject) => {
        axios
          .post('/api/newsletter/subscriptions/', { email })
          .then(response => {
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    unsubscribeNewsletter({}, email) {
      return new Promise((resolve, reject) => {
        axios
          .delete('/api/newsletter/subscriptions/', { data: { email } })
          .then(response => {
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    confirmNewsletterSubscription({}, data) {
      return new Promise((resolve, reject) => {
        axios
          .post('/api/newsletter/newsletter-email-verify/', data)
          .then(response => {
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    submitContactForm({}, data) {
      return new Promise((resolve, reject) => {
        axios
          .post('/api/submissions/', data)
          .then(response => {
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    updateSocialLinks({ }, data) {
      return new Promise((resolve, reject) => {
        axios
          .patch("/api/social-links/", data)
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
    setProfile(state, profile) {
      state.profile = profile;
    },
    clearProfile(state) {
      state.profile = null;
    },
  },
};
