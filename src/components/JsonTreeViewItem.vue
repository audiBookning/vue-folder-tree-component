<script setup lang="ts">
import { computed, reactive } from "vue";
import { then, when } from "switch-ts";
import { ItemData, KeyItem } from "./types";
import { useTreeStore } from "./store/treeStore";

// NOTE: Vue cannot use type interfaces in defineProps
// if they are in an imported file...
// NOTE: the interface marks the not required property with ?
export interface ItemProps {
  nodeKey: string;
}

const props = withDefaults(defineProps<ItemProps>(), {});

const treeStore = useTreeStore();

const state = reactive({
  open: false,
});

function toggleItem(data: MouseEvent): void {
  treeStore.setToggleItem(props.nodeKey);
  state.open = !state.open;
}

function onClick(): void {
  treeStore.setSelectedItem(props.nodeKey);
}

function getValueColor(keyValue: KeyItem) {
  if (treeNode.value) {
    return when(typeof treeNode.value[keyValue])
      .is((v) => v === "string", then("var(--jtv-string-color)"))
      .is((v) => v === "number", then("var(--jtv-number-color)"))
      .is((v) => v === "bigint", then("var(--jtv-number-color)"))
      .is((v) => v === "boolean", then("var(--jtv-boolean-color)"))
      .is((v) => v === "object", then("var(--jtv-null-color)"))
      .is((v) => v === "undefined", then("var(--jtv-null-color)"))
      .default(then("var(--jtv-valueKey-color)"));
  }
}

const classes = computed((): unknown => {
  return {
    "chevron-arrow": true,
    opened: state.open,
  };
});

const googleIcon = computed((): unknown => {
  // treeNode?.children && treeNode?.children?.length > 0
  if (treeNode.value)
    return when(treeNode.value)
      .is(
        (v) =>
          v.children !== undefined && v.children?.length > 0 && !state.open,
        then("folder")
      )
      .is(
        (v) => v.children !== undefined && v.children?.length > 0 && state.open,
        then("folder_open")
      )
      .is(
        (v) =>
          (v.children === undefined || v.children?.length < 1) && !state.open,
        then("note_add")
      )
      .is(
        (v) =>
          (v.children === undefined || v.children?.length < 1) && state.open,
        then("description")
      )
      .default(then("var(--jtv-valueKey-color)"));
});

const treeNode = computed(() => {
  let node = treeStore.getNodeById(props.nodeKey);
  return node;
});

const lengthchilds = computed((): string => {
  if (
    treeNode.value &&
    treeNode.value.children &&
    treeNode.value.children.length > 0
  ) {
    let length = treeNode.value.children.length;
    return length === 1 ? `${length} item` : `${length} items`;
  }
  return "";
});

const nodeProperties = computed((): string[] => {
  if (treeNode.value) {
    const nodeKeys = Object.keys(treeNode.value).filter(
      (key) => key !== "children"
    );
    return nodeKeys;
  }

  return [];
});

/* 
  Drag and drop
*/
const allowDrop = (evt: DragEvent) => {
  evt.preventDefault();

  return true;
};

function dragStrt(evt: DragEvent) {
  if (evt.dataTransfer && treeNode.value)
    evt.dataTransfer.setData("text", treeNode.value.key);

  return true;
}

function dropEv(evt: DragEvent) {
  evt.preventDefault();
  if (evt.dataTransfer && treeNode.value) {
    var data = evt.dataTransfer.getData("text");
    treeStore.setParentByChildId(data, treeNode.value.key);
    treeStore.setDraggedItem(data, treeNode.value.key);
  }
}

function drag(e: DragEvent) {
  //
}

function dragEnter(e: DragEvent) {
  //
}

function dragLeave(e: DragEvent) {
  //
}
function dragEnd(e: DragEvent) {
  //
  return;
}

//
</script>

<template>
  <div
    class="view-item"
    draggable="true"
    @drag.stop="drag"
    @dragstart.stop="dragStrt($event)"
    @dragover.stop="allowDrop($event)"
    @dragenter.stop="dragEnter"
    @dragleave.stop="dragLeave"
    @drop.stop="dropEv($event)"
    @dragend.stop="dragEnd"
  >
    <div v-if="treeNode">
      <button
        class="data-key"
        :aria-expanded="state.open ? 'true' : 'false'"
        @click.stop="toggleItem"
      >
        <div :class="classes"></div>
        <span class="material-symbols-outlined"> {{ googleIcon }} </span>

        {{ treeNode?.key }} :
        <span class="properties">{{ lengthchilds }}</span>
      </button>
      <span v-if="state.open && nodeProperties.length > 0" class="properties">
        <div
          v-for="childKey in nodeProperties"
          class="value-key"
          @click="onClick"
          @keyup.enter="onClick"
          @keyup.space="onClick"
        >
          <span class="value-key">{{ childKey }}:</span>
          <span :style="{ color: getValueColor(childKey as KeyItem) }">
            {{ treeNode[childKey as keyof ItemData] }}
          </span>
        </div>
      </span>
      <span v-if="treeNode?.children">
        <span
          v-if="state.open"
          v-for="child in treeNode?.children"
          :key="child"
        >
          <JsonTreeViewItem :nodeKey="child" />
        </span>
      </span>
    </div>
  </div>
</template>

<style lang="scss">
.view-item:not(.root-item) {
  margin-left: 15px;
}
.value-key {
  color: var(--jtv-valueKey-color);
  font-weight: 600;
  margin-left: 10px;
  border-radius: 2px;
  white-space: nowrap;
  padding: 5px 5px 5px 10px;

  cursor: pointer;
  &:hover {
    background-color: rgba(0, 0, 0, 0.08);
  }
  &:focus {
    outline: 2px solid var(--jtv-hover-color);
  }
}
.data-key {
  font-size: 100%;
  font-family: inherit;
  border: 0;
  background-color: transparent;
  width: 100%;
  color: var(--jtv-key-color);
  display: flex;
  align-items: center;
  border-radius: 2px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  padding: 5px;
  &:hover {
    background-color: var(--jtv-hover-color);
  }
  &:focus {
    outline: 2px solid var(--jtv-hover-color);
  }
  &::-moz-focus-inner {
    border: 0;
  }
  .properties {
    font-weight: 300;
    opacity: 0.9;
    margin-left: 4px;
    user-select: none;
  }
}
.chevron-arrow {
  flex-shrink: 0;
  border-right: 2px solid var(--jtv-arrow-color);
  border-bottom: 2px solid var(--jtv-arrow-color);
  width: var(--jtv-arrow-size);
  height: var(--jtv-arrow-size);
  margin-right: 20px;
  margin-left: 5px;
  transform: rotate(-45deg);
  &.opened {
    margin-top: -3px;
    transform: rotate(45deg);
  }
}
</style>
