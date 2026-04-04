import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { ATTRIBUTES, DUPE_OPTIONS } from '@/constants/attributes';
import { useImageUpload } from '@/hooks/useImageUpload';
import { CharacterFormData } from '@/types/character';

interface CharacterFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: CharacterFormData) => Promise<void>;
  loading?: boolean;
}

export function CharacterForm({ isOpen, onClose, onSubmit, loading }: CharacterFormProps) {
  const [formData, setFormData] = useState<CharacterFormData>({
    name: '',
    image: null,
    dupe: 0,
    attribute: '',
    tags: ''
  });

  const { preview, uploading, error, handleFileChange, clearPreview } = useImageUpload({
    autoResize: true,
    maxWidth: 800,
    maxHeight: 600
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.image) {
      return;
    }

    await onSubmit(formData);

    // フォームリセット
    setFormData({
      name: '',
      image: null,
      dupe: 0,
      attribute: '',
      tags: ''
    });
    clearPreview();
    onClose();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, image: file }));
    handleFileChange(e);
  };

  const handleClose = () => {
    setFormData({
      name: '',
      image: null,
      dupe: 0,
      attribute: '',
      tags: ''
    });
    clearPreview();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Card className="mb-6 bg-white/95 backdrop-blur-sm border-white/20 shadow-xl animate-in slide-in-from-top-2 duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-gray-900">キャラ登録</CardTitle>
          <CardDescription>新しいキャラクターを追加します</CardDescription>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="w-8 h-8 rounded-full hover:bg-gray-100"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* キャラクター名 */}
          <div className="space-y-2">
            <Label htmlFor="name">キャラクター名 *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="キャラクター名を入力"
              className="bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          {/* 画像アップロード */}
          <div className="space-y-2">
            <Label htmlFor="image">画像 *</Label>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="sr-only"
                  required
                />
                <Label
                  htmlFor="image"
                  className="flex items-center justify-center w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  {preview ? (
                    <img
                      src={preview}
                      alt="プレビュー"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-center">
                      <Upload className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                      <span className="text-xs text-gray-500">選択</span>
                    </div>
                  )}
                </Label>
                {uploading && (
                  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">
                  JPEG、PNG、GIF、WebPに対応
                </p>
                <p className="text-xs text-gray-500">
                  最大5MB、自動リサイズされます
                </p>
              </div>
            </div>
            {error && (
              <p className="text-sm text-red-600 mt-1">{error}</p>
            )}
          </div>

          {/* 凸数 */}
          <div className="space-y-2">
            <Label htmlFor="dupe">凸数</Label>
            <Select
              value={formData.dupe.toString()}
              onValueChange={(value) => setFormData(prev => ({ ...prev, dupe: parseInt(value) }))}
            >
              <SelectTrigger className="bg-gray-50 border-gray-200">
                <SelectValue placeholder="凸数を選択" />
              </SelectTrigger>
              <SelectContent>
                {DUPE_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value.toString()}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 属性 */}
          <div className="space-y-2">
            <Label htmlFor="attribute">属性 *</Label>
            <Select
              value={formData.attribute}
              onValueChange={(value) => setFormData(prev => ({ ...prev, attribute: value }))}
            >
              <SelectTrigger className="bg-gray-50 border-gray-200">
                <SelectValue placeholder="属性を選択" />
              </SelectTrigger>
              <SelectContent>
                {ATTRIBUTES.map(attr => (
                  <SelectItem key={attr} value={attr}>
                    {attr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* タグ */}
          <div className="space-y-2">
            <Label htmlFor="tags">タグ</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="タグをカンマ区切りで入力（最大5個）"
              className="bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500">
              例: LR, 変身, かめはめ波
            </p>
          </div>

          <Button
            type="submit"
            disabled={loading || uploading || !formData.name.trim() || !formData.image || !formData.attribute}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                追加中...
              </>
            ) : (
              'キャラクターを追加'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}