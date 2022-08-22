<script setup lang="ts">
import { computed, PropType } from "vue";

import JsonTreeViewItem from "./JsonTreeViewItem.vue";
import { useTreeStore, TreeData } from "../store/treeStore";
import { ItemData } from "../types";

// NOTE: Vue cannot use type interfaces in defineProps
// and also have the validator...
const props = defineProps({
  data: {
    type: Object as PropType<TreeData>,
    required: false,
  },
  rootNode: {
    type: String,
    required: true,
  },
  arrayKey: {
    type: String,
    required: false,
    default: "index",
  },
  rootKey: {
    type: String,
    required: false,
    default: "/",
  },
  maxDepth: {
    type: Number,
    required: false,
    default: 1,
  },
  colorScheme: {
    type: String,
    required: false,
    default: "light",
    validator: (value: string) => ["light", "dark"].indexOf(value) !== -1,
  },
});

const treeStore = useTreeStore();

// set state
treeStore.arrayKey = props.arrayKey;
treeStore.rootKey = props.rootKey;
treeStore.maxDepth = props.maxDepth;
treeStore.colorScheme = props.colorScheme;

// set root data
if (props.data && props.rootNode) treeStore.setRoot(props.data, props.rootNode);

const emit = defineEmits(["selected", "toggleOpen"]);

const itemSelected = (data: unknown): void => {
  emit("selected", data);
};
const openSelected = (data: Partial<ItemData>): void => {
  emit("toggleOpen", data);
};
</script>

<template>
  <div v-if="rootNode">
    <JsonTreeViewItem
      :class="[{ 'root-item': true, dark: colorScheme === 'dark' }]"
      :nodeKey="rootNode"
      @selected="itemSelected"
      @toggleOpen="openSelected"
    />
  </div>
</template>

<style lang="scss" scoped>
.root-item {
  --jtv-key-color: #0977e6;
  --jtv-valueKey-color: #073642;
  --jtv-string-color: #268bd2;
  --jtv-number-color: #2aa198;
  --jtv-boolean-color: #cb4b16;
  --jtv-null-color: #6c71c4;
  --jtv-arrow-size: 6px;
  --jtv-arrow-color: #444;
  --jtv-hover-color: rgba(0, 0, 0, 0.1);
  margin-left: 0;
  width: 100%;
  height: auto;
}
.root-item.dark {
  --jtv-key-color: #80d8ff;
  --jtv-valueKey-color: #fdf6e3;
  --jtv-hover-color: rgba(255, 255, 255, 0.1);
  --jtv-arrow-color: #fdf6e3;
}
</style>
