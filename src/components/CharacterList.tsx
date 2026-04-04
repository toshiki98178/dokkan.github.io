import React from 'react';
import { CharacterCard } from './CharacterCard';
import { Character } from '@/types/character';
import { Users, Search } from 'lucide-react';

interface CharacterListProps {
  characters: Character[];
  loading?: boolean;
  onEdit: (id: number, name: string, dupe: number, tags: string[], newImage?: File) => Promise<void>;
  onDelete: (id: number) => void;
  onStartEdit: (id: number) => void;
  onCancelEdit: (id: number) => void;
}

export function CharacterList({
  characters,
  loading,
  onEdit,
  onDelete,
  onStartEdit,
  onCancelEdit
}: CharacterListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-lg">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (characters.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 max-w-md mx-auto">
          <div className="mb-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              キャラクターがいません
            </h3>
            <p className="text-gray-600 mb-4">
              「＋」ボタンからキャラクターを追加してみましょう！
            </p>
          </div>

          <div className="text-sm text-gray-500 space-y-1">
            <p>💡 画像、名前、属性を設定できます</p>
            <p>🏷️ タグを使って分類できます</p>
            <p>🔍 凸数や属性でフィルタリングできます</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ヘッダー情報 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center text-white">
          <Users className="h-5 w-5 mr-2" />
          <span className="font-semibold">
            {characters.length} 体のキャラクター
          </span>
        </div>
      </div>

      {/* キャラクターカード一覧 */}
      <div className="space-y-4">
        {characters.map((character) => (
          <CharacterCard
            key={character.id}
            character={character}
            onEdit={onEdit}
            onDelete={onDelete}
            onStartEdit={onStartEdit}
            onCancelEdit={onCancelEdit}
            loading={loading}
          />
        ))}
      </div>

      {/* フッター情報 */}
      {characters.length > 10 && (
        <div className="text-center pt-6">
          <p className="text-white/80 text-sm">
            {characters.length} 体のキャラクターを表示中
          </p>
        </div>
      )}
    </div>
  );
}