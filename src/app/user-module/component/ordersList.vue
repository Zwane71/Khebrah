

<template>
   <div>
      <h5 v-if="title" class="mb-2 px-2">{{ title }}</h5>
      <div class="table-responsive-sm border rounded d-none d-md-block" >
         <table class="table">
            <thead>
               <tr class="text-uppercase">
                  <th scope="col">{{$t('common.service')}}</th>
                  <th scope="col">{{$t('common.type')}}</th>
                  <th scope="col">{{$t('common.date')}}</th>
                  <th scope="col" v-if="type === 'bookings'">{{$t('bookings.bookedBy')}}</th>
                  <th scope="col" v-else-if="type === 'orders'">{{$t('bookings.serviceProvider')}}</th>
                  <th scope="col" v-else>{{$t('common.status')}}</th>
                  <!-- <th scope="col">TIME</th> -->
                  <th scope="col"></th>
               </tr>
            </thead>
            <tbody>
               <tr v-for="(order, index) in orders" :key="index">
                  <!-- <td class="d-flex align-items-center">
                     <div class="avatar" >
                       <img :src="order.expert_booked.profile_img" alt="person" v-if="type === 'orders' && order.expert_booked.profile_img" />
                       <div v-else>
                         {{ getInitials(order.user_ordered) }}
                       </div>
                     </div>
                     <span v-if="type === 'orders'">{{ order.expert_booked.first_name + ' ' + order.expert_booked.last_name }}</span>
                     <span v-else>{{ order.user_ordered.first_name + ' ' + order.user_ordered.last_name }}</span>
                     </td> -->
                  <td class="service-name">{{ order.service.service_name }}</td>
                  <td>
                    <div class="row">
                      <div class="col">
                        {{ getOrderTypeText(order) }}
                      </div>
                     </div>
                  </td>
                  <td class="order-date-cell">
                     {{ formatDate(order.completion_date) }}
                  </td>
                  <td v-if="type === 'bookings'">
                     {{ order.user.first_name + ' ' + order.user.last_name}}
                  </td>
                  <td v-else-if="type === 'orders'">
                     {{ order.expert.first_name + ' ' + order.expert.last_name}}
                  </td>
                  <td v-else>
                     <span :class="getOrderStatusClass(type === 'payments' ? order.expert_payment_status : order.status)">
                     {{ type === 'payments' ? order.expert_payment_status : order.status }}
                     </span>
                  </td>
                  <!-- <td>
                     <span class="table-time theme-color">9:30AM</span>
                     </td> -->
                  <td>
                     <router-link
                        class="view-button theme-color"
                        :to="orderUrl(order)"
                        ><i class="fas fa-eye mr-2"></i>{{$t('common.view')}}</router-link>
                  </td>
               </tr>
            </tbody>
         </table>
      </div>
      <div class="d-md-none d-lg-none d-xl-none d-xxl-none">
         <div class="col border rounded px-0 mx-0 mb-2 mobile-row" v-for="(order, index) in orders" :key="index">
            <div class="col py-2 border-bottom">
               <p>{{ order.service.service_name }}</p>
            </div>
            <div class="col py-2">
               <p>{{$t('common.type')}}: {{ getOrderTypeText(order) }}</p>
            </div>
            <div class="col py-2">
               <p>{{$t('common.date')}}:  {{ formatDate(order.completion_date) }} </p>
            </div>
            <div class="col py-2" v-if="type === 'bookings'">
               <p>{{$t('bookings.bookedBy')}}: {{ order.user.first_name + ' ' + order.user.last_name}} </p>
            </div>
            <div class="col py-2" v-else-if="type === 'orders'">
               <p>{{$t('bookings.serviceProvider')}}: {{ order.expert.first_name + ' ' + order.expert.last_name}} </p>
            </div>
            <div class="col py-2" v-else>
               <p>{{$t('common.status')}}: 
                     <span :class="getOrderStatusClass(type === 'payments' ? order.expert_payment_status : order.status)">
                     {{ type === 'payments' ? order.expert_payment_status : order.status }}
                     </span>
               </p>
            </div>
            <router-link
               class="view-button theme-color"
               :to="orderUrl(order)"
               ><i class="fas fa-eye mr-2"></i>{{$t('common.view')}}</router-link>
         </div>
      </div>
   </div>
</template>
<script>
   import dayjs from '@/plugins/dayjs'
   export default {
     props: {
       orders: {
         type: Array,
         default: () => []
       },
       title: {
         type: String,
       },
       type: {
         default: 'bookings'
       }
     },
     methods: {
       orderUrl(order) {
         const type = this.type === 'orders' ? 'orders' : 'bookings'
         return `${type}/${order.order_id}`
       },
       getInitials(user) {
         return (user.first_name || ' ')[0].toUpperCase() + (user.last_name || ' ')[0].toUpperCase()
       },
       getOrderTypeText(order) {
          if(order.service.service_type === 'delivery based service') {
             return this.$t('bookings.deliveryBased')
          } else if(order.online) {
             return this.$t('bookings.timeBased') + ', ' + this.$t('bookings.online')
          } else {
             return this.$t('bookings.timeBased') + ', ' + this.$t('bookings.offline')
          }
       },
       getOrderStatusClass(status) {
         return {
           booked: status === 'booked',
           completed: status === 'completed' || status === 'paid',
           cancelled: status === 'cancelled' || status === 'pending',
           'order-status': true
         }
       },
       formatDate(date) {
         if (!date) return '-'
         return dayjs(date).format('DD-MM-YYYY')
       }
     },
   }
</script>
<style scoped>
   .table td {
   padding: 0.75rem;
   }
   .avatar {
   width: 30px;
   height: 30px;
   margin-right: 5px;
   border-radius: 50%;
   overflow: hidden;
   display: flex;
   align-items: center;
   justify-content: center;
   font-size: 12px;
   color: #fff;
   background: #ed5c31;
   font-weight: 600;
   }
   .avatar img {
   object-fit: cover;
   object-position: center;
   max-width: 100%;
   }
   .order-status {
   background: aliceblue;
   padding: 5px 10px;
   border-radius: 3px;
   color: #044982;
   text-transform: uppercase;
   }
   .completed {
   color:#00a072;
   background: #00a0721c;
   }
   .cancelled {
   color: #dc3545;
   background: #fbe9eb;
   }
   .service-name {
   max-width: 150px;
   overflow: hidden;
   text-overflow: ellipsis;
   white-space: nowrap;
   }
   .order-date-cell {
   white-space: nowrap;
   }
   @media (max-width: 768px) {
      .view-button {
         position: absolute;
         right: 5px;
         bottom: 5px;
         padding: 5px 12px;
      }
      .rtl .view-button {
         right: unset;
         left: 5px;
      }
      .mobile-row {
         padding-bottom: 30px;
      }
   }
</style>

