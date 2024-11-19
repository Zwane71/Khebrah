<template>
  <div class="col-lg-3 col-12">
    <aside class="applying-section">
      <div class="close-icon">
        <img
          src="../../assets/img/profile/available.svg"
          alt="close"
          @click="$emit('close')"
        />
      </div>
      <!-- <apply-section-form class="desktop-form"></apply-section-form> -->
      <div class="section" v-if="desktop">
        <div class="position-relative mt-1">
          <i class="fas fa-search search__ico" ></i>
          <base-input pill padded :placeholder="$t('expertListing.searchPlaceholder')" v-model="filters.search" ref="search" @keydown.enter="updateSearch"/>
          <button class="btn search-btn" @click.prevent="updateSearch">
            <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
      <div class="section">
        <h5>{{$t('common.category')}}</h5>
        <base-select 
          :value="filters.categories ? filters.categories[0] : null"
          :options="categories"
          @input="updateCategory"
        />
      </div>

      <div class="section" v-if="filters.categories">
        <h5>{{$t('common.keywords')}}</h5>
        <div>
          <base-tag 
            @select="toggleKeyword(keyword.id)"
            :text="enLang ? keyword.name : keyword.name_ar"
            :selectable="true"
            :selected="filters.keywords && filters.keywords.includes(keyword.id)"
            v-for="keyword in selectedCategoryKeywords" 
            :key="keyword.id" />
        </div>
      </div>

      <div class="section">
        <h5>{{$t('common.rating')}}</h5>
        <div>
          <base-radio 
            :model-value="filters.rating"
            :value="null"
            id="rating-all"
            @input="updateRating(null)"
          >
            <span class="label">
              {{ $t('expertListing.allRating') }}
            </span>
          </base-radio>
          <base-radio 
            :model-value="filters.rating"
            :value="4"
            id="rating-4"
            @input="updateRating(4)"
          >
            <span class="label">
              {{ $t('expertListing.rating4') }}
            </span>
          </base-radio>
          <base-radio 
            :model-value="filters.rating"
            :value="3"
            id="rating-3"
            @input="updateRating(3)"
          >
            <span class="label">
              {{ $t('expertListing.rating3') }}
            </span>
          </base-radio>
          <base-radio 
            :model-value="filters.rating"
            :value="2"
            id="rating-2"
            @input="updateRating(2)"
          >
            <span class="label">
              {{ $t('expertListing.rating2') }}
            </span>
          </base-radio>
        </div>
      </div>

      <div class="section">
        <h5>{{$t('common.availability')}}</h5>
        <div>
          <base-radio 
            :model-value="filters.availability"
            :value="null"
            id="availability-all"
            @input="updateAvailability(null)"
          >
            <span class="label">
              {{ $t('expertListing.allAvailability') }}
            </span>
          </base-radio>
          <base-radio 
            :model-value="filters.availability"
            value="1d"
            id="availability-1d"
            @input="updateAvailability('1d')"
          >
            <span class="label">
              <!-- {{ $t('expertListing.availNow') }} -->
              {{ $t('expertListing.availDay') }}
            </span>
          </base-radio>
          <base-radio 
            :model-value="filters.availability"
            value="3d"
            id="availability-3d"
            @input="updateAvailability('3d')"
          >
            <span class="label">
              {{ $t('expertListing.avail3Day') }}
            </span>
          </base-radio>
          <base-radio 
            :model-value="filters.availability"
            value="7d"
            id="availability-7d"
            @input="updateAvailability('7d')"
          >
            <span class="label">
              {{ $t('expertListing.availWeek') }}
            </span>
          </base-radio>
        </div>
      </div>

      <div class="section">
        <h5>{{$t('common.badges')}}</h5>
        <base-checkbox
          v-for="badge in badges"
          :key="badge.id"
          :value="filters.badges && filters.badges.includes(badge.id)"
          :id="`badge-${badge.id}`"
          @input="updateBadge($event, badge.id)"
        >
          <span class="label"> {{ enLang ? badge.badge_name : badge.badge_name_ar }} </span>
        </base-checkbox>
      </div>

      <div class="section">
        <h5>{{$t('common.location')}}</h5>
        <base-select
          :value="filters.country ? filters.country : null"
          :options="countries"
          @input="updateCountry"
        />
      </div>

      <!-- <div class="apply">
        <button class="btn">apply</button>
      </div> -->
    </aside>
  </div>
</template>

<script>
import ApplySectionForm from "./ApplySectionForm.vue";
import BaseSelect from '@/components/base/BaseSelect.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseTag from '@/components/base/BaseTag.vue'
import BaseRadio from '@/components/base/BaseRadio.vue'

export default {
  emits: ["close"],
  components: {
    BaseInput,
    BaseSelect,
    BaseTag,
    BaseRadio
    // ApplySectionForm,
  },
  props: {
    filters: {
      type: Object,
      default: () => {}
    },
    desktop: {
      type: Boolean,
      default: true
    }
  },
  data: function () {
    return {
      start: 1,
      end: 5,
      status: "inPerson",
      status1: "",
      closeSection: true,
    };
  },
  computed: {
    categories() {
      return [
        { value: -1, text: this.$t('expertListing.allCategories') },
        ...this.$store.getters['data/categories'].map(c => ({ value: c.id, text: this.enLang ? c.name : c.name_ar }))
      ]
    },
    countries() {
      return [
        { value: null, text: this.$t('expertListing.allLocation') },
        ...this.$store.getters['data/countries'].map(c => ({ value: c.id, text: this.enLang ? c.name : c.name_ar }))
      ]
    },
    categoriesHash() {
      return this.$store.getters['data/categoriesHash']
    },
    keywords() {
      return this.$store.getters['data/keywords']
    },
    badges() {
      return this.$store.getters['data/badges']
    },
    keywordsHash() {
      return this.$store.getters['data/keywordsHash']
    },
    selectedCategory() {
      return this.filters.categories && this.filters.categories[0] >= 0
        ? this.categoriesHash[this.filters.categories[0]]
        : null
    },
    selectedCategoryKeywords() {
      if(!this.selectedCategory) return this.keywords

      return this.selectedCategory.keyword
        .map(id => this.keywordsHash[id])
        .filter(keyword => keyword)
    }
  },
  methods: {
    updateCategory(value) {
      const query = { ...this.$route.query, categories: [value] }
      this.$router.push({ query })
    },
    updateCountry(value) {
      const query = { ...this.$route.query, country: value || undefined }
      this.$router.push({ query })
    },
    updateAvailability(value) {
      const query = { ...this.$route.query, availability: value || undefined }
      this.$router.push({ query })
    },
    updateRating(value) {
      const query = { ...this.$route.query, rating: value || undefined }
      this.$router.push({ query })
    },
    updateSearch() {
      const query = { ...this.$route.query, search: this.$refs.search.value }
      this.$router.push({ query })
    },
    updateBadge(value, id) {
      let { badges = [] } = this.$route.query
      badges = [].concat(badges).map(b => +b)
      if (value) {
        badges = [...badges, id]
      } else {
        badges = badges.filter(b => b !== id) 
      }
      const query = { ...this.$route.query, badges }
      this.$router.push({ query })
    },
    toggleKeyword(value) {
      let { keywords = [] } = this.$route.query
      keywords = [].concat(keywords).map(k => +k)
      if (keywords.includes(value)) {
        keywords = keywords.filter(k => k !== value) 
      } else {
        keywords = [...keywords, value]
      }
      const query = { ...this.$route.query, keywords }
      this.$router.push({ query })
    },
  }
};
</script>

<style scoped>
body {
  overflow: hidden;
}
.experties {
  margin-bottom: 0 !important;
}
.experties span {
  cursor: pointer;
}
.section {
  padding: 15px 10px;
}
.section:not(:last-child) {
  border-bottom: 1px solid #00a07269;
}
.search-btn {
  color: #fff;
  top: 10px;
  right: 7px;
  z-index: 999;
  width: 30px;
  height: 30px
}
.search__ico {
  top: 17px;
  z-index: 999;
  font-size: 17px
}
.rtl .search-btn {
  right: unset;
  left: 7px;
  transform: rotate(180deg);
}
.rtl .search__ico {
  left: unset;
  right: 15px;
}
aside {
  padding: 35px 20px;
  height: 100%;
  box-shadow: 2px 0px 4px rgba(0,0,0,0.15);
  background: #fff;
}
.label {
  color: #39425d;
  font-size: 21px;
  cursor: pointer;
  display: inline;
}
.rtl .close-icon {
  right: unset !important;
  left: 20px;
}

</style>
