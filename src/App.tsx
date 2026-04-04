import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { CharacterForm } from '@/components/CharacterForm';
import { Filters } from '@/components/Filters';
import { CharacterList } from '@/components/CharacterList';
import { useCharacters } from '@/hooks/useCharacters';
import { useFilters } from '@/hooks/useFilters';
import { CharacterFormData } from '@/types/character';

function App() {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

  const {
    characters,
    loading,
    error,
    addCharacter,
    deleteCharacter,
    startEdit,
    saveEdit,
    cancelEdit,
    getAllTags,
    clearError
  } = useCharacters();

  const {
    filters,
    filteredCharacters,
    filterStats,
    setDupeFilter,
    toggleAttributeFilter,
    toggleTagFilter,
    setSortBy,
    clearAllFilters
  } = useFilters(characters);

  const availableTags = getAllTags();

  const handleToggleRegistration = () => {
    setIsRegistrationOpen(!isRegistrationOpen);
  };

  const handleSubmitCharacter = async (formData: CharacterFormData) => {
    const success = await addCharacter(formData);
    if (success) {
      setIsRegistrationOpen(false);
    }
  };

  const handleDeleteCharacter = (id: number) => {
    if (window.confirm('このキャラクターを削除しますか？')) {
      deleteCharacter(id);
    }
  };

  const handleSaveEdit = async (
    id: number,
    name: string,
    dupe: number,
    tags: string[],
    newImage?: File
  ) => {
    await saveEdit(id, name, dupe, tags, newImage);
  };

  return (
    <div className="min-h-screen custom-scrollbar">
      {/* ヘッダー */}
      <Header
        isRegistrationOpen={isRegistrationOpen}
        onToggleRegistration={handleToggleRegistration}
      />

      {/* 登録フォーム */}
      <CharacterForm
        isOpen={isRegistrationOpen}
        onClose={() => setIsRegistrationOpen(false)}
        onSubmit={handleSubmitCharacter}
        loading={loading}
      />

      {/* エラー表示 */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-300 rounded-lg text-red-700">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={clearError}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* フィルタ */}
      <Filters
        filters={filters}
        availableTags={availableTags}
        filterStats={filterStats}
        onDupeFilterChange={setDupeFilter}
        onAttributeToggle={toggleAttributeFilter}
        onTagToggle={toggleTagFilter}
        onSortChange={setSortBy}
        onClearAll={clearAllFilters}
      />

      {/* キャラクター一覧 */}
      <CharacterList
        characters={filteredCharacters}
        loading={loading}
        onEdit={handleSaveEdit}
        onDelete={handleDeleteCharacter}
        onStartEdit={startEdit}
        onCancelEdit={cancelEdit}
      />

      {/* フッター情報（デバッグ情報） */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-black/20 rounded-lg text-white text-sm">
          <p>デバッグ情報:</p>
          <p>総キャラクター数: {characters.length}</p>
          <p>表示中: {filteredCharacters.length}</p>
          <p>利用可能タグ: {availableTags.length}</p>
        </div>
      )}
    </div>
  );
}

export default App;