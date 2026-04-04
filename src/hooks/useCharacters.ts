import { useState, useEffect, useCallback } from 'react';
import { Character, CharacterFormData } from '@/types/character';
import { loadCharactersFromStorage, saveCharactersToStorage } from '@/lib/storage';
import { fileToBase64 } from '@/lib/image';

export function useCharacters() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 初期化時にLocalStorageからデータを読み込み
  useEffect(() => {
    try {
      const savedCharacters = loadCharactersFromStorage();
      setCharacters(savedCharacters);
    } catch (err) {
      setError('キャラクターデータの読み込みに失敗しました');
      console.error(err);
    }
  }, []);

  // キャラクターを保存（LocalStorageに自動保存）
  const saveCharacters = useCallback((newCharacters: Character[]) => {
    try {
      setCharacters(newCharacters);
      saveCharactersToStorage(newCharacters);
      setError(null);
    } catch (err) {
      setError('キャラクターデータの保存に失敗しました');
      console.error(err);
    }
  }, []);

  // キャラクター追加
  const addCharacter = useCallback(async (formData: CharacterFormData): Promise<boolean> => {
    if (!formData.name || !formData.image) {
      setError('名前と画像は必須です');
      return false;
    }

    if (!formData.attribute) {
      setError('属性を選択してください');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const image = await fileToBase64(formData.image);
      const tags = formData.tags
        .split(',')
        .map(t => t.trim())
        .filter(t => t !== '')
        .slice(0, 5);

      const newCharacter: Character = {
        id: Date.now(),
        name: formData.name,
        image,
        dupe: formData.dupe,
        attribute: formData.attribute,
        tags
      };

      const updatedCharacters = [...characters, newCharacter];
      saveCharacters(updatedCharacters);
      return true;
    } catch (err) {
      setError('キャラクターの追加に失敗しました');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [characters, saveCharacters]);

  // キャラクター更新
  const updateCharacter = useCallback(async (
    id: number,
    updates: Partial<Omit<Character, 'id'>>
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const updatedCharacters = characters.map(char => {
        if (char.id === id) {
          return { ...char, ...updates };
        }
        return char;
      });

      saveCharacters(updatedCharacters);
      return true;
    } catch (err) {
      setError('キャラクターの更新に失敗しました');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [characters, saveCharacters]);

  // キャラクター削除
  const deleteCharacter = useCallback((id: number): boolean => {
    try {
      const updatedCharacters = characters.filter(char => char.id !== id);
      saveCharacters(updatedCharacters);
      return true;
    } catch (err) {
      setError('キャラクターの削除に失敗しました');
      console.error(err);
      return false;
    }
  }, [characters, saveCharacters]);

  // 編集モード開始
  const startEdit = useCallback((id: number) => {
    const updatedCharacters = characters.map(char => {
      if (char.id === id) {
        return {
          ...char,
          editing: true,
          originalData: {
            name: char.name,
            image: char.image,
            dupe: char.dupe,
            tags: [...char.tags]
          }
        };
      }
      return char;
    });

    setCharacters(updatedCharacters);
  }, [characters]);

  // 編集保存
  const saveEdit = useCallback(async (
    id: number,
    name: string,
    dupe: number,
    tags: string[],
    newImage?: File
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      let image: string | undefined;
      if (newImage) {
        image = await fileToBase64(newImage);
      }

      const updatedCharacters = characters.map(char => {
        if (char.id === id) {
          const updated = {
            ...char,
            name: name.trim() || char.name,
            dupe,
            tags: tags.slice(0, 5),
            editing: false
          };

          if (image) {
            updated.image = image;
          }

          delete updated.originalData;
          return updated;
        }
        return char;
      });

      saveCharacters(updatedCharacters);
      return true;
    } catch (err) {
      setError('編集の保存に失敗しました');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [characters, saveCharacters]);

  // 編集キャンセル
  const cancelEdit = useCallback((id: number) => {
    const updatedCharacters = characters.map(char => {
      if (char.id === id && char.originalData) {
        return {
          ...char,
          name: char.originalData.name,
          image: char.originalData.image,
          dupe: char.originalData.dupe,
          tags: char.originalData.tags,
          editing: false,
          originalData: undefined
        };
      }
      return char;
    });

    setCharacters(updatedCharacters);
  }, [characters]);

  // 全てのタグを取得（重複なし、あいうえお順）
  const getAllTags = useCallback((): string[] => {
    const tagSet = new Set<string>();

    characters.forEach(char => {
      char.tags.forEach(tag => {
        if (tag.trim()) {
          tagSet.add(tag.trim());
        }
      });
    });

    return Array.from(tagSet).sort((a, b) => a.localeCompare(b, 'ja'));
  }, [characters]);

  return {
    characters,
    loading,
    error,
    addCharacter,
    updateCharacter,
    deleteCharacter,
    startEdit,
    saveEdit,
    cancelEdit,
    getAllTags,
    clearError: () => setError(null)
  };
}