import { defineStore } from 'pinia';

import { ItemData, ItemData2, ItemType, ValueTypes } from '../types';

export interface TreeData {
  [key: string]: ItemData2;
}

interface StoreState2 {
  rootNode: string;
  root: TreeData | null;
  json: string;
  rootKey: string;
  colorScheme?: string;
  // events
  selectedItem?: string | null;
  toggleItem?: string | null;
  draggedItem?: {
    childId: string;
    parentId: string;
  } | null;
}

export type KeyTree = keyof TreeData;
export type KeyItem = keyof ItemData2;

export const useTreeStore = defineStore("treeStoreId", {
  state: (): StoreState2 => ({
    rootNode: "",
    root: null,
    json: "",
    rootKey: "/",
    colorScheme: "light",
    // events
    selectedItem: null,
    toggleItem: null,
    draggedItem: null,
  }),
  getters: {
    getNodeType: (state) => {
      return (nodeId: string) => {
        const node = useTreeStore().getNodeById(nodeId);
        if (Array.isArray(node)) return ItemType.ARRAY;
        if (node instanceof Object) return ItemType.OBJECT;

        return ItemType.VALUE;
      };
    },
    getChildsByParent: (state) => {
      return (nodeId: string) => {
        const node = useTreeStore().getNodeById(nodeId);
        let childs: string[] = [];
        if (node && Array.isArray(node.children)) {
          childs = node.children;
        }
        return childs;
      };
    },
  },

  actions: {
    setToggleItem(nodeId: string) {
      if (this.root !== null) {
        this.toggleItem = nodeId;
      }
    },
    setSelectedItem(nodeId: string) {
      if (this.root !== null) {
        this.selectedItem = nodeId;
      }
    },
    setDraggedItem(childId: string, parentId: string) {
      if (this.root !== null) {
        this.draggedItem = { childId, parentId };
      }
    },
    setParentByChildId(childId: string, newParentId: KeyTree) {
      if (this.root !== null) {
        const temp = this.root;
        const parentId = Object.keys(temp).find((key) => {
          return temp[key].children?.includes(childId);
        });

        if (parentId && temp[newParentId] !== undefined) {
          const tempParent = temp[newParentId];
          temp[parentId].children = temp[parentId].children?.filter(
            (c) => c !== childId
          );
          temp[newParentId].children?.push(childId);
        }
      }
    },
    getNodeById(id: KeyTree) {
      if (this.root !== null && id in this.root) {
        const temp = this.root;
        return this.root[id] as ItemData2;
      }
    },
    setRoot(treeD: TreeData, rootN: string) {
      this.rootNode = rootN;
      this.root = treeD;
    },
    // TODO: Not completed
    setJson(json: string | undefined) {
      const hh = this;
      if (this.root !== null && json != null && json != undefined) {
        this.json = json;
        const data = JSON.parse(json);
        const parsed = build(this.rootKey, { ...data }, 0, "", true);
        // this.root = parsed;
      }
    },
  },
});

// TODO: To be deleted. Just kept temporarly for reference
function build(
  key: string,
  value: ValueTypes,
  depth: number,
  path: string,
  includeKey: boolean
): ItemData {
  if (value instanceof Object) {
    const children = Object.entries(value).map(([childKey, childValue]) =>
      build(
        childKey,
        childValue,
        depth + 1,
        includeKey ? `${path}${key}.` : `${path}`,
        true
      )
    );
    return {
      key,
      type: ItemType.OBJECT,
      depth,
      path,
      length: children.length,
      children: children,
    };
  } else {
    return {
      key,
      type: ItemType.VALUE,
      path: includeKey ? `${path}${key}` : path.slice(0, -1),
      depth,
      value,
    };
  }
}
