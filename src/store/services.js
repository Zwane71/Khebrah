import axios from "../plugins/axios";

export default {
  namespaced: true,

  state: () => ({
  }),

  getters: {
  },

  actions: {
    createService ({ commit }, data) {
      return new Promise((resolve, reject) => {
        axios
          .post("/user/service-add/", data)
          .then((response) => {
            resolve(response.data)
          })
          .catch((error) => reject(error));
      });
    },

    getService ({ commit }, id) {
      return new Promise((resolve, reject) => {
        axios
          .get("/user/service-add/" + id + "/")
          .then((response) => {
            resolve(response.data)
          })
          .catch((error) => reject(error));
      });
    },

    updateService ({ commit }, { id, data }) {
      return new Promise((resolve, reject) => {
        axios
          .patch("/user/service-add/" + id + "/", data)
          .then((response) => {
            resolve(response)
          })
          .catch((error) => reject(error));
      });
    },

    deleteService ({ commit }, id) {
      return new Promise((resolve, reject) => {
        axios
          .delete("/user/service-add/" + id + "/")
          .then((response) => {
            resolve(response)
          })
          .catch((error) => reject(error));
      });
    },
  }
}