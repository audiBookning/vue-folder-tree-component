<script setup lang="ts">
import { reactive } from "vue";
import { JsonTreeView, TreeData, useTreeStore } from "./components";

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
  node5: { key: "node5", value: "lorem", boolValue: true, children: [] },
  node6: { key: "node6", value: "lorem", children: [] },
  node7: { key: "node7", value: "lorem", children: [] },
};
const state = reactive({
  json: JSON.stringify(obj),
});

useTreeStore().$onAction(
  ({
    name, // name of the action
    store, // store instance, same as `someStore`
    args, // array of parameters passed to the action
    after, // hook after the action returns or resolves
    onError, // hook if the action throws or rejects
  }) => {
    switch (name) {
      case "setToggleItem":
        after((_result) => {
          console.log(`Toggled Item: ${args}.`);
        });
        break;
      case "setSelectedItem":
        after((_result) => {
          console.log(`Selected Item: ${args}.`);
        });
        break;
      case "setDraggedItem":
        after((_result) => {
          console.log(`Dragged Item ${args[0]} to ${args[1]}.`);
        });
        break;
      default:
        break;
    }
  }
);
</script>

<template>
  <div>
    <JsonTreeView colorScheme="dark" :data="obj" rootNode="node1" />
  </div>
</template>

<style lang="scss" scoped></style>
