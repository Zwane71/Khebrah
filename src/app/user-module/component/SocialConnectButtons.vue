<template>
  <div>
    <div class="provider rounded px-3 py-2 mb-2" 
      v-for="provider in providers"
      :key="provider.name"
      @click="connectWith(provider)">
      <img :src="require('@/assets/img/icons/' + provider.icon)" alt="">
      <div class="name ml-3" v-if="connectedAccount(provider)">
        {{ getName(provider) }}
      </div>
      <div class="name ml-3" v-else>
        {{$t('settings.connectWith')}} {{ provider.name }}
      </div>
      <div class="action">
        <i class="fas fa-check text-success" v-if="connectedAccount(provider)"></i>
        <i class="fas fa-plus" v-else></i>
      </div>
    </div>

    <base-modal 
      ref="removeModal"
      :title="$t('settings.removeSocialPrompt')">
      <template v-slot:footer="{ hide }">
        <base-button :disabled="loading" type="secondary" @click="hide">Close</base-button>
        <base-button :loading="loading" type="danger" :success="removeSuccess" :success-message="$t('settings.removeSocialSuccess')" @click="removeConnection()">{{$t('settings.removeSocialConfirm')}}</base-button>
      </template>
    </base-modal>
  </div>
</template>
<script>
export default {
  props: {
    type: {
      type: String,
      default: 'login'
    },
    providers: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    loading: false,
    removeSuccess: false,
    selectedProvider: null,
    errors: [],
    connectedAccounts: [],
  }),
  created() {
    this.fetchConnections()
  },

  methods: {
    connectWith(provider) {
      const connected =  this.connectedAccount(provider)
      if (connected) {
        this.selectedProvider = connected
        this.$refs.removeModal.show()
        return
      }

      // const name = provider.name.toLowerCase()
      this.errors = []
      this.$auth.authenticate(provider.id, { type: 'connect' }).then(response => {
        this.fetchConnections()

      }).catch(error => {
        console.log(error)
        if (!error.response || !error.response.data) return 
        const { non_field_errors = [], email = [] } = error.response.data
        this.errors = [...non_field_errors, ...email]
      })
    },
    getName(provider) {
      const account = this.connectedAccount(provider)
      return account.first_name || account.last_name
        ? `${account.first_name} ${account.last_name}`
        : this.$t('settings.connected')
    },
    connectedAccount(provider) {
      return this.connectedAccounts.find(c => c.plateform === provider.id)
    },
    fetchConnections() {
      this.$store.dispatch('user/fetchSocialAuths')
        .then(data => {
          this.connectedAccounts = data
        })
        .catch(e => console.log(e))
    },
    removeConnection() {
      this.loading = true
      this.$store.dispatch('user/removeSocialAuth', this.selectedProvider.id)
        .then(data => {
          this.removeSuccess = true
          this.loading = false
          this.fetchConnections()
          this.selectedProvider = null
          setTimeout(() => {
            this.removeSuccess = false
            this.$refs.removeModal.hide()
          }, 1500)
        })
        .catch(e => {
          this.loading = false
          console.log(e)
        })
    }
  },
}
</script>

<style scoped>
img {
  width: 20px;
}
.provider {
  display: flex;
  align-items: center;
  cursor: pointer;
  border: 1px solid #9e9e9e;
}
.name {
  flex: 1;
  font-size: 14px;
}
</style>