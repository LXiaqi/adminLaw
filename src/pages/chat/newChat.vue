<template>
  <div class="chat">
    <Left />
    <Content />
  </div>
</template>

<script>
import Left from '@/components/chat/left'
import Content from '@/components/chat/Content'
export default {
  components: {
    Left,
    Content,
  },
}
</script>

<style scoped>
.chat {
  display: flex;
}
</style>