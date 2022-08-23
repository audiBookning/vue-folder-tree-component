import { defineStore } from 'pinia';

import { ItemData, KeyTree, StoreState, TreeData } from '../types';

export const useTreeStore = defineStore("treeStoreId", {
  state: (): StoreState => ({
    rootNode: "",
    root: {},
    json: "",
    colorScheme: "light",
    // events
    // NOTE: is there a need to have state for this? Won't the actions suffice?
    selectedItem: null,
    toggleItem: null,
    draggedItem: null,
  }),
  getters: {},

  actions: {
    setToggleItem(nodeId: string) {
      this.toggleItem = nodeId;
    },
    setSelectedItem(nodeId: string) {
      this.selectedItem = nodeId;
    },
    setDraggedItem(childId: string, parentId: string) {
      this.draggedItem = { childId, parentId };
    },
    setParentByChildId(childId: string, newParentId: KeyTree) {
      const temp = this.root;
      const parentId = Object.keys(temp).find((key) => {
        return temp[key].children?.includes(childId);
      });

      if (parentId && temp[newParentId] !== undefined) {
        temp[parentId].children = temp[parentId].children?.filter(
          (c) => c !== childId
        );
        temp[newParentId].children?.push(childId);
      }
    },
    getNodeById(id: KeyTree) {
      if (id in this.root) {
        return this.root[id] as ItemData;
      }
    },
    setRoot(treeD: TreeData, rootN: string) {
      this.rootNode = rootN;
      this.root = treeD;
    },
  },
});
