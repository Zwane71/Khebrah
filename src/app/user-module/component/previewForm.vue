<template>
  <div>
    <div class="row">
      <div class="col-12 col-md-6 offset-md-3 pt-4 px-md-5">
        <ValidationObserver ref="observer">
          <b-form
            slot-scope="{ validate }"
            @submit.prevent="validate().then(applyAsExpert)"
          >
            <div class="detail-box avatar-box">
              <div class="avatar">
                <img :src="data.avatarPreview" alt="">
              </div>
              <h4 class="mt-3 mb-0">{{ profile.first_name + ' ' + profile.last_name }}</h4>
              <p>{{ data.title }}</p>
            </div>

            <div class="detail-box mt-3 mb-3 p-3 d-flex justify-content-between align-items-center">
              <div>
                {{$t('common.plan').toUpperCase()}}: {{ data.plan.new_subscription.plan_name.toUpperCase() }}
                <div>
                  <small>{{data.plan.new_subscription.price.months }} {{ monthText }}</small>
                </div>
              </div>
              <h5 class="mb-0">
                {{ data.plan.new_subscription.price.price > 0 ? parseFloat(data.plan.new_subscription.price.price).toFixed(3) + ' ' + $t('common.kd') : $t("user.free") }}
              </h5>
            </div>

            <div class="border rounded p-3 mt-3">
                <div class="item">
                  <span class="item-label">
                    {{$t('user.userName')}}:
                  </span>
                  <span>{{ data.username }}</span>
                </div>

                <div class="item">
                  <span class="item-label">
                    {{$t('user.titleLabel')}}:
                  </span>
                  <span>{{ data.title }}</span>
                </div>

                <!-- <div class="item">
                  <span class="item-label">{{$t('user.description')}}:</span>
                  <div v-html="data.description">
                  </div>
                </div> -->

                <div class="item">
                  <span class="item-label">{{$t('user.experience')}}:</span>
                  <span> {{ data.exp_since }} </span>
                </div>

                <div class="item">
                  <span class="item-label">{{$t('user.languages')}}:</span>
                  <span v-for="(lang, index) in data.language" :key="index">
                    {{ getLangName(lang) }}<span v-if="index < data.language.length - 1">, </span> 
                  </span>
                </div>

                <div class="item">
                  <span class="item-label">{{$t('user.offeredServices')}}:</span>
                  <span> {{ data.offered_services }} </span>
                </div>
            </div>

            <div class="detail-box mt-3 p-3" v-if="parseInt(data.plan.amount_to_be_paid) > 0">
              <h5>{{ $t('checkout.paymentMode') }} </h5>
              <div class="d-flex flex-column pl-2 pb-2">
                <base-radio 
                  :model-value="mode"
                  value="knet"
                  id="mode-knet"
                  @input="updateMode('knet')"
                >
                  <img class="payment-icon" src="@/assets/img/payment/knet.png" alt=""> {{$t('checkout.knet')}}
                </base-radio>
                <base-radio 
                  :model-value="mode"
                  class="mt-2"
                  value="card"
                  id="mode-card"
                  @input="updateMode('card')"
                >
                  <img class="payment-icon" src="@/assets/img/payment/visa-mastercard.png" alt=""> {{$t('checkout.card')}}
                </base-radio>
              </div>
            </div>

            <div class="mt-3 d-flex justify-content-between">
              <base-button
                type="outline-secondary pill"
                @click="back">
                {{ $t("user.back") }}
              </base-button>

              <base-button
                type="primary pill"
                :loading="loading"
                :error="errorStatus"
                :error-message="$t('common.failed')"
                @click="next">
                  {{
                    parseInt(data.plan.amount_to_be_paid) === 0
                      ? $t("user.next")
                      : $t("applyAsExpert.proceedToPayment")
                  }}
              </base-button>
            </div>

          </b-form>
        </ValidationObserver>
      </div>
    </div>
  </div>
</template>

<script>
import "@/app/base-module/util/validation_rules";

export default {
  components: {
  },
  props: {
    data: {
      default: () => {},
    },
    loading: {
      type: Boolean,
      default: false
    },
    errorStatus: {
      type: Boolean,
      default: false
    },
    mode: {
      type: String,
      default: 'knet'
    }
  },

  computed: {
    profile() {
      return this.$store.getters['user/profile']
    },
    languages() {
      return this.$store.getters['data/languages']
    },
    monthText() {
      return this.data && this.data.plan && parseInt(this.data.plan.new_subscription.price.months) === 1
        ? this.$t('common.month')
        : this.$t('common.months')
    }
  },

  methods: {
    back() {
      this.$emit("back");
    },
    next() {
      this.$emit("next");
    },
    updateMode(mode) {
      this.$emit("updateMode", mode);
    },
    getLangName(id) {
      const lang = this.languages
        .find(l => l.id === id)
      if (!lang) return ' '
      return this.enLang ? lang.name : lang.name_ar
    }
  },
};
</script>

<style scoped>
.detail-box {
  background: #f8f8f8;
  border-radius: 10px;
  border: 1px solid #e5e5e5;
}
.avatar-box {
  padding: 33px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.item-label {
  font-weight: 600;
}
.item {
  margin: 5px 0;
}

.btr {
  border-top-right-radius: 5px !important;
}

.btl {
  border-top-left-radius: 5px !important;
}

.btn-dark {
  color: #fff;
  background-color: #044982;
  border-color: #044982;
}

.btn-dark:hover {
  color: #fff;
  background-color: #044982;
  border-color: #044982;
}

.nav-pills {
  display: table !important;
  width: 100%;
}

.nav-pills .nav-link {
  border-radius: 0px;
  border-bottom: 1px solid #0d6efd40;
}

.nav-item {
  display: table-cell;
  background: #0d6efd2e;
}

.form {
  padding: 10px;
  min-height: 300px;
  width: 450px;
}

.form input,
select {
  margin-bottom: 12px;
  border-radius: 10px;
}
.country-code {
  margin-bottom: 12px;
  border-radius: 10px;
}
.form input:focus {
  box-shadow: none;
}

.form button {
  margin-top: 20px;
}

.full-height {
  height: 1200px;
}
.third-section-height {
  height: 605px;
  margin-top: -300px;
}
.rounded-corner {
  border-radius: 20px;
}
.primary-color {
  color: #044982 !important;
}
.warning {
  color: red;
}
.hidden {
  display: none;
}
.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
}
.avatar img {
  object-fit: cover;
  object-position: center center;
  width: 100%;
  height: 100%;
}
.payment-icon {
  width: 25px;
  position: relative;
  top: -3px;
}
@media (max-width: 768px) {
  .detail-box {
    font-size: 14px;
  }
  .detail-box h5 {
    font-size: 18px;
  }
}
</style>
