<script setup lang="ts">
import { reactive } from "vue";
import { JsonTreeView } from "./components";
import { TreeData } from "./store/treeStore";
import { ItemData } from "./types";
import { useTreeStore } from "./store/treeStore";

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

function onSelected(event: unknown) {
  console.log(event);
}
function toggleSelected(event: Partial<ItemData>) {
  console.log(event);
}

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
          console.log(`setToggleItem to: ${args}.`);
        });
        break;
      case "setSelectedItem":
        after((_result) => {
          console.log(`setSelectedItem to: ${args}.`);
        });
        break;
      case "setDraggedItem":
        after((_result) => {
          console.log(`setDraggedItem child ${args[0]} to: ${args[1]}.`);
        });
        break;
      default:
        break;
    }

    // this will trigger if the action succeeds and after it has fully run.
    // it waits for any returned promised
  }
);
</script>

<template>
  <div class="theme-light">
    <JsonTreeView
      rootKey="root"
      colorScheme="light"
      :data="obj"
      rootNode="node1"
    />
  </div>
  <!-- <div class="theme-dark">
    <JsonTreeView
      colorScheme="dark"
      :data="obj"
      rootNode="node1"
    />
  </div> -->
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
