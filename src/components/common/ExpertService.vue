<template>
  <div class="row">
    <div class="image-container rounded my-3" :class="{ 'col-lg-3': meta, 'col-lg-4': !meta }">
      <img :src="service.service_img" alt="service image" v-if="service.service_img">
    </div>
    <div class="col-lg-6 pl-0 text-start ser-name">
      <h5>{{ service.service_name }}</h5>
      <read-more
        more-str="More"
        :text="service.description || ''"
        link="#"
        less-str="Less"
        :max-chars="350"
      ></read-more>
    </div>
    <div class="col-lg-3 meta-content d-flex justify-content-center flex-column py-2 left-bor-h" v-if="meta">
        <div class="d-flex align-items-center justify-content-center">
          <!-- <i class="far fa-clock mr-2"></i> -->
          {{$t('service.duration')}}: {{ duration }}
        </div>
        <div class="d-flex price mb-3 align-items-center justify-content-center">
          <i class="far fa-money-bill-alt mr-2"></i>
          <h4 class="mb-0">{{ price }} <small>{{$t('common.kd')}}</small></h4>
        </div>

        <slot />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    service: {
      type: Object,
      required: true
    },
    meta: {
      type: Boolean,
      default: true
    }
  },

  computed: {
    duration() {
      let unit = {
        'M': 'minutes',
        'H': 'hours', 
        'D': 'days'
      }[this.service.duration_in]
      if (+this.service.duration === 1) unit = unit.slice(0, -1)
      return this.service.duration + ' ' + this.$t(`common.${unit}`)
    },
    price() {
      return parseFloat(this.service.price).toFixed(3)
    }
  }
}
</script>

<style scoped>
.image-container {
  overflow: hidden;
}
h4 {
  color:#044982; 
}
p {
  color: #707070;
}
img {
  width: 100%;
  object-fit: cover;
  object-position: center;
  border-radius: 10px;
}
.meta-content {
  border-left: 2px solid #e5e5e5 ;
  color:#044982; 
}
.rtl .meta-content {
  border-left: unset;
  border-right: 2px solid #e5e5e5 ;
}
.price {
  white-space: nowrap;
}
.price h4 {
  font-size:1.35rem !important;
}
@media only screen and (max-width: 768px) {
  .ser-name {
    text-align:center;
    }
  
    }
    @media only screen and (max-width: 992px) {
  .left-bor-h {
    border:0;
  }
  .ser-name {
    padding:0 10px !important;
    text-align:center;

    }
    }
</style>