<script setup lang="ts">
  import { ref } from "vue";
  import { useStorage } from "@vueuse/core";

  interface StateItem {
    content: string;
    id: number;
  }

  const initState = [
    { content: "", id: 0 },
    { content: "", id: 1 },
    { content: "", id: 2 },
    { content: "", id: 3 },
    { content: "", id: 4 },
  ];
  const initStateStr = JSON.stringify(initState);

  const StateList = useStorage<StateItem[]>("Datalist", JSON.parse(initStateStr));

  const handleAddBtnClick = () => {
    const newItem: StateItem = {
      content: "",
      id: StateList.value[StateList.value.length - 1].id + 1,
    };
    StateList.value.push(newItem);
  };

  const handleCopyBtnClick = (item: StateItem) => {
    navigator.clipboard.writeText(item.content);
  };

  const handleDelectBtnClick = (index: number) => {
    StateList.value.splice(index, 1);
  };

  const clearBtn = ref<{ btnState: "clear" | "undo"; saveThelastState: StateItem[] }>({
    btnState: "clear",
    saveThelastState: [],
  });
  const handleClearBtnClick = (btnState: "clear" | "undo") => {
    if (btnState === "clear") {
      clearBtn.value.saveThelastState = StateList.value;
      StateList.value = JSON.parse(initStateStr);
      clearBtn.value.btnState = "undo";
    } else {
      StateList.value = clearBtn.value.saveThelastState;
      clearBtn.value.btnState = "clear";
    }
  };
</script>
<template>
  <div class="py-20">
    <div class="pb-4" v-for="(item, index) in StateList" :key="item.id">
      <div class="flex content-center justify-center">
        <input
          type="text"
          placeholder="Type your text here"
          class="input input-bordered w-full max-w-xs rounded-md rounded-r-none"
          v-model="item.content"
        />
        <button class="btn rounded-md rounded-l-none" @click="handleCopyBtnClick(item)">
          copy
        </button>
        <button class="btn rounded-md mx-2" @click="handleDelectBtnClick(index)">
          <!-- prettier-ignore -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" > <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /> </svg>
        </button>
      </div>
    </div>
  </div>

  <div class="fixed right-28 bottom-10 flex justify-center content-center">
    <button class="btn btn-primary rounded-md" @click="handleAddBtnClick">add</button>
    <button class="btn btn-primary rounded-md mx-2" @click="handleClearBtnClick(clearBtn.btnState)">
      <!-- prettier-ignore -->
      {{clearBtn.btnState}}
    </button>
  </div>
</template>
