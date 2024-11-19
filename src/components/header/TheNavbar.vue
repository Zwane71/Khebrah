<template>
  <div>
    <header>
      <b-navbar
        class="navbar navbar-expand-lg fixed-top"
        :class="{ affix: !view.topOfPage || isAuthenticated }"
      >
        <div class="container">
          <div class="d-flex align-items-center">
            <div class="toggler mr-2" @click="menuToggler">
              <img src="../../assets/img/menu.png" alt="menu" />
            </div>
            <router-link class="logo-link" :to="`/${$i18n.locale}/`">
              <img
                src="../../assets/img/logo.svg"
                alt="logo"
                class="header-logo"
              />
            </router-link>
          </div>
          <b-navbar-nav class="navbar-nav my-nav mr-1">
            <div class="left">
              <!-- <b-nav-item :to="`/${$i18n.locale}/experts`" v-if="!isAuthenticated">{{
                $t("home.ourExperts")
              }}</b-nav-item> -->
              <b-nav-item v-if="(!isAuthenticated || (isAuthenticated && profileComplete))" :to="`/${$i18n.locale}/experts`" @click="resetScroll" class="find">{{
                $t("home.findAKhebrah")
              }}</b-nav-item>
              <!-- <b-nav-item href="#" v-if="!isAuthenticated">{{ $t("home.ourBlog") }}</b-nav-item>
              <b-nav-item href="#" v-if="!isAuthenticated">{{ $t("home.aboutUs") }}</b-nav-item> -->
            </div>
            <div class="right">
              <!-- <b-nav-item href="#">{{ $t("home.aboutUs") }}</b-nav-item> -->
              <!-- <b-nav-item
                v-if="!isExpert && (!isAuthenticated || (isAuthenticated && profileComplete))"
                @click="applyAsExpert"
                >{{ $t("home.applyAsExpert") }}</b-nav-item
              > -->

              <b-nav-item :to="`/${$i18n.locale}/login`" v-if="!isAuthenticated">{{
                $t("home.login")
              }}</b-nav-item>
              <b-nav-item :to="`/${$i18n.locale}/register`" v-if="!isAuthenticated">{{
                $t("home.register")
              }}</b-nav-item>

              <!-- <template v-if="isAuthenticated">
                <icon-with-badge icon="far fa-comment-alt" :count="unreadMessages" target="messages"/>
                <icon-with-badge icon="far fa-bell" :count="unreadNotifications" target="notifications"/>

                <profile-dropdown />
              </template> -->

              <!-- <b-nav-item v-if="isAuthenticated" @click="signout">{{
                $t("home.signOut")
              }}</b-nav-item> -->
            </div>
          </b-navbar-nav>

          <div class="d-flex align-items-center">
            <template v-if="isAuthenticated">
              <icon-with-badge v-if="profileComplete" icon="far fa-comment-alt" :count="unreadMessages" target="messages"/>
              <icon-with-badge v-if="profileComplete" icon="far fa-bell" :count="unreadNotifications" target="notifications"/>

              <profile-dropdown class="profile-dropdown d-none d-lg-block mr-2" />
            </template>
            <div class="lang-toggle" @click="changeLocale">
              {{ $store.state.rtl ? "En" : "ع" }}
            </div>
          </div>

        </div>
      </b-navbar>
    </header>
    <mobile-menu @close="closeMenu" :class="{ activeMenu: menuIsVisible }"/>
    <!-- <div class="mobile-menu" :class="{ activeMenu: menuIsVisible }">
      <span @click="closeMenu"> <i class="fas fa-times close-menu"></i></span>
      <ul class="list-unstyled mobile-menu__ul">
        <li>
          <a href="#0">{{ $t("home.ourExperts") }}</a>
        </li>
        <li>
          <a href="#0">{{ $t("home.ourBlog") }}</a>
        </li>
        <li>
          <a href="#0">{{ $t("home.aboutUs") }}</a>
        </li>
        <li>
          <a href="#0">{{ $t("home.applyAsExpert") }}</a>
        </li>
        <li>
          <a href="#0">{{ $t("home.findAKhebrah") }}</a>
        </li>
        <li>
          <a href="#0">{{ $t("home.login") }}</a>
        </li>
        <li>
          <a href="#0">{{ $t("home.register") }}</a>
        </li>
      </ul>
    </div> -->

    <base-modal 
      ref="mobileModal"
      :title="$t('user.verifyMobileModalTitle')">
      <edit-mobile @success="hideMobileModal" @cancel="closeMobileModal"/>
    </base-modal>
  </div>
</template>

<script>
import { setLanguage } from "@/app/homepage-module/methods/change_language";
import ProfileDropdown from "@/components/header/ProfileDropdown.vue"
import IconWithBadge from "@/components/header/IconWithBadge.vue"
import EditMobile from '@/app/user-module/component/editMobile.vue'
import MobileMenu from '@/components/header/MobileMenu.vue';

export default {
  components: {
    ProfileDropdown,
    IconWithBadge,
    EditMobile,
    MobileMenu
  },
  data() {
    return {
      menuIsVisible: false,
      searchInputIsVisible: false,
      style: {
        width: "100%",
      },
      view: {
        topOfPage: true,
      },
    };
  },
  beforeMount() {
    window.addEventListener("scroll", this.handleScroll);
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters["auth/isAuthenticated"];
    },
    user() {
      return this.$store.getters["auth/user"];
    },
    profile() {
      return this.$store.getters["user/profile"];
    },
    unreadMessages() {
      return this.$store.getters["chat/unreadCount"];
    },
    unreadNotifications() {
      return this.$store.getters["notifications/unreadCount"];
    },
    isExpert() {
      return this.$store.getters["auth/isExpert"];
    },
    profileComplete() {
      return this.profile && this.profile.profile_complete
    }
  },
  methods: {
    applyAsExpert() {
      if (this.user && !this.user.mobile) {
        this.showMobileModal()
      } else {
        this.$router.push({ name: 'CreateExpert' })
      }
    },
    showMobileModal() {
      this.$refs.mobileModal.show()
    },
    closeMobileModal() {
      this.$refs.mobileModal.hide()
    },
    hideMobileModal() {
      this.$refs.mobileModal.hide()
      this.applyAsExpert()
    },
    signout() {
      this.$store.commit('clearNextRoute')
      this.$store.dispatch("auth/logout");
      this.$router.push(`/${$i18n.locale}/`);
      location.reload();
    },
    changeLocale() {
      let currentLocalae = this.$store.state.rtl;
      if (currentLocalae == false) {
        setLanguage("ar");
      } else {
        setLanguage("en");
      }
    },

    menuToggler() {
      this.menuIsVisible = true;
    },
    searchInputToggler() {
      this.searchInputIsVisible = !this.searchInputIsVisible;
    },
    closeMenu() {
      this.menuIsVisible = false;
    },
    handleScroll() {
      if (window.pageYOffset > 0) {
        if (this.view.topOfPage) this.view.topOfPage = false;
      } else {
        if (!this.view.topOfPage) this.view.topOfPage = true;
      }
    },
    resetScroll() {
      window.scrollTo(0, 0)
    }
  },
};
</script>
<style scoped>
.find {
  font-family: "Quicksand", sans-serif;
}
.activeMenu {
  width: 100% !important;
}
.navbar {
  background-color: #fff !important;
  box-shadow: 0 0 2px 1px rgba(0,0,0,0.15) !important;
}
.lang-toggle {
  background-color: #00a072;
  color: #fff;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex !important;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  cursor: pointer;
  padding-bottom: 7px;
}
.lang-toggle:hover {
  opacity: 0.7;
}
.rtl .lang-toggle {
  padding-bottom: 0 !important;
}

@media (min-width: 1400px) {
  .profile-nav .container {
    max-width: 1440px !important;
  }
}
@media screen and (max-width: 991px) {
  .logo-link {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
}
@media screen and (max-width: 768px) {
  .header-logo {
    height: auto;
    width: 40px !important;
  }
  .lang-toggle {
    width: 33px;
    height: 33px;
    font-size: 14px;
    padding-bottom: 3px;
  }
  .navbar {
    height: 60px;
  }
}
</style>
