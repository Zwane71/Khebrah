import axios from "@/plugins/axios";
import dayjs from '@/plugins/dayjs'

export default {
  namespaced: true,

  state: () => ({
  }),

  getters: {
  },

  actions: {
    getProfile({ commit }, username) {
      return new Promise((resolve, reject) => {
        axios
          .get("/api/experts/" + username + "/")
          .then((response) => {
            resolve(response.data)
          })
          .catch((error) => {
            reject(error)
          });
      });
    },
    getExperts({ commit }, filters = {}) {
      const categories = filters.categories ? [...filters.categories].filter(c => c !== -1) : []
      
      const updatedFilters = { ...filters, categories }
      for (let [key, value] of Object.entries(updatedFilters)) {
        if (value == null) delete updatedFilters[key]
      }

      if (updatedFilters.rating) {
        updatedFilters.min_rating = updatedFilters.rating
        delete updatedFilters.rating
      }

      
      if (updatedFilters.availability === 'all') delete updatedFilters.availability
      else if(updatedFilters.availability) updatedFilters.timezone = dayjs.tz.guess()

      return new Promise((resolve, reject) => {
        axios
          .get("/api/experts/", { params: updatedFilters })
          .then((response) => {
            resolve(response.data)
          })
          .catch((error) => {
            console.log(error)
            reject(error)
          });
      });
    },
    getSimilarProfiles({ commit }, id) {
      return new Promise((resolve, reject) => {
        axios
          .get("/user/similar-profiles/" + id  + '/')
          .then((response) => {
            resolve(response.data)
          })
          .catch((error) => {
            console.log(error)
            reject(error)
          });
      });
    },
    addGalleryItem({ commit }, data) {
      return new Promise((resolve, reject) => {
        axios
          .post("/user/gallery/", data)
          .then((response) => {
            resolve(response.data)
          })
          .catch((error) => {
            console.log(error)
            reject(error)
          });
      });
    },
    updateGalleryItem({ commit }, { id, data }) {
      return new Promise((resolve, reject) => {
        axios
          .patch("/user/gallery/" + id + '/', data)
          .then((response) => {
            resolve(response.data)
          })
          .catch((error) => {
            console.log(error)
            reject(error)
          });
      });
    },
    deleteGalleryItem({ commit }, id) {
      return new Promise((resolve, reject) => {
        axios
          .delete("/user/gallery/" + id + '/')
          .then((response) => {
            resolve(response.data)
          })
          .catch((error) => {
            console.log(error)
            reject(error)
          });
      });
    },
  },

  mutations: {
  },
};
