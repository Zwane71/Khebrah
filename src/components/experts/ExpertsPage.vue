<template>
  <div>
    <div id="expertsPage" class="experts-page">
      <div class="experts-header" :class="{ expanded: !filters.categories }">
        <div class="container">
          <!-- Header content like filters and categories go here -->

          <div class="categories-apply" v-if="filters.categories">
            <div class="row no-gutters">
              <!-- Apply section for categories -->
              <apply-section
                :filters="filters"
                :desktop="true"
                class="desktop-apply"
                v-if="!applySectionIsVisible"
              ></apply-section>
              <apply-section
                :desktop="false"
                :filters="filters"
                @close="applySectionVisibelty"
                v-if="applySectionIsVisible"
              ></apply-section>
              <categories-section
                :filters="filters"
                :experts="experts"
                :has-more="hasMore"
                :loading="loading"
                @loadMore="loadMore"
              ></categories-section>
            </div>
          </div>

          <!-- Loading spinner to show when data is being loaded -->
          <div v-if="loading" class="loading-spinner">Loading...</div>
        </div>
      </div>

      <!-- List of Experts with infinite scroll functionality -->
      <div
        ref="expertsList"
        class="experts-list"
        @scroll="handleScroll"
        style="overflow-y: scroll; height: 500px"
      >
        <div v-for="expert in experts" :key="expert.id" class="expert-item">
          <!-- Render each expert's information here -->
          <p>{{ expert.name }}</p>
          <!-- Add more expert details as needed -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ApplySection from './ApplySection.vue';
import CategoriesSection from './CategoriesSection.vue';
import store from '@/store';
import Multiselect from 'vue-multiselect';

function prepareFilters(query) {
  const {
    categories,
    availability,
    badges,
    keywords,
    country,
    rating,
    search,
  } = query;
  const filters = {};

  if (categories !== undefined)
    filters.categories = [].concat(categories).map((k) => +k);
  if (country !== undefined) filters.country = +country;
  else filters.country = null;
  if (availability !== undefined) filters.availability = availability;
  else filters.availability = null;
  if (keywords !== undefined)
    filters.keywords = [].concat(keywords).map((k) => +k);
  if (badges !== undefined) filters.badges = [].concat(badges).map((b) => +b);
  if (rating !== undefined) filters.rating = +rating;
  else filters.rating = null;
  if (search !== undefined) filters.search = search;

  return filters;
}

export default {
  components: {
    ApplySection,
    CategoriesSection,
    Multiselect,
  },
  data() {
    return {
      applySectionIsVisible: false,
      filters: {},
      experts: [],
      page: 0,
      limit: 6,
      count: 0,
      loading: false,
    };
  },
  metaInfo: {
    title: 'Our Experts | Khebrah',
  },
  beforeRouteEnter(to, from, next) {
    const filters = prepareFilters(to.query);

    store
      .dispatch('experts/getExperts', { ...filters, limit: 6, offset: 0 })
      .then((data) => {
        next((vm) => {
          vm.filters = filters;
          vm.count = data.count;

          // if (vm.user && vm.user.pk) vm.experts = data.results.filter(expert => expert.profile.pk !== vm.user.pk)
          // else vm.experts = data.results
          vm.experts = data.results;
        });
      })
      .catch((error) => {
        console.log(error.response);
      });
  },
  beforeRouteUpdate(to, from, next) {
    const toLang = to.path.split('/')[1];
    const fromLang = from.path.split('/')[1];
    if (toLang !== fromLang) {
      next();
      return;
    }
    const filters = prepareFilters(to.query);
    this.filters = filters;
    this.page = 0; //reset page

    this.loading = true;
    store
      .dispatch('experts/getExperts', {
        ...filters,
        limit: this.limit,
        offset: this.page * this.limit,
      })
      .then((data) => {
        this.loading = false;
        this.count = data.count;
        // if (this.user && this.user.pk) this.experts = data.results.filter(expert => expert.profile.pk !== this.user.pk)
        // else this.experts = data.results
        this.experts = data.results;
        next();
      })
      .catch((error) => {
        this.loading = false;
        console.log(error.response);
      });
  },

  computed: {
    hasMore() {
      return this.count > this.experts.length;
    },
    keywords() {
      return this.$store.getters['data/keywords'];
    },
    categories() {
      // return [
      //   { id: -1, name: 'All' },
      //   ...this.$store.getters['data/categories']
      // ]

      return this.$store.getters['data/categories'];
    },
    searchOptions() {
      return [
        {
          type: 'Categories',
          items: this.categories.map((c) => ({ type: 'category', ...c })),
        },
        {
          type: 'Keywords',
          items: this.keywords.map((k) => ({ type: 'keyword', ...k })),
        },
      ];
    },
    user() {
      return this.$store.getters['auth/user'];
    },
    categoriesHash() {
      return this.$store.getters['data/categoriesHash'];
    },
    keywordsHash() {
      return this.$store.getters['data/keywordsHash'];
    },
    selectedCategory() {
      return this.filters.categories && this.filters.categories[0] >= 0
        ? this.categoriesHash[this.filters.categories[0]]
        : null;
    },
    selectedCategoryKeywords() {
      if (!this.selectedCategory) return [];

      return this.selectedCategory.keyword
        .map((id) => this.keywordsHash[id])
        .filter((keyword) => keyword);
    },
    selectedCategoryName() {
      if (!this.selectedCategory) return this.$t('expertListing.allCategories');

      return this.enLang
        ? this.selectedCategory.name
        : this.selectedCategory.name_ar;
    },
  },

  methods: {
    handleSearchInput(value) {
      const query =
        value.type === 'keyword'
          ? { categories: -1, keywords: value.id }
          : { categories: value.id };
      this.$router.push({ query });
    },
    loadMore() {
      this.page += 1;
      this.loading = true;
      store
        .dispatch('experts/getExperts', {
          ...this.filters,
          limit: this.limit,
          offset: this.page * this.limit,
        })
        .then((data) => {
          this.loading = false;
          this.count = data.count;
          // if (this.user && this.user.pk) this.experts = [...this.experts, ...data.results.filter(expert => expert.profile.pk !== this.user.pk)]
          // else this.experts = [...this.experts, ...data.results]
          this.experts = [...this.experts, ...data.results];
          next();
        })
        .catch((error) => {
          this.loading = false;
          console.log(error.response);
        });
    },
    updateSearch() {
      const query = { ...this.$route.query, search: this.$refs.search.value };
      this.$router.push({ query });
    },
    applySectionVisibelty() {
      this.applySectionIsVisible = !this.applySectionIsVisible;
      let el = document.getElementsByTagName('BODY')[0];
      if (this.applySectionIsVisible) {
        el.style.overflow = 'hidden';
      } else {
        el.style.overflow = 'visible';
      }
    },
    setCategory(category) {
      const query = { ...this.$route.query, categories: [category.id] };
      this.$router.push({ query });
      // window.scrollTo(0, 0)
    },
    toggleKeyword(value) {
      let { keywords = [] } = this.$route.query;
      keywords = [].concat(keywords).map((k) => +k);
      if (keywords.includes(value)) {
        keywords = keywords.filter((k) => k !== value);
      } else {
        keywords = [...keywords, value];
      }
      const query = { ...this.$route.query, keywords };
      this.$router.push({ query });
    },
  },
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped>
.category-select {
  color: #fff;
  margin-top: 100px;
}
.category-select h4 {
  text-decoration: underline;
  color: #fff;
}
.category-list {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 15px;
  padding-bottom: 150px;
  max-width: 700px;
  margin: 0 auto;
}
.category-item {
  height: 150px;
  border-radius: 5px;
  background: #03467c;
  color: #fff;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 19px;
  padding: 20px;
  transition: transform 0.15s;
  box-shadow: 0 2px 4px hsl(207, 97%, 13%);
}
.category-item:hover {
  transform: scale(1.01);
}
.catg-list {
  padding-bottom: 150px;
  /* max-width: 700px; */
  margin: 0 auto;
}
.search-btn {
  top: 5px !important;
  right: 27px !important;
  z-index: 999;
}
.rtl .search-btn {
  right: unset !important;
  left: 27px !important;
  transform: rotate(180deg);
}
.search__ico {
  z-index: 999 !important;
}
.rtl .search__ico {
  left: unset !important;
  right: 15px;
}
.apply-text__form {
  width: calc(100% - 53px) !important;
  padding-right: 20px;
}
.rtl .apply-text__form {
  padding-right: unset;
  padding-left: 20px;
}
.apply-text__form input {
  min-height: 50px;
}
/* .filter-icon {
  position: relative;
  top: 3px;
} */
.experts-header {
  position: relative;
  z-index: 1;
}
.experts-header:before {
  background-image: url('../../assets/img/experts/header.png');
  background-size: 100% 100%;
  background-position: top;
  background-repeat: no-repeat;

  content: '';
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  z-index: -1;
}
.experts-header.expanded {
  padding-top: 70px;
  min-height: 100vh;
  background-size: 100% 107%;
  border-bottom: 5px solid #df6951;
}
.experts-hcader.expanded:before {
  background-size: 100% 107%;
}
.rtl .experts-header:before {
  transform: scaleX(-1);
}

/deep/ .multiselect__input {
  min-height: 29px;
}
/deep/ .multiselect__placeholder {
  max-width: 90%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 0;
}
/deep/ .multiselect__select {
  display: none;
}
/deep/ .multiselect__tags {
  min-height: 50px;
  padding: 10px 40px 0 40px !important;
  border-radius: 30px;
  font-size: 16px;
  cursor: text;
}
/deep/ div.multiselect__tags {
  padding: 10px 40px 0 40px !important;
}
/deep/ .multiselect__content-wrapper {
  transition: none;
}
</style>
