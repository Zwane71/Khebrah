<template>
  <div>
    <div class="row">
      <div class="col-12 col-md-6 offset-md-3 pt-4 px-md-5">

        <div v-if="data.payment" class="detail-box mb-3 p-3 d-flex justify-content-center align-items-center">
          <img src="@/assets/img/success.svg" alt="" class="mr-2 success-img">
          {{$t("applyAsExpert.paymentSuccess")}}
        </div>

        <div class="detail-box avatar-box">
          <h2 class="mb-3">{{$t("applyAsExpert.youAreExpert")}}</h2>
          <div class="avatar">
            <img :src="profile.profile_img" alt="">
          </div>
          <h4 class="mt-3 mb-0">{{ profile.first_name + ' ' + profile.last_name }}</h4>
          <p>{{ profile.title }}</p>
        </div>

        <div class="detail-box mt-3 p-3 d-flex justify-content-between align-items-center">
          <span>
            {{$t('common.plan').toUpperCase()}}: <span class="font-weight-bold">{{ data.plan.plan_name.toUpperCase() }}</span>
          </span>
          <h5 class="mb-0">
            {{ data.payment.total_paid_amount > 0 ? parseFloat(data.payment.total_paid_amount).toFixed(3) + ' ' + $t('common.kd') : $t("user.free") }}
          </h5>
        </div>

        <div class="border payment-details rounded p-3 mt-3" v-if="data.payment && data.payment.gateway_response">
          <p>
            {{$t("applyAsExpert.paymentSuccess")}}: <span>{{ data.payment.state }}</span>
          </p>
          <p>
            {{$t("applyAsExpert.paidAmount")}}: <span>{{ data.payment.total_paid_amount }} {{$t('common.kd')}}</span>
          </p>
          <p v-if="data.payment.gateway_response">
            {{$t("applyAsExpert.tranId")}}: <span>{{ data.payment.gateway_response.tranid }}</span>
          </p>
        </div>

        <base-button
          class="mt-3"
          type="primary block"
          :to="{ name: 'services' }">
          {{$t("applyAsExpert.addServices")}}
        </base-button>
        <base-button
          class="mt-2"
          type="outline-secondary block"
          :to="{ name: 'availability' }">
          {{$t("applyAsExpert.addAvailability")}}
        </base-button>
        <base-button
          class="mt-2"
          type="outline-secondary block"
          :to="{ name: 'EditProfile' }">
          {{$t("applyAsExpert.goToProfile")}}
        </base-button>
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
  },

  computed: {
    profile() {
      return this.$store.getters['user/profile']
    }
  },

  methods: {
    back() {
      this.$emit("back");
    },
    next() {
      this.$emit("next");
    },
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
.payment-details {
  text-transform: uppercase;
  font-size: 14px;
}
.payment-details p {
  margin-top: 10px;
}
.payment-details span {
  font-weight: 600;
}
.success-img {
  width: 19px;
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
