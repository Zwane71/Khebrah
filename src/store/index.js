import Vue from "vue";
import Vuex from "vuex";

import auth from "./auth";
import user from "./user";
import chat from "./chat";
import data from "./data";
import experts from "./experts";
import orders from "./orders";
import plan from "./plan";
import services from "./services";
import availability from "./availability";
import checkout from "./checkout";
import notifications from "./notifications";

import axios from '../plugins/axios'

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    user,
    chat,
    data,
    experts,
    orders,
    plan,
    services,
    availability,
    checkout,
    notifications
  },
  state: {
    rtl: false,
    show_drawer: false,
    drawer_action_name: "",
    show_app_drawer: false,
    currentExpertDetails: {},
    currentServiceDetails: {},
    currentServiceCheckoutDetail: {},
    currentSlotCheckoutDetail: {},
    currentbooking: {},
    nextRoute: null
  },
  getters: {
    rtl: (state) => state.rtl,
    show_drawer: (state) => state.show_drawer,
    is_drawer: (state) => state.drawer_action_name,
    show_app_drawer: (state) => state.show_app_drawer,
    currentExpertDetails: (state) => state.currentExpertDetails,
    currentServiceDetails: (state) => state.currentServiceDetails,
    currentServiceCheckoutDetail: (state) => state.currentServiceCheckoutDetail,
    currentSlotCheckoutDetail: (state) => state.currentSlotCheckoutDetail,
    currentbooking: (state) => state.currentbooking,
    nextRoute: state => state.nextRoute
  },
  mutations: {
    UPDATE_RTL: (state, value) => {
      state.rtl = value;

      if (!!value) {
        axios.defaults.headers.common["lang"] = `ar`;
        localStorage.setItem('lang', 'ar')
      } else {
        axios.defaults.headers.common["lang"] = `en`;
        localStorage.setItem('lang', 'en')
      }
    },
    UPDATE_EXPERT_DETAIL: (state, value) => {
      state.currentExpertDetails = {};
      state.currentExpertDetails = value;
    },
    UPDATE_SERVICE_DETAIL: (state, value) => {
      state.currentServiceDetails = {};
      state.currentServiceDetails = value;
    },
    UPDATE_SERVICE_CHECKOUT_DETAIL: (state, value) => {
      state.currentServiceCheckoutDetail = {};
      state.currentServiceCheckoutDetail = value;
    },
    UPDATE_SLOT_CHECKOUT_DETAIL: (state, value) => {
      state.currentSlotCheckoutDetail = {};
      state.currentSlotCheckoutDetail = value;
    },
    UPDATE_CURRENT_BOOKING: (state, value) => {
      state.currentbooking = {};
      state.currentbooking = value;
    },
    SHOW_DRAWER: (state, actionName) => {
      state.show_drawer = !state.show_drawer;
      state.drawer_action_name = actionName;
    },
    SHOW_APP_DRAWER: (state) => {
      state.show_app_drawer = !state.show_app_drawer;
    },
    setNextRoute: (state, route) => {
      state.nextRoute = route
    },
    clearNextRoute: (state) => {
      state.nextRoute = null
    }
  },
  actions: {
    showSideDrawer({ commit }, actionName) {
      commit("SHOW_DRAWER", actionName);
    },
    showAppDrawer({ commit }) {
      commit("SHOW_APP_DRAWER");
    },
  },
});
