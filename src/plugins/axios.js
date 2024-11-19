import axios from 'axios'
import qs from 'qs'

const instance = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })
})

instance.interceptors.response.use(undefined, function(error) {
  if (error.response && error.response.status === 401 && ['user_not_found', 'token_not_valid'].includes(error.response.data.code)) {
    localStorage.removeItem("KHEBRAH_AUTH_TOKEN");
    localStorage.removeItem("KHEBRAH_USER");
    location.reload()
  }
  return Promise.reject(error)
})

export default instance