<template>
  <div>
    <dashboard-header :title="$t('dashboard.services')">
      <base-button
        type="primary"
        @click="$router.push({ name: 'CreateService' })"
        ><i
          class="fas fa-plus-circle mr-2"
        ></i>
        {{$t('service.addService')}}
        </base-button>
    </dashboard-header>

    <div
      class="mb-4"
      v-for="(service, index) in services" 
      :key="service.id" >

      <expert-service 
        :service="service" 
        :meta="true">

        <div class="d-flex justify-content-center">
          <base-button
            class="mr-2"
            type="muted-primary pill small"
            @click="editService(service)"
          >{{$t('common.edit')}}</base-button>
          <base-button
            type="muted-danger pill small"
            @click="showModal(service)"
          >{{$t('common.delete')}}</base-button>
        </div>

      </expert-service>

      <hr v-if="index < services.length - 1">
    </div>

    <div class="d-flex justify-content-end">
      <base-pagination 
        :count="count" 
        :limit="limit" 
        :current-page="page" 
        @change="changePage" />
    </div>

    <base-modal 
      ref="cancelModal"
      :title="$t('service.deletePrompt')">
      <template v-slot:footer="{ hide }">
        <base-button :disabled="loading" type="secondary" @click="hide">{{$t('common.close')}}</base-button>
        <base-button :loading="loading" type="danger" :success="deleteSuccess" :success-message="$t('service.deleteSuccess')" @click="deleteService(currentService)">{{$t('service.deleteConfirmation')}}</base-button>
      </template>
    </base-modal>
  </div>
</template>

<script>
import DashboardHeader from '@/components/dashboard/DashboardHeader.vue'
import ExpertService from '@/components/common/ExpertService.vue'
import store from '@/store'

export default {
  components: {
    DashboardHeader,
    ExpertService
  },
  data() {
    return {
      servicePageType: "create",
      services: [],
      limit: 5,
      page: 0,
      count: 0,
      currentService: null,
      loading: false,
      deleteSuccess: false
    };
  },
  metaInfo: {
    title: 'Services'
  },
  beforeRouteEnter(to, from, next) {
    store.dispatch('user/fetchServices', { offset: 0, limit: 5 })
      .then(data => {
        next(vm => {
          vm.count = data.count
          vm.services = data.results
        })
      })
      .catch(error => {
        console.log(error)
      })
  },
  computed: {
    user() {
      return this.$store.getters['auth/user']
    }
  },
  methods: {
    showModal(service) {
      this.currentService = service;
      this.$refs["cancelModal"].show();
    },
    hideModal() {
      this.$refs["cancelModal"].hide();
    },
    editService(service) {
      this.$router.push({ name: "editService", params: { id: service.id } });
    },
    deleteService(service) {
      this.loading = true;

      this.$store.dispatch('services/deleteService', service.id)
        .then((response) => {
          this.loading = false;
          this.deleteSuccess = true

          setTimeout(() => {
            this.deleteSuccess = false
            this.$refs["cancelModal"].hide();
          }, 1500)

          this.getServices();
        })
        .catch((error) => {
          this.loading = false;
          this.errorFromApi = true;
        });
    },
    getServices() {
      this.$store.dispatch('user/fetchServices', { offset: 0, limit: this.limit })
        .then(data => {
          this.count = data.count
          this.services = data.results
        })
        .catch((error) => {
          console.log("error", error.response);
        });
    },
    changePage(page) {
      this.page = page
      this.$Progress.start()
      store.dispatch('user/fetchServices', { offset: this.page * this.limit, limit: this.limit })
        .then(data => {
          this.$Progress.finish()
          this.count = data.count
          this.services = data.results
        })
    },
  },
};
</script>
