export interface Character {
  id: number;
  name: string;
  image: string; // Base64エンコード文字列
  dupe: number; // 0-4の凸数
  attribute: string; // 属性（例：超速、極速など）
  tags: string[]; // タグ配列（最大5個）
  editing?: boolean; // 編集モード用フラグ
  originalData?: { // 編集キャンセル用バックアップ
    name: string;
    image: string;
    dupe: number;
    tags: string[];
  };
}

export interface CharacterFormData {
  name: string;
  image: File | null;
  dupe: number;
  attribute: string;
  tags: string;
}

export interface FilterState {
  dupeFilter: string; // 凸数フィルタ（空文字列は全て）
  attributeFilters: string[]; // 選択された属性の配列
  tagFilters: string[]; // 選択されたタグの配列
  sortBy: SortOption; // ソート方式
}

export type SortOption =
  | ''
  | 'dupe-desc'
  | 'dupe-asc'
  | 'name-asc'
  | 'attribute-asc';

export interface CharacterFilters {
  dupe?: string;
  attributes?: string[];
  tags?: string[];
}