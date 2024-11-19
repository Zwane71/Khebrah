import Vue from "vue";
import Router from "vue-router";
import Meta from 'vue-meta'
import i18n from "../plugins/i18n.js";
import store from "@/store";
import ProfilePage from "../components/profile/ProfilePage.vue";
import ExpertsPage from "../components/experts/ExpertsPage.vue";


Vue.use(Router);

/**
 * Suppresses navigation errors. More details at 
 * https://github.com/vuejs/vue-router/issues/2881#issuecomment-520554378
 */
const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject)

  return originalPush.call(this, location).catch(e => {
    if (Router.isNavigationFailure(e)) {
      return e
    }
    return Promise.reject(e)
  })
}

Vue.use(Meta)

const routes = [
  {
    path: "",
    redirect: `/${i18n.locale}`,
  },
  // FIXME
  { path: "/auth/callback", name: "Auth", component: ExpertsPage },
  {
    path: "/:lang",
    component: {
      render: (h) => h("router-view"),
    },
    children: [
      {
        path: "/:lang",
        name: "HomePage",
        meta: { requiresAuth: false },
        component: () =>
          import(
            /* webpackChunkName: 'Home' */ "../components/home-page/Home.vue"
          ),
      },

      {
        path: "login",
        name: "Login",
        meta: { redirectAuthUser: true },
        component: () =>
          import(
            /* webpackChunkName: 'Login' */ "@/app/user-module/page/login.vue"
          ),
      },
      {
        path: "reset-password",
        name: "ResetPassword",
        meta: { redirectAuthUser: true },
        component: () =>
          import(
            /* webpackChunkName: 'Login' */ "@/app/user-module/page/resetPassword.vue"
          ),
      },
      {
        path: "register",
        name: "Register",
        meta: { redirectAuthUser: true },
        component: () =>
          import(
            /* webpackChunkName: 'Register' */ "@/app/user-module/page/register.vue"
          ),
      },
      {
        path: "email-verification",
        name: "EmailVerification",
        meta: { requiresAuth: false },
        component: () =>
          import(
            /* webpackChunkName: 'EmailVerification' */ "@/app/user-module/page/emailVerification.vue"
          ),
      },
      {
        path: "register/:email/:number",
        name: "CreateAccount",
        meta: { redirectAuthUser: true },
        component: () =>
          import(
            /* webpackChunkName: 'CreateProfile' */ "@/app/user-module/page/createAccount.vue"
          ),
      },
      {
        path: "newsletter-subscribe/:email/:otp",
        name: "NewsletterSubscribe",
        meta: { type: 'subscribe' },
        component: () =>
          import(
            /* webpackChunkName: 'CreateProfile' */ "@/app/user-module/page/newsletterSubscribe.vue"
          ),
      },
      {
        path: "newsletter-unsubscribe/:email/:otp",
        name: "NewsletterUnsubscribe",
        meta: { type: 'unsubscribe' },
        component: () =>
          import(
            /* webpackChunkName: 'CreateProfile' */ "@/app/user-module/page/newsletterSubscribe.vue"
          ),
      },
      // {
      //   path: "success",
      //   name: "SuccessExpert",
      //   meta: { requiresAuth: false },
      //   component: () =>
      //     import(
      //       /* webpackChunkName: 'EmailVerification' */ "@/app/user-module/page/successExpert.vue"
      //     ),
      // },
      // {
      //   path: "otp",
      //   name: "Otp",
      //   meta: { requiresAuth: false },
      //   component: () =>
      //     import(
      //       /* webpackChunkName: 'Otp' */ "@/app/user-module/page/otp.vue"
      //     ),
      // },
      // {
      //   path: "otp-verification",
      //   name: "OtpVerification",
      //   meta: { requiresAuth: false },
      //   component: () =>
      //     import(
      //       /* webpackChunkName: 'Otp' */ "@/app/user-module/page/otpLogin.vue"
      //     ),
      // },
      {
        path: "create-profile",
        name: "CreateProfile",
        meta: { requiresAuth: true },
        component: () =>
          import(
            /* webpackChunkName: 'CreateProfile' */ "@/app/user-module/page/createProfile.vue"
          ),
      },
      // {
      //   path: "create-profile/:email/:number",
      //   name: "CreateProfile",
      //   meta: { redirectAuthUser: true },
      //   component: () =>
      //     import(
      //       /* webpackChunkName: 'CreateProfile' */ "@/app/user-module/page/createProfile.vue"
      //     ),
      // },
      // {
      //   path: "create-profile",
      //   name: "createProfileFromMobile",
      //   meta: { redirectAuthUser: true },
      //   component: () =>
      //     import(
      //       /* webpackChunkName: 'createProfileFromMobile' */ "@/app/user-module/page/createProfileFromMobile.vue"
      //     ),
      // },
      {
        path: "checkout",
        name: "Checkout",
        meta: { requiresAuth: true },
        component: () =>
          import(
            /* webpackChunkName: 'CreateProfile' */ "@/app/user-module/component/checkout.vue"
          ),
      },
      {
        path: "booking-success",
        name: "BookingSuccess",
        meta: { requiresAuth: true },
        component: () =>
          import(
            /* webpackChunkName: 'CreateProfile' */ "@/app/user-module/page/bookingSuccess.vue"
          ),
      },
      {
        path: "pages/:slug",
        name: "CmsPage",
        component: () =>
          import(
            /* webpackChunkName: 'Home' */ "@/pages/CmsPage.vue"
          ),
      },
      // {
      //   path: "expert-payment",
      //   name: "ExpertPayment",
      //   meta: { requiresAuth: true },
      //   component: () =>
      //     import(
      //       /* webpackChunkName: 'CreateProfile' */ "@/app/user-module/page/successExpert.vue"
      //     ),
      // },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => 
          import(
            /* webpackChunkName: 'services' */ "@/pages/Dashboard.vue"
          ),
        children: [
          {
            path: "bookings",
            name: "Bookings",
            meta: { requiresExpert: true },
            component: () =>
              import(
                /* webpackChunkName: 'services' */ "@/app/user-module/page/bookings.vue"
              ),
          },
          {
            path: "orders",
            name: "Orders",
            meta: { requiresAuth: true },
            component: () =>
              import(
                /* webpackChunkName: 'services' */ "@/app/user-module/page/orders.vue"
              ),
          },
          {
            path: "settings",
            name: "Settings",
            meta: { requiresAuth: true },
            component: () =>
              import(
                /* webpackChunkName: 'services' */ "@/app/user-module/page/settings.vue"
              ),
          },
          {
            path: "payments",
            name: "Payments",
            meta: { requiresExpert: true },
            component: () =>
              import(
                /* webpackChunkName: 'services' */ "@/app/user-module/page/payments.vue"
              ),
          },
          {
            path: "profile",
            name: "EditProfile",
            meta: { requiresAuth: true },
            component: () =>
              import(
                /* webpackChunkName: 'CreateProfile' */ "@/app/user-module/page/editProfile.vue"
              ),
          },
          {
            path: "plan",
            name: "EditPlan",
            meta: { requiresExpert: true },
            component: () =>
              import(
                /* webpackChunkName: 'CreateProfile' */ "@/app/expert-module/page/editPlan.vue"
              ),
          },
          {
            path: "bookings/:id",
            name: "BookingDetails",
            meta: { requiresAuth: true },
            component: () =>
              import(
                /* webpackChunkName: 'services' */ "@/app/user-module/component/BookingDetails.vue"
              ),
          },
          {
            path: "orders/:id",
            name: "OrderDetails",
            meta: { requiresAuth: true },
            component: () =>
              import(
                /* webpackChunkName: 'services' */ "@/app/user-module/component/BookingDetails.vue"
              ),
          },
          {
            path: "services",
            name: "services",
            meta: { requiresExpert: true },
            component: () =>
              import(
                /* webpackChunkName: 'services' */ "@/app/expert-module/page/services.vue"
              ),
          },
          {
            path: "services/new",
            name: "CreateService",
            meta: { requiresExpert: true },
            component: () =>
              import(
                /* webpackChunkName: 'services' */ "@/app/expert-module/page/createService.vue"
              ),
          },
          {
            path: "services/:id",
            name: "editService",
            meta: { requiresExpert: true },
            component: () =>
              import(
                /* webpackChunkName: 'services' */ "@/app/expert-module/page/editService.vue"
              ),
          },
          {
            path: "availability",
            name: "availability",
            meta: { requiresExpert: true },
            component: () =>
              import(
                /* webpackChunkName: 'services' */ "@/app/expert-module/page/availability.vue"
              ),
          },
        ]
      },
      {
        path: "create-expert",
        name: "CreateExpert",
        meta: { requiresAuth: true },
        component: () =>
          import(
            /* webpackChunkName: 'CreateExpert' */ "@/app/user-module/page/createExpert.vue"
          ),
      },

      {
        path: "messages",
        name: "messages",
        meta: { requiresAuth: true },
        component: () =>
          import(
            /* webpackChunkName: 'messages' */ "@/app/chat-module/page/chat.vue"
          ),
      },
      {
        path: "notifications",
        name: "notifications",
        meta: { requiresAuth: true },
        component: () =>
          import(
            /* webpackChunkName: 'notifications' */ "@/app/notification-module/page/notifications.vue"
          ),
      },
      {
        path: "meeting/:id",
        name: "meeting",
        meta: { requiresAuth: true },
        component: () =>
          import(
            /* webpackChunkName: 'meeting' */ "@/app/meeting-module/page/meeting.vue"
          ),
      },

      { path: "experts", name: 'Experts', component: ExpertsPage },
      { path: "experts/:username", name: "expertProfile", component: ProfilePage },
      {
        path: '*',
        name: '404',
        component: () => import('@/pages/404.vue')
      }
    ],
  }
];

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  scrollBehavior (to, from, savedPosition) {
    return {
      x: 0,
      y: 0,
      behavior: 'smooth'
    }
  }
});

router.beforeEach((to, from, next) => {

  let pathChunks = to.fullPath.split('/')

  if (!['en', 'ar'].includes(pathChunks[1]) && to.name !== 'Auth') {
    const lang = localStorage.getItem('lang') || 'en'
    pathChunks.splice(1, 0, lang)
    next({ path: pathChunks.join('/') })
    return
  }

  let language = to.params.lang;
  if (!language) {
    language = "en";
  }
  i18n.locale = language;

  if (language == "en") {
    i18n.locale = "en";
    store.commit("UPDATE_RTL", false);
  } else if (language == "ar") {
    i18n.locale = "ar";
    store.commit("UPDATE_RTL", true);
  } else {
    i18n.locale = "en";
    store.commit("UPDATE_RTL", false);
  }

  const isAuth = store.getters["auth/isAuthenticated"];
  const user = store.getters["auth/user"];
  const isExpert = user && user.is_expert;

  if (to.meta.requiresAuth) {
    if (!isAuth) {
      store.commit('setNextRoute', to.fullPath)
      next({ name: "Login", params: { lang: i18n.locale } });
    } else {
      next();
    }
  } else if (to.meta.requiresExpert) {
    if (!isAuth) {
      store.commit('setNextRoute', to.fullPath)
      next({ name: "Login", params: { lang: i18n.locale } });
    } else if (!isExpert) {
      next({ name: "HomePage", params: { lang: i18n.locale } });
    } else {
     next();
    }
  } else if (to.meta.redirectAuthUser && isAuth) {
    // redirect Dashboard page for autheticated users
    next({ name: "HomePage", params: { lang: i18n.locale } });
  } else {
    next();
  }

  // redirect unauth users to Signin  page
  // if (to.meta.requiresAuth) {
  //   next({ name: "HomePage", params: { lang: i18n.locale } });
  // } else if (to.meta.redirectAuthUser) {
  //   // redirect Dashboard page for autheticated users
  //   next({ name: "HomePage", params: { lang: i18n.locale } });
  // } else {
  //   next();
  // }
});
export default router;
