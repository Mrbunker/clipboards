<script setup lang="ts">
  import { computed, ref } from "vue";
  import { onKeyStroke, useActiveElement, useStorage } from "@vueuse/core";

  interface StateItem {
    content: string;
    id: number;
  }

  const initState: StateItem[] = [
    { content: "", id: 0 },
    { content: "", id: 1 },
    { content: "", id: 2 },
    { content: "", id: 3 },
    { content: "", id: 4 },
  ];
  const initStateStr = JSON.stringify(initState);
  const StateList = useStorage<StateItem[]>("Datalist", JSON.parse(initStateStr));

  /** StateList 中，第一个 content 为空的下标 */
  const emptyIndex = computed(() => {
    return StateList.value.findIndex((item) => {
      if (item.content === "") return item;
    });
  });

  const currentCopyIndex = useStorage<number>("currentCopyIndex", 0);

  // !todo settings.json
  const settings = useStorage<{ trim: boolean; quick: boolean }>(
    "settings",
    JSON.parse(
      JSON.stringify({
        trim: true,
        quick: true,
      }),
    ),
  );

  const getFormatText = (text: string) => {
    if (settings.value.trim) return text.trim();
    else return text;
  };

  const handlePaste = async (str?: string) => {
    const clipText = getFormatText(await navigator.clipboard.readText());
    // 如果有空的输入框，就插入到空输入框中，否则新开一个
    if (emptyIndex.value !== -1) {
      StateList.value[emptyIndex.value].content = clipText;
    } else {
      const newItem: StateItem = {
        content: str ?? clipText,
        id: StateList.value[StateList.value.length - 1].id + 1,
      };
      StateList.value.push(newItem);
    }
  };

  const handleCopyItem = (item: StateItem) => {
    navigator.clipboard.writeText(item.content);
  };

  const handleCopy = () => {
    currentCopyIndex.value = currentCopyIndex.value + 1;
  };

  const handleDelectBtnClick = (index: number) => {
    StateList.value.splice(index, 1);
  };

  const handleInputChange = () => {
    // 完成新的输入后不允许 undo clear
    if (clearBtn.value.btnState === "undo") clearBtn.value.btnState = "clear";
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

  /** 当按下 ctrl+v 时 */
  onKeyStroke(["v", "V"], (e) => {
    // 完成新的输入后不允许 undo clear
    if (clearBtn.value.btnState === "undo") clearBtn.value.btnState = "clear";

    // 正在聚焦输入框时，不触发粘贴快捷键
    const activeElement = useActiveElement();
    if (activeElement.value?.dataset.type === "input") return;

    if (!e.ctrlKey) return;
    e.preventDefault();
    handlePaste();
  });
</script>
<template>
  <div class="py-16">
    <div class="pb-2" v-for="(item, index) in StateList" :key="item.id">
      <div class="flex content-center justify-center">
        <input
          type="text"
          placeholder="Type your text here"
          class="input input-bordered w-full max-w-xs rounded-md rounded-r-none"
          data-type="input"
          @input="handleInputChange()"
          spellcheck="false"
          v-model="item.content"
        />
        <button class="btn rounded-md rounded-l-none" @click="handleCopyItem(item)">copy</button>
        <button class="btn rounded-md mx-2" @click="handleDelectBtnClick(index)">
          <!-- prettier-ignore -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" > <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /> </svg>
        </button>
      </div>
    </div>
  </div>

  <div class="fixed right-10 bottom-10 flex justify-center content-center">
    <button class="btn btn-primary rounded-md mr-2" @click="handleCopy">copy</button>
    <button class="btn btn-primary rounded-md mr-2" @click="handlePaste()">paste</button>
    <button class="btn btn-primary rounded-md" @click="handleClearBtnClick(clearBtn.btnState)">
      {{ clearBtn.btnState }}
    </button>
  </div>
</template>
