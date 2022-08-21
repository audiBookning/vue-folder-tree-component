<script setup lang="ts">
import { computed, reactive, onBeforeMount, ref } from "vue";
import { then, when } from "switch-ts";
import {
  ItemData,
  SelectedData,
  ValueTypes,
  ItemType,
  ItemData2,
} from "../types";
import { TreeData, useTreeStore } from "../store/treeStore";

// NOTE: Vue cannot use type interfaces in defineProps
// if they are in an imported file...
// NOTE: the interface marks the not required property with ?
export interface ItemProps {
  nodeKey: string;
  canSelect?: boolean;
  propertyKey?: string;
}

const props = withDefaults(defineProps<ItemProps>(), {
  canSelect: false,
  folder: false,
});

const counter = useTreeStore();

const emit = defineEmits(["selected", "toggleOpen"]);

const state = reactive({
  open: false,
});

function toggleOpen(): void {
  state.open = !state.open;
  if (
    treeNode.value &&
    counter.getNodeType(props.nodeKey) === ItemType.OBJECT
  ) {
    emit("toggleOpen", {
      key: treeNode.value.key,
      value: treeNode.value.value,
      children: treeNode.value.children,
      //path: treeNode.value.path,
      path: "",
    } as SelectedData);
  }
}

function onClick(data: string): void {
  if (treeNode.value)
    emit("selected", {
      key: treeNode.value.key,
      value: treeNode.value.value,
      //path: data.path,
      path: "",
    } as SelectedData);
}

function bubbleSelected(data: Partial<ItemData>): void {
  emit("selected", data);
}

const openSelected = (data: Partial<ItemData>): void => {
  emit("toggleOpen", data);
};

function getValueColor(value: ValueTypes): string {
  return when(typeof value)
    .is((v) => v === "string", then("var(--jtv-string-color)"))
    .is((v) => v === "number", then("var(--jtv-number-color)"))
    .is((v) => v === "bigint", then("var(--jtv-number-color)"))
    .is((v) => v === "boolean", then("var(--jtv-boolean-color)"))
    .is((v) => v === "object", then("var(--jtv-null-color)"))
    .is((v) => v === "undefined", then("var(--jtv-null-color)"))
    .default(then("var(--jtv-valueKey-color)"));
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

const valueClasses = computed((): unknown => {
  return {
    "value-key": true,
    "can-select": props.canSelect,
  };
});

const treeNode = computed(() => {
  let node = counter.getNodeById(props.nodeKey);
  if (props.nodeKey) return node;
});

const lengthString = computed((): string => {
  if (treeNode.value) {
    let length = Object.keys(treeNode.value)?.length || 0;

    if (counter.getNodeType(props.nodeKey) === ItemType.ARRAY) {
      return length === 1 ? `${length} element` : `${length} elements`;
    }
    return length === 1 ? `${length} property` : `${length} properties`;
  }
  return "";
});

const dataValue = computed((): string => {
  if (treeNode.value)
    return treeNode.value.value === undefined
      ? "undefined"
      : JSON.stringify(treeNode.value.value);
  return "";
});

const nodeProperties = computed((): string[] => {
  if (treeNode.value?.children && treeNode.value?.children.length < 1)
    return Object.keys(treeNode.value);
  return [];
});

const dataType = computed((): ItemType => counter.getNodeType(props.nodeKey));
//
</script>

<!-- v-if="treeNode?.children && treeNode?.children?.length > 0" -->
<template>
  <div class="json-view-item">
    <div v-if="treeNode">
      <span v-if="!propertyKey">
        <button
          class="data-key"
          :aria-expanded="state.open ? 'true' : 'false'"
          @click.stop="toggleOpen()"
        >
          <div :class="classes"></div>
          <span class="material-symbols-outlined">{{ googleIcon }}</span>

          {{ treeNode?.key }}:
          <span class="properties">{{ lengthString }}</span>
        </button>

        <span
          v-if="state.open && treeNode?.children"
          v-for="child in treeNode?.children"
        >
          <JsonTreeViewItem
            :nodeKey="child"
            :canSelect="canSelect"
            @selected="bubbleSelected"
            @toggleOpen="openSelected"
          />
        </span>
        <span v-if="state.open && nodeProperties.length > 0">
          <span v-for="childKey in nodeProperties">
            <JsonTreeViewItem
              :nodeKey="nodeKey"
              :propertyKey="childKey"
              :canSelect="canSelect"
              @selected="bubbleSelected"
              @toggleOpen="openSelected"
            />
          </span>
        </span>
      </span>
      <span v-else class="data-key properties">
        {{ propertyKey }}: {{ treeNode[propertyKey as keyof ItemData2] }}
      </span>
    </div>
    <div
      v-if="dataType === ItemType.VALUE"
      :class="valueClasses"
      :role="canSelect ? 'button' : undefined"
      :tabindex="canSelect ? '0' : undefined"
      @click="onClick(nodeKey)"
      @keyup.enter="onClick(nodeKey)"
      @keyup.space="onClick(nodeKey)"
    >
      <span class="value-key">{{ treeNode?.key }}:</span>
      <span :style="{ color: getValueColor(treeNode?.value) }">
        {{ dataValue }}
      </span>
    </div>
  </div>
</template>

<style lang="scss">
.json-view-item:not(.root-item) {
  margin-left: 15px;
}
.value-key {
  color: var(--jtv-valueKey-color);
  font-weight: 600;
  margin-left: 10px;
  border-radius: 2px;
  white-space: nowrap;
  padding: 5px 5px 5px 10px;
  &.can-select {
    cursor: pointer;
    &:hover {
      background-color: rgba(0, 0, 0, 0.08);
    }
    &:focus {
      outline: 2px solid var(--jtv-hover-color);
    }
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
