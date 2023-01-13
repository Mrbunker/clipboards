<script setup lang="ts">
  import { computed, ref } from "vue";
  import { onKeyStroke, useActiveElement, useStorage } from "@vueuse/core";

  interface IStateItem {
    content: string;
    id: number;
  }

  const initState: IStateItem[] = [
    { content: "", id: 0 },
    { content: "", id: 1 },
    { content: "", id: 2 },
    { content: "", id: 3 },
    { content: "", id: 4 },
  ];
  const initStateStr = JSON.stringify(initState);
  const stateList = useStorage<IStateItem[]>("Datalist", JSON.parse(initStateStr));

  /** stateList 中，第一个 content 为空的下标 */
  const emptyIndex = computed(() => {
    return stateList.value.findIndex((item) => {
      if (item.content === "") return item;
    });
  });

  const currentCopyIdx = useStorage<number>("currentCopyIdx", 0);
  const setCurrentCopyIdx = (idx: number) => {
    currentCopyIdx.value = idx;
  };

  const currentCopyText = ref("");

  // !todo settings.json
  const settingJson = {
    trim: true,
    showCopyItemBtn: false,
    showPasteItemBtn: false,
  };
  const settings = useStorage<typeof settingJson>(
    "settings",
    JSON.parse(JSON.stringify(settingJson)),
  );

  /** 格式化，去尾空格 */
  const getFormatText = (text: string) => {
    if (settings.value.trim) return text.trim();
    else return text;
  };

  const handleDelectBtnClick = (index: number) => {
    stateList.value.splice(index, 1);
  };

  const handleInputChange = () => {
    // 完成新的输入后不允许 undo clear
    if (clearBtn.value.btnState === "undoClear") clearBtn.value.btnState = "clearList";
  };

  const clearBtn = ref<{ btnState: "clearList" | "undoClear"; saveThelastState: IStateItem[] }>({
    btnState: "clearList",
    saveThelastState: [],
  });

  const handleClear = (btnState: "clearList" | "undoClear") => {
    if (btnState === "clearList") {
      clearBtn.value.saveThelastState = stateList.value;
      stateList.value = JSON.parse(initStateStr);
      clearBtn.value.btnState = "undoClear";
    } else {
      stateList.value = clearBtn.value.saveThelastState;
      clearBtn.value.btnState = "clearList";
    }
  };

  const handleNewItem = () => {
    stateList.value.push({
      content: "",
      id: stateList.value[stateList.value.length - 1].id + 1,
    });
  };

  const handlePaste = async (str?: string) => {
    const clipText = getFormatText(await navigator.clipboard.readText());

    // 如果有空的输入框，就插入到空输入框中，否则新开一个
    if (emptyIndex.value !== -1) {
      stateList.value[emptyIndex.value].content = clipText;
    } else {
      stateList.value.push({
        content: str ?? clipText,
        id: stateList.value[stateList.value.length - 1].id + 1,
      });
    }
  };

  const handleCopyItem = (item: IStateItem) => {
    navigator.clipboard.writeText(item.content);
    currentCopyText.value = item.content;
  };

  const handleCopy = () => {
    if (currentCopyIdx.value === stateList.value.length) {
      // 复制到底
      currentCopyIdx.value = 0;
      currentCopyText.value = "";
    } else {
      currentCopyText.value = stateList.value[currentCopyIdx.value].content;
      navigator.clipboard.writeText(currentCopyText.value);
      currentCopyIdx.value = currentCopyIdx.value + 1;
    }
  };

  /** 当按下 ctrl+v 时 */
  onKeyStroke(["v", "V"], (e) => {
    // 完成新的输入后不允许 undo clear
    if (clearBtn.value.btnState === "undoClear") clearBtn.value.btnState = "clearList";

    // 正在聚焦输入框时，不触发快捷键
    const activeElement = useActiveElement();
    if (activeElement.value?.dataset.hotKeyEnable === "disable") return;

    if (!e.ctrlKey) return;
    e.preventDefault();
    handlePaste();
  });

  /** 当按下 ctrl+c 时 */
  onKeyStroke(["c", "C"], (e) => {
    // 正在聚焦输入框时，不触发快捷键
    const activeElement = useActiveElement();
    if (activeElement.value?.dataset.hotKeyEnable === "disable") return;

    if (!e.ctrlKey) return;
    e.preventDefault();
    handleCopy();
  });
</script>
<template>
  <div class="p-6">
    <div>
      <span class="px-1">Copyed:</span>
      <span class="rounded-md px-2 text-primary-content bg-primary-focus">{{
        currentCopyText
      }}</span>
      <!-- <div>{{ currentCopyIdx }}</div> -->
    </div>
  </div>
  <div class="py-16">
    <div class="pb-2" v-for="(item, index) in stateList" :key="item.id">
      <div class="flex content-center justify-center">
        <input
          type="text"
          :tabindex="index + 1"
          placeholder="Type your text here"
          class="input input-bordered w-full max-w-md rounded-md rounded-r-none"
          data-hot-key-enable="disable"
          @input="handleInputChange()"
          spellcheck="false"
          v-model="item.content"
        />

        <button
          class="btn w-6 mr-2 rounded-md rounded-l-none"
          :class="{
            'bg-primary-focus': index === currentCopyIdx,
            'bg-neutral': index !== currentCopyIdx,
          }"
          title="set as copy target"
          @click="setCurrentCopyIdx(index)"
        ></button>

        <button v-if="settings.showCopyItemBtn" class="btn mr-2" @click="handleCopyItem(item)">
          copy
        </button>

        <button
          class="btn bg-neutral p-3 rounded-md"
          title="delete"
          @click="handleDelectBtnClick(index)"
        >
          <!-- prettier-ignore -->
          <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 14L34 34" stroke="#333" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 34L34 14" stroke="#333" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>
    </div>
    <div class="flex content-center justify-center m-2">
      <button class="btn rounded-md mr-2" @click="handleNewItem">input +1</button>
      <!-- <button class="btn rounded-md">import long text</button> -->
    </div>
  </div>

  <div class="fixed right-10 bottom-10 flex justify-center content-center">
    <button class="btn btn-primary rounded-md mr-2" @click="handleCopy">copy</button>
    <button
      v-if="settings.showPasteItemBtn"
      class="btn btn-primary rounded-md mr-2"
      @click="handlePaste()"
    >
      paste
    </button>
    <button class="btn btn-primary rounded-md mr-2" @click="handleClear(clearBtn.btnState)">
      {{ clearBtn.btnState === "clearList" ? "clear" : "undo" }}
    </button>

    <div class="dropdown dropdown-hover dropdown-top dropdown-end">
      <label class="btn btn-primary rounded-md">settings</label>
      <ul class="dropdown-content menu p-2 shadow bg-base-100 rounded-box">
        <label class="label cursor-pointer">
          <span class="label-text">trim space</span>
          <input type="checkbox" class="toggle" v-model="settings.trim" />
        </label>
        <label class="label cursor-pointer">
          <span class="label-text pr-4">showCopyItemBtn</span>
          <input type="checkbox" class="toggle" v-model="settings.showCopyItemBtn" />
        </label>
        <label class="label cursor-pointer">
          <span class="label-text">showPasteItemBtn</span>
          <input type="checkbox" class="toggle" v-model="settings.showPasteItemBtn" />
        </label>
      </ul>
    </div>
  </div>
</template>
