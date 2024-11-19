<template>
  <div class="row">
    <div class="col-12 col-lg-12">
        <div class="base-box">
          <h2 class="primary-color text-center py-3">
            {{ $t("user.applyAsExpert") }}
          </h2>

          <div v-if="step >= 1" class="d-flex justify-content-center py-4 stepper-container mb-4">
            <base-stepper 
              :steps="steps" 
              :active-step="step"
              @updateStep="updateStep" />
          </div>

          <!-- <div v-if="step === -1" class="py-5"> -->
          <div class="row" v-if="step === -1">
            <div class="col-12 col-md-6 offset-md-3 pt-4 px-md-5">
              <div class="text-center my-3">
                <img
                  src="@/assets/img/close.png"
                  alt=""
                  style="width: 66px; height: 66px"
                />
                <p class="text-primary text-center mt-3">
                  {{ $t('applyAsExpert.paymentFailed') }}
                </p>

                <div class="detail-box border payment-details text-left mt-3 p-3" v-if="failedPaymentDetails">
                  <p>
                    {{ $t('common.amount')  }} : <span>{{ failedPaymentDetails.amount + ' ' + $t('common.kd') }}</span>
                  </p>
                  <p>
                    {{$t("applyAsExpert.paymentStatus")}}: <span>{{ failedPaymentDetails.state }}</span>
                  </p>
                  <p>
                    {{$t("bookings.orderNo")}}: <span>{{ failedPaymentDetails.order_no }}</span>
                  </p>
                  <p>
                    {{$t("applyAsExpert.gateway")}}: <span>{{ failedPaymentDetails.gateway_name }}</span>
                  </p>
                  <p>
                    {{$t("applyAsExpert.paidAmount")}}: <span>{{ failedPaymentDetails.total_paid_amount }} {{$t('common.kd')}}</span>
                  </p>
                  <p v-if="failedPaymentDetails.gateway_response">
                    {{$t("applyAsExpert.tranId")}}: <span>{{ failedPaymentDetails.gateway_response.tranid }}</span>
                  </p>
                  <p v-if="failedPaymentDetails.gateway_response">
                    {{$t("bookings.trackId")}}: <span>{{ failedPaymentDetails.gateway_response.trackid }}</span>
                  </p>
                  <p v-if="failedPaymentDetails.gateway_response">
                    {{$t("bookings.paymentId")}}: <span>{{ failedPaymentDetails.gateway_response.paymentid }}</span>
                  </p>

                </div>

                <base-button :loading="planLoading" class="mt-5" type="outline-primary pill" @click="retry">
                  {{ $t('applyAsExpert.retry') }}
                </base-button>
              </div>
            </div>
          </div>

          <div class="py-5" v-if="step === 0 && loading">
            <div class="text-center my-3">
              <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            </div>
          </div>

          <choose-plan
            @selectPlan="setPlan"
            :plans="plans"
            v-if="step === 1"
          />

          <expert-form
            ref="expertForm"
            :data="data"
            @back="step = 1"
            @setData="setData"
            v-if="step === 2"
          />

          <review-form
            :data="data"
            :mode="mode"
            :loading="loading"
            :error-status="errorStatus"
            @back="step = 2"
            @next="submit"
            @updateMode="updateMode"
            v-if="step === 3"
          />

          <expert-success
            v-if="subscription && step === 4"
            :data="subscription"
          />
        </div>
    </div>
  </div>
</template>

<script>

export default {
  components: {
    choosePlan: () => import("@/app/user-module/component/choosePlan.vue"),
    expertForm: () => import("@/app/user-module/component/expertForm.vue"),
    reviewForm: () => import("@/app/user-module/component/previewForm.vue"),
    expertSuccess: () => import("@/app/user-module/component/expertSuccess.vue"),
  },
  data() {
    return {// This components will have the content for each stepper step.
      step: 0,
      plans: [],
      data: {
        plan: null
      },
      mode: 'knet',
      subscription: null,
      loading: false,
      errorStatus: false,
      planLoading: false,
      failedPaymentDetails: null
    };
  },

  created() {
    // console.log(this.$route.query.order_no, this.user.is_expert)
    if (this.$route.query.order_no) {
      this.fetchOrderDetails(this.$route.query.order_no)
    } else {
      this.loading = true
      this.$store.dispatch('plan/fetchPlans')
        .then(data => {
          this.loading = false
          this.plans = data
          this.step = 1
        })
        .catch(error => console.log(error))
    }
  },

  computed: {
    steps() {
      return [
        { title: this.$t('applyAsExpert.choosePlan'), complete: !!this.data.plan || this.step > 1, disabled: this.step === 4 },
        { title: this.$t('applyAsExpert.expertProfile'), complete: this.step > 2, disabled: this.step === 4},
        { title: this.$t('applyAsExpert.review'), complete: this.step > 3, disabled: this.step === 4 },
        { title: this.$t('applyAsExpert.payment') },
      ]
    },
    user() {
      return this.$store.getters['auth/user']
    }
  },

  methods: {
    updateStep(step) {
      this.step = step
    },
    updateMode(value) {
      this.mode = value
    },
    setPlan(plan) {
      this.data.plan = plan
      this.step = 2
    },
    setData(value) {
      Object.assign(this.data,  value)
      this.step = 3
    },
    fetchOrderDetails(id) {
      this.loading = true
      this.$store.dispatch('plan/fetchPaymentDetails', id)
        .then(data => {
          this.loading = false
          if (data.status.state === 'canceled' || data.status.state === 'failed') {
            this.step = -1
            this.failedPaymentDetails = data.status
          } else {
            this.step = 4
            this.subscription = {
              payment: data.status,
              expert: data.expert,
              plan: data.plan
            }
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    retry() {
      this.planLoading = true
      this.$store.dispatch('plan/fetchPlans')
        .then(data => {
          this.planLoading = false
          this.plans = data
          this.step = 1
        })
        .catch(error => console.log(error))
    },
    submit() {
      this.loading = true

      this.$store.dispatch('user/updateUser', { username: this.data.username })
        .then(response => {
           this.updateProfile()
         })
        .catch(error => {
          this.loading = false
          this.errorStatus = true
          setTimeout(() => {
            this.errorStatus = false 
            this.step = 2
            this.$nextTick(() => {
              this.$refs.expertForm.$refs.form.setErrors({
                ...error.response.data
              })
            })
          }, 1500)
        })

    },
    updateProfile() {
      let data = {
        title: this.data.title,
        description: this.data.description,
        exp_since: this.data.exp_since,
        profile_img: this.data.avatar,
        offered_services: this.data.offered_services
      };

      const fd = new FormData()

      for (let [key, value] of Object.entries(data)) {
        fd.append(key, value)
      }

      this.$store.dispatch('user/updateProfile', { language: this.data.language })
        .then(() => {
          this.$store.dispatch('user/updateProfile', fd)
            .then((response) => {
              this.$store.dispatch('user/fetchProfile')
              // if (this.data.plan.plan_name == "Free") {
              //   this.loading = false
              //   location.reload();
              //   this.$router.push({ name: "ExpertPayment" });
              // } else {
                this.selectPlan();
              // }
            })
            .catch((error) => {
              this.loading = false
              this.errorStatus = true
              setTimeout(() => {
                this.errorStatus = false 
                this.step = 2
                this.$nextTick(() => {
                  this.$refs.expertForm.$refs.form.setErrors({
                    ...error.response.data
                  })
                })
              }, 1500)
            });
        })
        .catch(error => {
          this.loading = false
          this.errorStatus = true
          setTimeout(() => {
            this.errorStatus = false 
            this.step = 2
            this.$nextTick(() => {
              this.$refs.expertForm.$refs.form.setErrors({
                ...error.response.data
              })
            })
          }, 1500)
        })

    },
    // selectPlan() {
    //   let data = {
    //     select_plan: this.data.plan.id,
    //   };
    //   this.$store.dispatch('plan/selectPlan', data)
    //     .then(data => {
    //       this.loading = false
    //       this.redirectToPayment(data.subs_id)
    //     })
    //     .catch((error) => {
    //       this.loading = false
    //       this.errorStatus = true
    //       setTimeout(() => {
    //         this.errorStatus = false 
    //       }, 1500)
    //     });
    // },
    selectPlan() {
      this.loading = true;

      let data = {
        type: "plan",
        mode: this.mode,
        plan: this.data.plan.new_subscription.id,
        month: this.data.plan.new_subscription.price.id
      };

      this.$store.dispatch('checkout/makePayment', data )
        .then(data => {
          if (data.url) {
            window.open(data.url, "_self");
          } else {
            this.$store.dispatch('user/fetchProfile')
            this.loading = false
            this.step = 4
            this.subscription = {
              payment: data.status,
              expert: data.expert,
              plan: data.plan
            }
          }
        })
        .catch((error) => {
          this.loading = false
          this.errorStatus = true
          setTimeout(() => {
            this.errorStatus = false 
          }, 1500)
        });

      // this.$store.dispatch('plan/makePayment', { id, data })
      //   .then(data => {
      //     if (data.url) {
      //       window.open(data.url, "_self");
      //     } else {
      //       this.$store.dispatch('user/fetchProfile')
      //       this.loading = false
      //       this.step = 4
      //       this.subscription = {
      //         payment: data.status,
      //         expert: data.expert,
      //         plan: data.plan
      //       }
      //     }
      //   })
      //   .catch((error) => {
      //     this.loading = false
      //   });
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
@media (min-width: 992px) {
  .stepper-container {
    padding-left: 5rem;
    padding-right: 5rem;
  }
}
@media (min-width: 768px) {
  .base-box {
    padding: 10px 3rem;

  }
}
.payment-details {
  text-transform: uppercase;
  font-size: 14px;
}
.payment-details p:not(:first-of-type) {
  margin-top: 10px;
}
.payment-details span {
  font-weight: 600;
}
</style>
