export interface SelectedData {
  key: string;
  value: string;
  path: string;
  chidren?: ItemData[];
}

export enum ItemType {
  OBJECT,
  ARRAY,
  VALUE,
}

export type ItemData = {
  key: string;
  length?: number;
  isFolder?: boolean;
  boolValue?: boolean;
  children?: string[];
  value?: ValueTypes;
};

export type ValueTypes =
  | unknown
  | string
  | number
  | bigint
  | boolean
  | undefined;

export interface TreeData {
  [key: string]: ItemData;
}

export interface StoreState {
  rootNode: string;
  root: TreeData;
  json: string;
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
export type KeyItem = keyof ItemData;
