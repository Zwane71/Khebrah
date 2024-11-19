<template>
  <footer class="footer">
    <div class="container">
      <div class="row">
        <div
          class="col-lg-3"
          data-aos="fade-up"
          data-aos-offset="300"
          data-aos-duration="300"
          data-aos-easing="ease-in-sine"
        >
          <div class="logo-container logo-container1">
            <img :src="logo" alt="" v-if="logo" />
          </div>
          <p class="footer__p">
            {{ description }}
            <!-- There are many variations of passages of Lorem ipsum available, but
            the majority have suffered alteration in some formed humour. -->
          </p>
        </div>
        <div
          class="col-lg-3 d-in-r"
          data-aos="fade-up"
          data-aos-offset="300"
          data-aos-duration="400"
          data-aos-easing="ease-in-sine"
        >
          <h6 class="footer__h6">{{$t('home.officeTitle')}}</h6>
          <img
            v-if="mapImage"
            :src="mapImage"
            alt=""
            class="continent__img"
          />
        </div>
        <div
          class="col-lg-3 col-mobile"
          data-aos="fade-up"
          data-aos-offset="300"
          data-aos-duration="500"
          data-aos-easing="ease-in-sine"
        >
          <h6 class="footer__h6 d-in-r">{{$t('home.contactTitle')}}</h6>
          <ul class="list-unstyled footer__ul">
            <!-- <li>
              <span><i class="fas fa-map-marker-alt"></i></span>
              <div class="m-t-10">
                Dar Al-Awadi Tower <br />
                25th Floor, Ahmed Al Jaber St.
                <br />
                Sharq, Kuwait
              </div>
            </li> -->
            <li class="c-display m-r">
              <span><i class="fas fa-envelope"></i></span>
              <div class="m-t-10">
                <a v-if="email" :href="'mailto:' + email" class="footer-link">{{ email }}</a>
              </div>
            </li>
            <!-- <li class="c-display m-l">
              <span><i class="fas fa-phone-alt"></i></span>
              <div class="m-t-10">(+965) 180 70 60</div>
            </li> -->
          </ul>
        </div>
        <div
          class="col-lg-3 col-mobile"
          data-aos="fade-up"
          data-aos-offset="300"
          data-aos-duration="600"
          data-aos-easing="ease-in-sine"
          :class="{'invisible': user && user.subscribed_newsletter }"
        >
          <h6 class="footer__h6 d-in-r">{{$t('home.newsletterTitle')}}</h6>
          <p class="newsletter__p d-in-r">
            {{$t('home.newsletterSubtitle')}}
            <!-- Keep me up to date with content, updates, and offers from
            <b class="khebrah">Khebrah</b> -->
          </p>
          <b-form class="newsletter__form">
            <label class="newsletter__label"> {{$t('home.newsletterCTA')}} </label>
            <!-- <p class="newsletter__p h-in-d">
              Keep me up to date with content, updates, and offers from
              <b class="khebrah">Khebrah</b>
            </p> -->
              <validation-observer v-if="!subscribed" immediate ref="form" v-slot="{ handleSubmit }">
                <form class="needs-validation" novalidate @submit.prevent="handleSubmit(subscribe)">
                  <div class="position-relative mt-3">
                    <base-input vid="email" rules="email|required" mode="lazy" class="newsletter-input" v-model="newsletterEmail" pill :placeholder="$t('user.enterYourEmail')"/>
                    <button :disabled="loading" class="btn search-btn">
                      <i class="fas fa-arrow-right" v-if="!loading"></i>
                      <span v-else class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    </button>
                  </div>
                </form>
              </validation-observer>
              <div v-else class="text-success">
                {{ $t('settings.subscribeEmailSuccess') }}
              </div>
            <!-- <div class="input__div">
              <b-form-input
                type="text"
                placeholder="Enter your E-mail"
                class="newsletter__input"
                v-model="newsletterEmail"
              ></b-form-input>
              <b-button href="#" class="input__a">
                <i class="fas fa-arrow-right"></i
              ></b-button>
            </div> -->
          </b-form>
        </div>
      </div>
    </div>

    <div class="footer-foot">
      <div class="container">
        <div class="logo-container logo-container-mobile">
          <img src="../../assets/img/footer-logo.png" alt="" />
        </div>
        <div class="copyrights">&copy; {{ copyright }} </div>
        <div class="footer-links">
          <template v-for="(link, i) in links" >
            <a :href="link.link" :key="i" v-if="link.link.startsWith('http')">
              {{ enLang ? link.text : link.text_ar }}
            </a>
            <router-link :to="link.link" :key="i" v-else>
              {{ enLang ? link.text : link.text_ar }}
            </router-link>
          </template>
          <!-- <b-link href="#0">Our Experts</b-link>
          <b-link href="#0">Our Blog</b-link>
          <b-link href="#0">About Us</b-link>
          <b-link href="#0">Apply as Expert</b-link>
          <b-link href="#0">login</b-link>
          <b-link href="#0">register</b-link> -->
        </div>
        <div class="socials">
          <a :href="link.link" target="_blank" v-for="(link, i) in socialLinks" :key="i">
            <i class="fab fa-facebook-f" v-if="link.key === 'facebook'"></i>
            <i class="fab fa-instagram" v-if="link.key === 'instagram'"></i>
            <i class="fab fa-linkedin-in" v-if="link.key === 'linkedin'"></i>
            <i class="fab fa-twitter" v-if="link.key === 'twitter'"></i>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
<script>
export default {
  data: () => ({
    newsletterEmail: '',
    loading: false,
    subscribed: false
  }),

  computed: {
    user() {
      return this.$store.getters['auth/user']
    },
    footer() {
      return this.$store.getters['data/footer']
    },
    links() {
      const links = this.footer.find(f => f.section_key === 'links')
      if (!links) return []
      return links.content.filter(l => l.text && l.link)
    },
    mainSection() {
      const section = this.footer.find(f => f.section_key === 'main')
      if (!section) return []
      return section.content
    },
    socialLinks() {
      const links = this.footer.find(f => f.section_key === 'social-links')
      if (!links) return {}
      return links.content
        .filter(l => l.key && l.link && ['facebook', 'twitter', 'instagram', 'linkedin'].includes(l.key))
    },
    mapImage() {
      const item = this.mainSection
        .filter(item => item.key === 'map' && item.image)[0]
      return item ? item.image : null
    },
    logo() {
      const item = this.mainSection
        .filter(item => item.key === 'logo' && item.image)[0]
      return item ? item.image : null
    },
    email() {
      const item =  this.mainSection
        .filter(item => item.key === 'email' && item.text)[0]
      return item ? item.text : null
    },
    copyright() {
      const item =  this.mainSection
        .filter(item => item.key === 'copyright' && item.text)[0]
        if (item) {
          return this.enLang ? item.text : item.text_ar
        }
      return ''
    },
    description() {
      const desc =  this.mainSection
        .filter(item => item.key === 'description' && item.text)[0]
      if (desc) {
        return this.enLang ? desc.text : desc.text_ar
      }
      return ''
    },
  },

  methods: {
    subscribe() {
      if (!this.newsletterEmail) return
      this.loading = true

      this.$store.dispatch('user/subscribeToNewsletter', this.newsletterEmail)
        .then(data => {
          this.loading = false
          this.subscribed = true
          this.newsletterEmail = ''
          // setTimeout(() => {
          //   this.$store.dispatch('user/fetchProfile')
          // }, 1000)
        })
        .catch(error => {
          this.loading = false
          this.$refs.form.setErrors({
            ...error.response.data
          })
        })

    }
  }
}
</script>
<style scoped>
/* .footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
} */
a.footer-link {
  color: unset;
}
.newsletter-input {
  border-radius: 50px;
}
.search-btn {
  color: #fff;
  top: 5px;
  z-index: 999;
  right: 3%;
  opacity: 1 !important;
}
.rtl .search-btn {
  right: unset;
  left: 3%;
  transform: rotate(180deg);
}

.rtl .footer__ul li span {
  left: unset;
  right: -35px;
}

@media (max-width: 991px) {
  .search-btn {
    right: 5px;
  }
  .rtl .search-btn {
    right: unset;
    left: 5px;
  }
}
@media (max-width: 768px) {
  .search-btn {
    top: 2px;
    right: 3px;
  }
  .rtl .search-btn {
    right: unset;
    left: 3px;
  }
}
</style>
