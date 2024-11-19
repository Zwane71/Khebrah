<template>
  <div class="mobile-menu">
    <i class="fas fa-times close-menu" @click="$emit('close')"></i>
      <!-- <li>
          <a href="#0">{{$t('home.ourExperts')}}</a>
        </li>
        <li>
          <a href="#0">{{$t('home.ourBlog')}}</a>
        </li>
        <li>
          <a href="#0">{{$t('home.aboutUs')}}</a>
        </li> -->
        <!-- <li>
          <a href="#0">{{$t('home.applyAsExpert')}}</a>
        </li> -->
    <!-- <div class="row user-info-mob border-bottom">
      <div class="pro-avatar">
      <img src="https://khebrah-bucket.s3.amazonaws.com/media/profile/pexels-pixabay-220453.jpg" class="img-fluid rounded-circle">
      </div>
      <div class="pro-desc text-white">
      <h5 class="text-white">Name</h5>
      <p>Title</p>
      </div>
    </div> -->
    <div class="text-left nav-links mt-4">

      <div v-if="isAuthenticated && profile" class="profile-info  mb-3">
        <base-avatar 
          class="mr-2"
          :is-expert="isExpert"
          :src="profile.profile_img" 
          :first-name="profile.first_name" 
          :last-name="profile.last_name" 
          :size="40"/>
          {{ name }}
      </div>

      <hr v-if="isAuthenticated">

      <router-link
        v-if="isAuthenticated"
        :to="`/${$i18n.locale}/dashboard/orders`"
        :class="{active: isActive('Orders')}"
        ><i class="fas fa-shopping-cart"></i> 
          {{$t('dashboard.orders')}}
        </router-link>
      <router-link
        v-if="isExpert"
        :to="`/${$i18n.locale}/dashboard/bookings`"
        :class="{active: isActive('Bookings')}"
        ><i class="far fa-calendar-check"></i> 
          {{$t('dashboard.bookings')}}
        </router-link>
      <router-link
        v-if="isExpert"
        :to="`/${$i18n.locale}/dashboard/services`"
        :class="{active: isActive('services')}"
        ><i class="fas fa-suitcase"></i> 
          {{$t('dashboard.services')}}
      </router-link>
      <router-link
        v-if="isExpert"
        :to="`/${$i18n.locale}/dashboard/availability`"
        :class="{active: isActive('availability')}"
        ><i class="far fa-clock"></i> 
          {{$t('dashboard.availability')}}
      </router-link>
      <router-link 
        v-if="isAuthenticated"
        :to="`/${$i18n.locale}/dashboard/profile`"
        :class="{active: isActive('Profile')}"
        ><i class="far fa-user-circle"></i> 
          {{$t('dashboard.profile')}}
      </router-link>
      <router-link
        v-if="isExpert"
        :to="`/${$i18n.locale}/dashboard/payments`"
        :class="{active: isActive('Payments')}"
        ><i class="far fa-money-bill-alt"></i> 
          {{$t('dashboard.payments')}}
        </router-link>
      <router-link 
        v-if="isExpert"
        :to="`/${$i18n.locale}/dashboard/plan`"
        :class="{active: isActive('Plan')}"
        ><i class="fas fa-crown"></i> 
          {{$t('dashboard.plan')}}
      </router-link>
      <router-link 
        v-if="isAuthenticated"
        :to="`/${$i18n.locale}/dashboard/settings`"
        :class="{active: isActive('Settings')}"
        ><i class="fas fa-cog"></i> 
          {{$t('dashboard.settings')}}
      </router-link>

      <hr v-if="isAuthenticated">

      <router-link :to="`/${$i18n.locale}/experts`" glass="find">{{
        $t("home.findAKhebrah")
      }}</router-link>

      <!-- <a v-if="!isExpert" href="" @click.prevent="applyAsExpert" glass="find">{{
        $t("home.applyAsExpert")
      }}</a> -->

      <router-link :to="`/${$i18n.locale}/login`" v-if="!isAuthenticated">{{
        $t("home.login")
      }}</router-link>

      <router-link :to="`/${$i18n.locale}/register`" v-if="!isAuthenticated">{{
        $t("home.register")
      }}</router-link>

      <a href="#" @click.prevent="signout" v-else>
        {{$t('dashboard.signOut')}}
     </a>
    </div>

    <base-modal 
      ref="mobileModal"
      :title="$t('user.verifyMobileModalTitle')">
      <edit-mobile @success="hideMobileModal" @cancel="closeMobileModal"/>
    </base-modal>

  </div>
</template>
<script>
import EditMobile from '@/app/user-module/component/editMobile.vue'
export default {
  components: {
    EditMobile
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters["auth/isAuthenticated"];
    },
    user() {
      return this.$store.getters["auth/user"];
    },
    isExpert() {
      return this.$store.getters["auth/isExpert"];
    },
    profile() {
      return this.$store.getters["user/profile"];
    },
    name() {
      return this.profile
        ? (this.profile.first_name || "") + " " + (this.profile.last_name || "")
        : "";
    },
  },

  watch: {
    '$route'() {
      this.$emit('close')
    }
  },

  methods: {
    isActive(name) {
      return this.$route.name === name
    },
    signout() {
      this.$store.dispatch("auth/logout");
      this.$router.push(`/${this.$i18n.locale}/`);
    },
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
  }
}
</script>

<style scoped>

.nav-links {
  min-height: 100vh;
  padding-top: 70px;
}

.nav-links a {
  font-size: 18px;
  display: block;
  padding: 5px 30px;
  color: #fff;
}
.nav-links a.router-link-active {
  color: #044982;
  background: aliceblue;
}
.nav-links i {
  margin-right: 10px;
}
hr {
  border-color: aliceblue;
  width: 90%;
  margin: 15px auto;
}
.profile-info {
  display: flex;
  align-items: center;
  padding: 5px 30px;
  color: #fff !important;
  font-size: 21px;
}
.pro-avatar  {    
    width: 50px;
    display: inline-flex;
    overflow: hidden;
    object-fit: cover;
    height: 50px;
    margin: 0 10px;
    display:inline-flex;
}
.pro-desc {width:200px;
display:inline-block;}
.user-info-mob {padding: 110px 30px 30px;}
</style>