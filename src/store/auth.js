import axios from "../plugins/axios";

let token, parsedUser

try {
  token = localStorage.getItem("KHEBRAH_AUTH_TOKEN") 
  const user = localStorage.getItem("KHEBRAH_USER")
  parsedUser = user && JSON.parse(user)

  if (token && parsedUser) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
} catch(error) {
  console.log(error)
  localStorage.removeItem('KHEBRAH_AUTH_TOKEN')
  localStorage.removeItem('KHEBRAH_USER')
}

export default {
  namespaced: true,
  state: () => ({
    token: token && parsedUser ? token : "",
    user: token && parsedUser ? parsedUser : null,
  }),

  getters: {
    isAuthenticated: state => !!state.token,
    isExpert: state => state.user && state.user.is_expert,
    user: state => state.user,
    token: state => state.token,
  },

  actions: {
    socialAuth({ commit }, data) {
      return new Promise((resolve, reject) => {
        const token = data.access_token;
        const user = data.user;
        localStorage.setItem("KHEBRAH_AUTH_TOKEN", token);
        localStorage.setItem("KHEBRAH_USER", JSON.stringify(user));
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        commit("setToken", token);
        commit("setUser", user);
        resolve()
      })
    },
    login({ commit }, data) {
      return new Promise((resolve, reject) => {
        axios
          .post("/login/", data)
          .then((response) => {
            // console.log(response);
            const token = response.data.access_token;
            const user = response.data.user;
            localStorage.setItem("KHEBRAH_AUTH_TOKEN", token);
            localStorage.setItem("KHEBRAH_USER", JSON.stringify(user));
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            commit("setToken", token);
            commit("setUser", user);
            resolve(response);
            // location.reload(); //FIXME
          })
          .catch((error) => {
            console.log(error.response);
            reject(error);
          });
      });
    },
    loginByMobile({ commit }, data) {
      return new Promise((resolve, reject) => {
        axios
          .post("/login-mobile/", data)
          .then((response) => {
            // console.log(response);
            const token = response.data.access_token;
            const user = response.data.user;
            localStorage.setItem("KHEBRAH_AUTH_TOKEN", token);
            localStorage.setItem("KHEBRAH_USER", JSON.stringify(user));
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            commit("setToken", token);
            commit("setUser", user);
            resolve(response);
          })
          .catch((error) => {
            console.log(error.response);
            reject(error_);
          });
      });
    },
    logout({ commit }) {
      localStorage.removeItem("KHEBRAH_AUTH_TOKEN");
      localStorage.removeItem("KHEBRAH_USER");
      delete axios.defaults.headers.common["Authorization"];
      commit("removeToken");
      commit("removeUser");
    },

    register({ commit }, data) {
      return new Promise((resolve, reject) => {
        axios.post('/register/', data)
          .then(response => {
            const token = response.data.access_token;
            const user = response.data.user;
            localStorage.setItem("KHEBRAH_AUTH_TOKEN", token);
            localStorage.setItem("KHEBRAH_USER", JSON.stringify(user));
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            commit("setToken", token);
            commit("setUser", user);
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    registerByEmail({}, data) {
      return new Promise((resolve, reject) => {
        axios.post('/email-register/', data)
          .then(response => {
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
        })
    },

    registerByMobile ({}, data) {
      return new Promise((resolve, reject) => {
        axios.post('/mobile-register/', data)
          .then(response => {
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
        })
    },

    verifyEmail({ commit }, data) {
      return new Promise((resolve, reject) => {
        axios
        .post('/email-verify/', data)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))

      })

    },

    resetEmailPassword({ commit }, email) {
      return new Promise((resolve, reject) => {
        axios
        .post('/reset-password/email/', { email, otp: '' })
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
      })
    },

    resetMobilePassword({ commit }, mobile) {
      return new Promise((resolve, reject) => {
        axios
        .post('/reset-password/mobile/', { mobile, otp: '' })
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
      })
    },

    resetPasswordUpdate({ commit }, data) {
      return new Promise((resolve, reject) => {
        axios
        .post('/reset-password/mobile-email/', data)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
      })
    },
  },

  mutations: {
    setToken(state, token) {
      state.token = token;
    },
    removeToken(state) {
      state.token = "";
    },
    setUser(state, user) {
      state.user = user;
    },
    removeUser(state) {
      state.user = null;
    },
  },
};
