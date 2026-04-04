// ドッカンバトルの属性定義
export const ATTRIBUTES = [
  "超速", "極速", "超技", "極技",
  "超知", "極知", "超力", "極力",
  "超体", "極体"
] as const;

// 属性の並び順（ソート用）
export const ATTRIBUTE_ORDER = [
  "超速", "極速", "超技", "極技",
  "超知", "極知", "超力", "極力",
  "超体", "極体"
] as const;

// 凸数オプション
export const DUPE_OPTIONS = [
  { value: 0, label: "0凸" },
  { value: 1, label: "1凸" },
  { value: 2, label: "2凸" },
  { value: 3, label: "3凸" },
  { value: 4, label: "4凸" },
] as const;

// ソートオプション
export const SORT_OPTIONS = [
  { value: "", label: "並び替えなし" },
  { value: "dupe-desc", label: "凸数：高→低" },
  { value: "dupe-asc", label: "凸数：低→高" },
  { value: "name-asc", label: "名前：五十音順" },
  { value: "attribute-asc", label: "属性：あいうえお順" },
] as const;

// LocalStorage用キー
export const STORAGE_KEY = "dokkan_characters";

// 型定義
export type AttributeType = typeof ATTRIBUTES[number];
export type DupeValue = typeof DUPE_OPTIONS[number]['value'];
export type SortValue = typeof SORT_OPTIONS[number]['value'];