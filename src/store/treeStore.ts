import { defineStore } from 'pinia';
import { then, when } from 'switch-ts';

import { ItemData, ItemData2, ItemType, ValueTypes } from '../types';

interface StoreState {
  root: ItemData | null;
  json: string;
  arrayKey?: string;
  folderFlag?: boolean;
  rootKey: string;
  maxDepth?: number;
  colorScheme?: string;
}

export interface TreeData {
  [key: string]: ItemData2;
}

interface StoreState2 {
  rootNode: string;
  root: TreeData | {};
  json: string;
  arrayKey?: string;
  folderFlag?: boolean;
  rootKey: string;
  maxDepth?: number;
  colorScheme?: string;
}

export const useTreeStore = defineStore("treeStoreId", {
  state: (): StoreState2 => ({
    rootNode: "",
    root: {},
    json: "",
    arrayKey: "index",
    folderFlag: false,
    rootKey: "/",
    maxDepth: 1,
    colorScheme: "light",
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
    getNodeById(id: keyof TreeData) {
      if (id in this.root) {
        // @ts-ignore
        return this.root[id] as ItemData2;
      }
    },
    setRoot(treeD: TreeData, rootN: string) {
      this.rootNode = rootN;
      this.root = treeD;
    },
    setJson(json: string | undefined) {
      const hh = this;
      if (json != null && json != undefined) {
        this.json = json;
        const data = JSON.parse(json);
        const parsed = build(this.rootKey, { ...data }, 0, "", true);
        this.root = parsed;
      }
    },
  },
});

function build(
  key: string,
  value: ValueTypes,
  depth: number,
  path: string,
  includeKey: boolean,
  arrayKeyArg: string = "index"
): ItemData {
  if (value instanceof Object) {
    if (value instanceof Array) {
      const arrayKey: boolean =
        arrayKeyArg !== undefined || arrayKeyArg !== "index";
      const children = value.map((element, index) =>
        build(
          arrayKey && element[arrayKeyArg] ? arrayKeyArg : index.toString(),
          element,
          depth + 1,
          includeKey ? `${path}${key}[${index}].` : `${path}`,
          false
        )
      );
      return {
        key,
        type: ItemType.ARRAY,
        depth,
        path,
        length: children.length,
        children,
      };
    }

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
