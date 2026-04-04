import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Edit, Trash2, Save, X, Upload } from 'lucide-react';
import { Character } from '@/types/character';
import { DUPE_OPTIONS } from '@/constants/attributes';
import { useImageUpload } from '@/hooks/useImageUpload';

interface CharacterCardProps {
  character: Character;
  onEdit: (id: number, name: string, dupe: number, tags: string[], newImage?: File) => Promise<void>;
  onDelete: (id: number) => void;
  onStartEdit: (id: number) => void;
  onCancelEdit: (id: number) => void;
  loading?: boolean;
}

// 属性カラーマッピング
const getAttributeColor = (attribute: string) => {
  const colorMap: Record<string, string> = {
    '超速': 'from-blue-500 to-cyan-500',
    '極速': 'from-blue-600 to-cyan-600',
    '超技': 'from-green-500 to-emerald-500',
    '極技': 'from-green-600 to-emerald-600',
    '超知': 'from-purple-500 to-violet-500',
    '極知': 'from-purple-600 to-violet-600',
    '超力': 'from-red-500 to-pink-500',
    '極力': 'from-red-600 to-pink-600',
    '超体': 'from-orange-500 to-yellow-500',
    '極体': 'from-orange-600 to-yellow-600',
  };
  return colorMap[attribute] || 'from-gray-500 to-gray-600';
};

export function CharacterCard({
  character,
  onEdit,
  onDelete,
  onStartEdit,
  onCancelEdit,
  loading
}: CharacterCardProps) {
  const [editData, setEditData] = useState({
    name: character.name,
    dupe: character.dupe,
    tags: character.tags.join(', '),
    newImage: null as File | null
  });

  const { preview, uploading, handleFileChange, clearPreview } = useImageUpload({
    autoResize: true,
    maxWidth: 800,
    maxHeight: 600
  });

  const handleSave = async () => {
    const parsedTags = editData.tags
      .split(',')
      .map(t => t.trim())
      .filter(t => t !== '')
      .slice(0, 5);

    await onEdit(
      character.id,
      editData.name.trim() || character.name,
      editData.dupe,
      parsedTags,
      editData.newImage || undefined
    );

    // 編集データリセット
    setEditData({
      name: character.name,
      dupe: character.dupe,
      tags: character.tags.join(', '),
      newImage: null
    });
    clearPreview();
  };

  const handleCancel = () => {
    setEditData({
      name: character.name,
      dupe: character.dupe,
      tags: character.tags.join(', '),
      newImage: null
    });
    clearPreview();
    onCancelEdit(character.id);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setEditData(prev => ({ ...prev, newImage: file }));
    handleFileChange(e);
  };

  return (
    <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-5">
        {character.editing ? (
          // 編集モード
          <div className="flex items-start gap-5">
            {/* 画像編集 */}
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <div className="relative">
                <img
                  src={preview || character.image}
                  alt={character.name}
                  className="w-20 h-20 object-cover rounded-xl shadow-lg"
                />
                {uploading && (
                  <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                  </div>
                )}
              </div>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="sr-only"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="w-20 text-xs"
                  asChild
                >
                  <span>
                    <Upload className="h-3 w-3 mr-1" />
                    変更
                  </span>
                </Button>
              </label>
            </div>

            {/* 編集フィールド */}
            <div className="flex-1 space-y-3">
              <Input
                value={editData.name}
                onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                className="font-bold text-lg bg-gray-50 border-gray-200"
                placeholder="キャラクター名"
              />
              <Input
                value={editData.tags}
                onChange={(e) => setEditData(prev => ({ ...prev, tags: e.target.value }))}
                className="text-sm bg-gray-50 border-gray-200"
                placeholder="タグ（カンマ区切り）"
              />
            </div>

            {/* 右側：ステータスと操作 */}
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              <div className={`px-4 py-2 rounded-xl bg-gradient-to-r ${getAttributeColor(character.attribute)} text-white text-sm font-bold shadow-lg min-w-[70px] text-center`}>
                {character.attribute}
              </div>

              <Select
                value={editData.dupe.toString()}
                onValueChange={(value) => setEditData(prev => ({ ...prev, dupe: parseInt(value) }))}
              >
                <SelectTrigger className="w-20 text-center bg-blue-50 border-blue-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DUPE_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex gap-1 mt-2">
                <Button
                  onClick={handleSave}
                  disabled={loading || uploading}
                  size="sm"
                  className="bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <Save className="h-3 w-3" />
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  size="sm"
                  className="hover:bg-gray-100"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          // 通常モード
          <div className="flex items-center gap-5">
            {/* キャラクター画像 */}
            <img
              src={character.image}
              alt={character.name}
              className="w-20 h-20 object-cover rounded-xl shadow-lg flex-shrink-0"
            />

            {/* キャラクター情報 */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg text-gray-900 truncate">
                {character.name}
              </h3>
              {character.tags.length > 0 && (
                <p className="text-gray-600 text-sm mt-1 truncate">
                  {character.tags.join(', ')}
                </p>
              )}
            </div>

            {/* 右側：ステータスと操作 */}
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              <div className={`px-4 py-2 rounded-xl bg-gradient-to-r ${getAttributeColor(character.attribute)} text-white text-sm font-bold shadow-lg min-w-[70px] text-center`}>
                {character.attribute}
              </div>

              <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg font-bold text-sm">
                {character.dupe}凸
              </div>

              <div className="flex gap-1 mt-2">
                <Button
                  onClick={() => onStartEdit(character.id)}
                  variant="outline"
                  size="sm"
                  className="bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-600 hover:text-blue-700"
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  onClick={() => onDelete(character.id)}
                  variant="outline"
                  size="sm"
                  className="bg-red-50 hover:bg-red-100 border-red-200 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}