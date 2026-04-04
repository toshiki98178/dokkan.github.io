import { useState, useCallback } from 'react';
import { fileToBase64, validateImageFile, resizeImage } from '@/lib/image';

interface UseImageUploadOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  autoResize?: boolean;
}

export function useImageUpload(options: UseImageUploadOptions = {}) {
  const {
    maxWidth = 800,
    maxHeight = 600,
    quality = 0.8,
    autoResize = false
  } = options;

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // 画像アップロード処理
  const uploadImage = useCallback(async (file: File): Promise<string | null> => {
    setUploading(true);
    setError(null);

    try {
      // ファイル検証
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        setError(validation.error || '無効な画像ファイルです');
        return null;
      }

      // Base64変換
      let base64 = await fileToBase64(file);

      // 自動リサイズが有効な場合
      if (autoResize) {
        try {
          base64 = await resizeImage(base64, maxWidth, maxHeight, quality);
        } catch (resizeError) {
          console.warn('画像のリサイズに失敗しました:', resizeError);
          // リサイズに失敗しても元の画像を使用
        }
      }

      setPreview(base64);
      return base64;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '画像のアップロードに失敗しました';
      setError(errorMessage);
      console.error('Image upload error:', err);
      return null;
    } finally {
      setUploading(false);
    }
  }, [maxWidth, maxHeight, quality, autoResize]);

  // プレビュー画像をクリア
  const clearPreview = useCallback(() => {
    setPreview(null);
    setError(null);
  }, []);

  // エラーをクリア
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ファイル入力変更ハンドラ
  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await uploadImage(file);
    } else {
      clearPreview();
    }
  }, [uploadImage, clearPreview]);

  // ドラッグ＆ドロップハンドラ
  const handleDrop = useCallback(async (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      await uploadImage(file);
    } else {
      setError('画像ファイルをドロップしてください');
    }
  }, [uploadImage]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
  }, []);

  const handleDragEnter = useCallback((event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
  }, []);

  return {
    uploading,
    error,
    preview,
    uploadImage,
    clearPreview,
    clearError,
    handleFileChange,
    handleDrop,
    handleDragOver,
    handleDragEnter,
    handleDragLeave
  };
}

// 複数画像アップロード用のフック
export function useMultipleImageUpload(options: UseImageUploadOptions = {}) {
  const [uploads, setUploads] = useState<Array<{
    id: string;
    file: File;
    base64?: string;
    uploading: boolean;
    error?: string;
  }>>([]);

  const addImages = useCallback(async (files: File[]) => {
    const newUploads = files.map(file => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      uploading: true
    }));

    setUploads(prev => [...prev, ...newUploads]);

    // 各ファイルを順次処理
    for (const upload of newUploads) {
      try {
        const validation = validateImageFile(upload.file);
        if (!validation.isValid) {
          setUploads(prev => prev.map(u =>
            u.id === upload.id
              ? { ...u, uploading: false, error: validation.error }
              : u
          ));
          continue;
        }

        const base64 = await fileToBase64(upload.file);
        setUploads(prev => prev.map(u =>
          u.id === upload.id
            ? { ...u, uploading: false, base64 }
            : u
        ));
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'アップロードに失敗しました';
        setUploads(prev => prev.map(u =>
          u.id === upload.id
            ? { ...u, uploading: false, error: errorMessage }
            : u
        ));
      }
    }
  }, []);

  const removeImage = useCallback((id: string) => {
    setUploads(prev => prev.filter(u => u.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setUploads([]);
  }, []);

  const getSuccessfulUploads = useCallback(() => {
    return uploads.filter(u => u.base64 && !u.error && !u.uploading);
  }, [uploads]);

  return {
    uploads,
    addImages,
    removeImage,
    clearAll,
    getSuccessfulUploads
  };
}