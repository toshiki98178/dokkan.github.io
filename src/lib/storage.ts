import { Character } from '@/types/character';
import { STORAGE_KEY } from '@/constants/attributes';

/**
 * LocalStorageからキャラクターデータを読み込み
 */
export function loadCharactersFromStorage(): Character[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load characters from localStorage:', error);
    return [];
  }
}

/**
 * キャラクターデータをLocalStorageに保存
 */
export function saveCharactersToStorage(characters: Character[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
  } catch (error) {
    console.error('Failed to save characters to localStorage:', error);
  }
}

/**
 * LocalStorageのキャラクターデータをクリア
 */
export function clearCharactersFromStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear characters from localStorage:', error);
  }
}

/**
 * LocalStorageの容量チェック（概算）
 */
export function getStorageUsage(): { used: number; available: number } {
  let used = 0;
  try {
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length;
      }
    }
  } catch (error) {
    console.error('Failed to calculate storage usage:', error);
  }

  // LocalStorageの一般的な制限は約5MB
  const available = 5 * 1024 * 1024 - used;

  return { used, available };
}