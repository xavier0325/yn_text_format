<script setup lang="ts">
import Home from "@/views/Home.vue";
</script>

<template>
  <div class="header">芋泥的文本格式化</div>
  <Home></Home>
</template>

<style scoped less>
.header {
  font-size: 40px;
  font-weight: bold;
  background-image: url(@/assets/loading.gif);
  background-position: center;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  z-index: 9999;
}
</style>
