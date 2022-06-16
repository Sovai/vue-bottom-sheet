<template>
<button @click="openSheet">Open</button>
  <TheSheet
    title="Bottom Sheet"
    ref="sheetRef"
    headerCls="px-24 pt-32"
    closeOnClickOutside
  >
  <div>
    <div v-for="i in 60" :key="i">
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aliquid, rerum
      voluptates illum ratione porro quidem. Aliquid laudantium magnam placeat
      recusandae unde, velit nobis error eius odio minima sed! Porro, fugiat.
    </div>
  </div>
  </TheSheet>

</template>
<script setup>
import { nextTick } from 'vue'
import TheSheet from "@/components/TheSheet.vue";
const sheetRef = ref(null);
async function openSheet() {
  await nextTick();
  sheetRef.value.setOpen();
}
</script>
