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
  type: ItemType;
  path: string;
  depth: number;
  length?: number;
  children?: ItemData[];
  value?: ValueTypes;
};

export type ItemData2 = {
  key: string;
  length?: number;
  isFolder?: boolean;
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
