<template>
  <div id="reviews" class="reviews-section tab-d">
    <div class="rating">
      <div class="pattern-bg2"></div>
      <span class="num" v-if="expert.ratings.length">{{ expert.avg_rating.toFixed(2) }}</span>
      <div class="stars" v-if="expert.ratings.length">
        <base-rating :value="expert.avg_rating" />
        <p>{{ expert.avg_rating }} {{$t('profilePage.outOf')}} 5</p>
      </div>
      <div class="stars" v-else>
        {{ $t('profilePage.noReviews') }}
      </div>
      <span class="count" v-if="expert.ratings.length">{{ $t('profilePage.clientReviews') }} : {{ expert.ratings.length }}</span>
    </div>
    <hr class="hr" />
    <div v-for="rating in expert.ratings" :key="rating.id">
      <div class="rating-details">
        <div class="client-info">
          <div>
            <base-avatar
              size="small"
              :is-expert="rating.user_detail.is_expert"
              :src="rating.user_detail.profile_img"
              :first-name="rating.user_detail.first_name"
              :last-name="rating.user_detail.last_name"
              />
              <div>
                <div class="name-info">
                  <span class="name">
                    {{ rating.user_detail.first_name + ' ' + rating.user_detail.last_name }}
                    <!-- <span class="location">
                      <img src="../../assets/img/profile/pin2.svg" alt="pin" />
                      Kuwait
                    </span> -->
                  </span>
                </div>
                <div class="d-flex pl-4 align-items-center">
                  <em class="text-muted">{{$t('profilePage.for')}}</em>
                  <h6 class="mb-0 ml-2">{{ rating.service_title }}</h6>
                </div>
              </div>
          </div>
          <span class="date">{{ formatDate(rating.date_created) }}</span>
        </div>
        <p>
          {{ rating.review }}
        </p>
      </div>
      <hr class="hr" />
    </div>
  </div>
</template>

<script>
import dayjs from '@/plugins/dayjs'
import BaseRating from '@/components/base/BaseRating.vue'
import BaseAvatar from '@/components/base/BaseAvatar.vue'
export default {
  props: {
    expert: {
      type: Object,
      required: true
    }
  },
  components: {
    BaseRating,
    BaseAvatar
  },
  methods: {
    formatDate(date) {
      if (!date) return '-'
      return dayjs(date).format('DD-MM-YYYY')
    }
  }
}
</script>