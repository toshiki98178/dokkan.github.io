import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FilterX } from 'lucide-react';
import { ATTRIBUTES, DUPE_OPTIONS, SORT_OPTIONS } from '@/constants/attributes';
import { FilterState, SortOption } from '@/types/character';

interface FiltersProps {
  filters: FilterState;
  availableTags: string[];
  filterStats: {
    total: number;
    filtered: number;
    hasActiveFilters: boolean;
    activeFilterCount: number;
  };
  onDupeFilterChange: (dupe: string) => void;
  onAttributeToggle: (attribute: string) => void;
  onTagToggle: (tag: string) => void;
  onSortChange: (sortBy: SortOption) => void;
  onClearAll: () => void;
}

export function Filters({
  filters,
  availableTags,
  filterStats,
  onDupeFilterChange,
  onAttributeToggle,
  onTagToggle,
  onSortChange,
  onClearAll
}: FiltersProps) {
  return (
    <Card className="mb-5 bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
      <CardContent className="p-4">
        {/* 上段: セレクトボックス */}
        <div className="flex flex-wrap gap-3 mb-4">
          {/* 凸数フィルタ */}
          <Select value={filters.dupeFilter} onValueChange={onDupeFilterChange}>
            <SelectTrigger className="w-32 bg-gray-50 border-gray-200">
              <SelectValue placeholder="凸数すべて" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">凸数すべて</SelectItem>
              {DUPE_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* ソート */}
          <Select value={filters.sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-44 bg-gray-50 border-gray-200">
              <SelectValue placeholder="並び替えなし" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* フィルタ統計とクリアボタン */}
          <div className="flex items-center gap-3 ml-auto">
            <span className="text-sm text-gray-600">
              {filterStats.filtered} / {filterStats.total} 件
              {filterStats.activeFilterCount > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                  {filterStats.activeFilterCount}
                </span>
              )}
            </span>

            {filterStats.hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClearAll}
                className="text-gray-600 hover:text-gray-800"
              >
                <FilterX className="h-4 w-4 mr-1" />
                クリア
              </Button>
            )}
          </div>
        </div>

        {/* 属性フィルタ */}
        {ATTRIBUTES.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">属性絞り込み</h3>
            <div className="flex flex-wrap gap-2">
              {ATTRIBUTES.map(attribute => (
                <Label
                  key={attribute}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-full cursor-pointer transition-all duration-200 text-sm border-2 ${
                    filters.attributeFilters.includes(attribute)
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-blue-500 shadow-md'
                      : 'bg-gray-50 text-gray-700 border-transparent hover:bg-gray-100 hover:scale-105'
                  }`}
                >
                  <Checkbox
                    checked={filters.attributeFilters.includes(attribute)}
                    onCheckedChange={() => onAttributeToggle(attribute)}
                    className="sr-only"
                  />
                  <span>{attribute}</span>
                </Label>
              ))}
            </div>
          </div>
        )}

        {/* タグフィルタ */}
        {availableTags.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">タグ絞り込み</h3>
            <div className="flex flex-wrap gap-2">
              {availableTags.map(tag => (
                <Label
                  key={tag}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-full cursor-pointer transition-all duration-200 text-sm border-2 ${
                    filters.tagFilters.includes(tag)
                      ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white border-green-500 shadow-md'
                      : 'bg-gray-50 text-gray-700 border-transparent hover:bg-gray-100 hover:scale-105'
                  }`}
                >
                  <Checkbox
                    checked={filters.tagFilters.includes(tag)}
                    onCheckedChange={() => onTagToggle(tag)}
                    className="sr-only"
                  />
                  <span>{tag}</span>
                </Label>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}