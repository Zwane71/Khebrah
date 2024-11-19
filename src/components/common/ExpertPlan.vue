<template>
  <div class="card position-relative" :class="{ active: active, padded: highlight }">
    <div v-if="highlight" class="highlight py-1 text-white text-center bg-success">
      {{ highlight }}
    </div>
    <div class="card-meta p-2 d-flex justify-content-between" v-if="active">
      <div class="text-uppercase">
        {{$t('plan.currentPlan')}}
      </div>
      <div class="text-uppercase" v-if="expiry">
        <span v-if="isExpired">
          {{$t('plan.expiredOn')}} {{ formattedExpiry }}
        </span>
        <span v-else>
          {{$t('plan.expiringOn')}} {{ formattedExpiry }}
        </span>
      </div>
    </div>
    <div class="card-header">
      <div class="d-flex justify-content-center justify-content-lg-between align-items-center">
        <div>
          <h5 class="mb-1 text-center text-lg-left">
            {{ enLang ? plan.plan_name : plan.plan_name_ar }}
          </h5>
          <h6 class="mb-0 text-center text-lg-left">
            {{ enLang ? plan.plan_subtitle : plan.plan_subtitle_ar }}
          </h6>
        </div>
        <div class="text-right text-primary d-none d-lg-block">
          <div class="price-text">
            {{ oneMonthPrice }}
          </div>
          <small>
            {{ $t('plan.kdPerMonth') }}
          </small>
        </div>
      </div>
    </div>
    <div class="card-body">
      <h6 class="d-lg-none price-text font-weight-bold" :class="{ 'mt-4': !!highlight }">
        {{ oneMonthPrice }}
      </h6>
      <small class="d-lg-none">
        {{ $t('plan.kdPerMonth') }}
      </small>
      <div class="plan-description" v-html="enLang ? plan.description : plan.description_ar"></div>
      <!-- {{ plan.description }} -->
    </div>
    <div class="card-footer">
      <div class="text-center">
        <base-button type="primary" v-if="active" @click="$emit('select', plan)">
          {{$t('plan.renewPlan')}}
        </base-button>
        <base-button type="outline-secondary" @click="$emit('select', plan)" v-else>
          {{$t('plan.subscribe')}}
        </base-button>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from '@/plugins/dayjs'
export default {
  props: {
    plan: {
      type: Object,
      default: () => {}
    },
    active: {
      type: Boolean,
      default: false
    },
    expiry: {
      type: String
    }
  },

  computed: {
    formattedExpiry() {
      if (!this.expiry) return ''

      return dayjs(this.expiry).format('DD-MM-YYYY')
    },
    oneMonthPrice() {
      const monthPlan = this.plan.prices.find(p => +p.months === 1)
      // const monthPlan = this.plan.prices[0]
      if (monthPlan) {
        if (+monthPlan.price === 0) return this.$t("user.free")
        // else return monthPlan.price + ' ' +  this.$t('common.kd')
        else return monthPlan.price
      }
      return '-'
    },
    highlight() {
      return this.enLang 
        ? this.plan.highlighted_text
        : this.plan.highlighted_text_ar
    },
    isExpired() {
      if (!this.expiry) return false
      return dayjs(this.expiry).isBefore(dayjs(), 'day')
    }
  }
}
</script>

<style scoped>
.card {
  border: none;
  overflow: hidden;
}
.card-meta {
  color: #ffff;
  font-size: 14px;
}
.card-footer {
  border: 0;
  background: #fff;
}
.card-body, .card-header, .card-footer {
  border: 1px solid rgba(0, 0, 0, 0.125);
}
.card-header, .card-body {
  border-bottom: none;
}
.card-footer {
  border-top: none;
}
.card.active {
  background: #39425d;
  padding: 5px;
}
.card.active .card-header, .card.active .card-body {
  background: #fff;
}
@media (max-width: 991px) {
  .card-body {
    text-align: center;
  }
  .card-header h5 {
    margin: 0 auto;
  }
}
/* .highlight {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
} */
.price-text {
  font-weight: 900;
  font-size: 24px;
  line-height: 1;
  position: relative;
  top: 5px;
}
</style>

<style>
.plan-description {
  font-size: 15px;
}
.plan-description ul {
  padding-left: 25px;
}
.rtl .plan-description ul {
  padding-left: unset;
  padding-right: 25px;
}
.plan-description h4 {
  font-size: 1rem !important;
  margin-top: 20px;
  color: #6c757d;
}
@media (max-width: 991px) {
  .plan-description ul {
    list-style-type: none;
    padding-left: unset;
    padding-right: unset;
  }
}
</style>