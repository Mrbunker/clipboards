<script setup lang="ts">
  import { ref } from "vue";

  const list = ref([
    { value: "", btnStr: "copy", id: 1 },
    { value: "", btnStr: "copy", id: 2 },
    { value: "", btnStr: "copy", id: 3 },
  ]);
  const handleAddBtnClick = () => {
    // console.log("clickCopy ");
  };
  const handleCopyBtnClick = (index: number) => {
    list.value[index].btnStr = "success!";
    setTimeout(() => {
      list.value[index].btnStr = "copy";
    }, 750);
  };

  const handleDelectBtnClick = (index: number) => {
    list.value.splice(index, 1);
  };
</script>
<template>
  <div class="py-20">
    <div class="pb-2" v-for="(item, index) in list" :key="item.id">
      <div class="flex content-center justify-center">
        <input
          type="text"
          placeholder="Type your text here"
          class="input input-bordered w-full max-w-xs rounded-md rounded-r-none"
          v-model="item.value"
        />
        <button class="btn rounded-md rounded-l-none w-32" @click="handleCopyBtnClick(index)">
          {{ item.btnStr }}
        </button>
        <button class="btn rounded-md mx-2" @click="handleDelectBtnClick(index)">
          <!-- prettier-ignore -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" > <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /> </svg>
        </button>
      </div>
    </div>
    <div class="flex justify-center content-center m-5">
      <button class="btn btn-primary w-52" @click="handleAddBtnClick">add new item</button>
    </div>
  </div>
</template>
