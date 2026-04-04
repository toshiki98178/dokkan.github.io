import { useState, useMemo, useCallback } from 'react';
import { Character, FilterState, SortOption } from '@/types/character';
import { ATTRIBUTE_ORDER } from '@/constants/attributes';

const initialFilterState: FilterState = {
  dupeFilter: '',
  attributeFilters: [],
  tagFilters: [],
  sortBy: ''
};

export function useFilters(characters: Character[]) {
  const [filters, setFilters] = useState<FilterState>(initialFilterState);

  // フィルタされたキャラクターリスト
  const filteredCharacters = useMemo(() => {
    let filtered = characters.filter(char => {
      // 凸数フィルタ
      const matchDupe = !filters.dupeFilter || char.dupe.toString() === filters.dupeFilter;

      // 属性フィルタ
      const matchAttribute =
        filters.attributeFilters.length === 0 ||
        filters.attributeFilters.includes(char.attribute);

      // タグフィルタ
      const matchTag =
        filters.tagFilters.length === 0 ||
        filters.tagFilters.some(tag => char.tags.includes(tag));

      return matchDupe && matchAttribute && matchTag;
    });

    // ソート処理
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        switch (filters.sortBy) {
          case 'dupe-desc':
            return b.dupe - a.dupe;
          case 'dupe-asc':
            return a.dupe - b.dupe;
          case 'name-asc':
            return a.name.localeCompare(b.name, 'ja');
          case 'attribute-asc': {
            const aIndex = ATTRIBUTE_ORDER.indexOf(a.attribute as any);
            const bIndex = ATTRIBUTE_ORDER.indexOf(b.attribute as any);
            return aIndex - bIndex;
          }
          default:
            return 0;
        }
      });
    }

    return filtered;
  }, [characters, filters]);

  // 凸数フィルタ更新
  const setDupeFilter = useCallback((dupe: string) => {
    setFilters(prev => ({ ...prev, dupeFilter: dupe }));
  }, []);

  // 属性フィルタ更新
  const toggleAttributeFilter = useCallback((attribute: string) => {
    setFilters(prev => ({
      ...prev,
      attributeFilters: prev.attributeFilters.includes(attribute)
        ? prev.attributeFilters.filter(attr => attr !== attribute)
        : [...prev.attributeFilters, attribute]
    }));
  }, []);

  // タグフィルタ更新
  const toggleTagFilter = useCallback((tag: string) => {
    setFilters(prev => ({
      ...prev,
      tagFilters: prev.tagFilters.includes(tag)
        ? prev.tagFilters.filter(t => t !== tag)
        : [...prev.tagFilters, tag]
    }));
  }, []);

  // ソート更新
  const setSortBy = useCallback((sortBy: SortOption) => {
    setFilters(prev => ({ ...prev, sortBy }));
  }, []);

  // 全フィルタクリア
  const clearAllFilters = useCallback(() => {
    setFilters(initialFilterState);
  }, []);

  // 属性フィルタクリア
  const clearAttributeFilters = useCallback(() => {
    setFilters(prev => ({ ...prev, attributeFilters: [] }));
  }, []);

  // タグフィルタクリア
  const clearTagFilters = useCallback(() => {
    setFilters(prev => ({ ...prev, tagFilters: [] }));
  }, []);

  // フィルタ統計情報
  const filterStats = useMemo(() => {
    return {
      total: characters.length,
      filtered: filteredCharacters.length,
      hasActiveFilters:
        filters.dupeFilter !== '' ||
        filters.attributeFilters.length > 0 ||
        filters.tagFilters.length > 0 ||
        filters.sortBy !== '',
      activeFilterCount:
        (filters.dupeFilter !== '' ? 1 : 0) +
        filters.attributeFilters.length +
        filters.tagFilters.length +
        (filters.sortBy !== '' ? 1 : 0)
    };
  }, [characters.length, filteredCharacters.length, filters]);

  return {
    filters,
    filteredCharacters,
    filterStats,
    setDupeFilter,
    toggleAttributeFilter,
    toggleTagFilter,
    setSortBy,
    clearAllFilters,
    clearAttributeFilters,
    clearTagFilters
  };
}