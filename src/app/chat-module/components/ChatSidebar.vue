<template>
<div class="chat-sidebar">
  <!-- <input type="text" v-model="query" class="form-control mb-2" placeholder="Search"> -->

  <ChatPreview v-for="room in rooms" 
    :key="room.room_name" 
    :room="room"
    @click.native="setActive(room.room_name)"
    :active="room.room_name === activeRoom"
    ></ChatPreview>
</div>
  
</template>
<script>
import ChatPreview from '@/app/chat-module/components/ChatPreview.vue'
export default {
  components: {
    ChatPreview
  },
  props: {
    activeRoom: String,
    rooms: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    query: ''
  }),
  // mounted() {
  //   this.setActive(this.rooms[0])
  // },
  computed: {
    filteredChats() {
      return this.rooms
      return this.rooms.filter(chat => chat.name.toLowerCase().includes(this.query.toLowerCase()))
    }
  },
  methods: {
    setActive(room) {
      this.$router.push({ name: 'messages', query: { room }})
    }
  }
}
</script>
<style scoped>
.chat-sidebar {
  max-height: 500px;
  overflow: auto;
  padding-right: 5px;
}
.chat-sidebar::-webkit-scrollbar {
  width: 5px;
}
.chat-sidebar::-webkit-scrollbar-thumb {
  background: #ddd;
}
</style>
