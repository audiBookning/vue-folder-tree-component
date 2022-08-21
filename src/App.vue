<script setup lang="ts">
import { reactive } from "vue";
import { JsonTreeView } from "./components";
import { TreeData } from "./store/treeStore";
import { ItemData } from "./types";

/* const obj2 = {
  string: "text",
  number: 123,
  boolean: true,
  array1: [{ nodeId: "value1" }, { nodeId: "value2" }, { nodeId: "value3" }],
  array2: ["A", "B", "C"],
  object: { prop1: "value1", nestedObject: { prop2: "value2" } },
}; */

const obj: TreeData = {
  node1: {
    key: "node1",
    value: "lorem",
    isFolder: true,
    children: ["node2", "node3", "node6"],
  },
  node2: {
    key: "node2",
    value: "lorem",
    children: ["node4", "node7"],
  },
  node3: {
    key: "node3",
    value: "lorem",
    children: ["node5"],
  },
  node4: { key: "node4", value: "lorem", children: [] },
  node5: { key: "node5", value: "lorem", children: [] },
  node6: { key: "node6", value: "lorem", children: [] },
  node7: { key: "node7", value: "lorem", children: [] },
};
const state = reactive({
  json: JSON.stringify(obj),
});

function onSelected(event: unknown) {
  console.log(event);
}
function toggleSelected(event: Partial<ItemData>) {
  console.log(event);
}
</script>

<template>
  <div class="theme-light">
    <JsonTreeView
      rootKey="root"
      colorScheme="light"
      arrayKey="nodeId"
      :data="obj"
      rootNode="node1"
      :maxDepth="2"
      @selected="onSelected"
      @toggleOpen="toggleSelected"
    />
  </div>
  <div class="theme-dark">
    <JsonTreeView
      colorScheme="dark"
      :data="obj"
      rootNode="node1"
      @selected="onSelected"
      @toggleOpen="toggleSelected"
    />
  </div>
</template>

<style lang="scss" scoped>
@import "./../public/fonts/fonts.css";
//
.theme-light {
  background-color: #ffffff;
}
.theme-dark {
  background-color: #000000;
}
</style>
