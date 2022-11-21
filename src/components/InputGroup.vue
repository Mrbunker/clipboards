<script setup lang="ts">
  import { ref } from "vue";

  const list = ref([
    { value: "", id: 1 },
    { value: "", id: 2 },
  ]);
  const handleCopyBtnClick = () => {
    console.log("clickCopy ");
  };
</script>
<template>
  <div class="input-wrap" v-for="item in list" :key="item.id">
    <input v-model="item.value" />
    <button @click="handleCopyBtnClick">copy</button>
  </div>

  <h1 class="text-3xl font-bold underline">Hello world!</h1>
</template>
