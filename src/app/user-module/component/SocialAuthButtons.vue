<template>
  <div class="border-top py-3 px-1">
    <div class="text-center" v-if="errors.length">
      <small class="text-danger">
        {{ errors[0] }}
      </small>
    </div>

    <div class="row no-gutters">
      <div class="col-12 mt-2 col-md-6">
        <button class="btn btn-outline-primary btn-block" @click="loginWith('google')"> 
          <div class="image">
            <img src="../../../assets/img/icons/google.png" alt="">
          </div>
          {{ action }} Google 
        </button>
      </div>
      <div class="col-12 mt-2 col-md-6">
        <button class="btn btn-outline-primary btn-block" @click="loginWith('linkedin')"> 
          <div class="image">
            <img src="../../../assets/img/icons/linkedin.png" alt="">
          </div>
          {{ action }} Linkedin 
        </button>
      </div>
    </div>
    <div class="row no-gutters">
      <div class="col-12 mt-2 col-md-6">
        <button class="btn btn-outline-primary btn-block" @click="loginWith('twitter')"> 
          <div class="image">
            <img src="../../../assets/img/icons/twitter.svg" alt="">
          </div>
          {{ action }} Twitter
        </button>
      </div>
      <div class="col-12 mt-2 col-md-6">
        <button class="btn btn-outline-primary btn-block" @click="loginWith('facebook')"> 
          <div class="image">
            <img src="../../../assets/img/icons/facebook.png" alt="">
          </div>
          {{ action }} Facebook 
        </button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    type: {
      type: String,
      default: 'login'
    }
  },
  data: () => ({
    errors: []
  }),
  computed: {
    action() {
      return this.type === 'login'
        ? this.$t('user.signInWith')
        : this.$t('user.signUpWith')
    },
    nextRoute() {
      return this.$store.getters['nextRoute']
    }
  },
  methods: {
    loginWith(provider) {
      this.errors = []
      const type = this.type === 'register' ? 'signup' : 'login'
      this.$auth.authenticate(provider, { type }).then(response => {
        this.$store.dispatch('auth/socialAuth', response.data)
          .then(() => {
            // if (this.type === 'login') {
              if (this.nextRoute) {
                this.$router.push({ path: this.nextRoute });
                // this.$store.commit('clearNextRoute')
              } else {
                this.$router.push({ name: "HomePage" });
              }
            // }
            // } else {
            //   this.$router.push({ name: "CreateProfile" });
            //   //this.$router.push({ name: "EditProfile" });
            // }
          })
      }).catch(error => {
        const { non_field_errors = [], email = [] } = error.response.data
        this.errors = [...non_field_errors, ...email]
      })
    }
  }
}
</script>

<style scoped>
  .btn {
    white-space: nowrap;
    padding: 1px;
    display: flex;
    align-items: center;
    height: 40px;
  }
  .btn .image {
    margin-right: 15px;
    background: #fff;
    height: 36px;
    width: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .btn img {
    max-width: 100%;
    max-height: 100%;
    width: 25px;
  }

  .rtl .btn .image {
    margin-right: unset;
    margin-left: 15px;
  }
  @media (min-width: 769px) {
    .col-md-6:first-child {
      padding-right: 3px;
    }
    .rtl .col-md-6:first-child {
      padding-right: unset;
      padding-left: 3px;
    }
    .col-md-6:last-child {
      padding-left: 3px;
    }
    .rtl .col-md-6:last-child {
      padding-left: unset;
      padding-right: 3px;
    }
  }

  @media (max-width: 768px) {
    .row {
      max-width: 250px;
      margin: 0 auto;
    }

  }

  @media (min-width: 992px) and (max-width: 1199px) {
    .btn {
      font-size: 14px;
    }
    .col-md-6 {
      padding: 5px;
    }

  }
</style>