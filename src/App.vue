<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <div class="app-container">
    <!-- <div class="wrapper">
      <RouterLink to="/">Home</RouterLink>
    </div> -->

    <RouterView />
  </div>
</template>

<style lang="scss">
body {
  margin: 0;
}
.app-container {
  padding: 0;
  margin: 0;
  background: black;
  position: relative;
  height: 120vh;
  width: 100vw;
}
</style>
