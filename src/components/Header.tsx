import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';

interface HeaderProps {
  isRegistrationOpen: boolean;
  onToggleRegistration: () => void;
}

export function Header({ isRegistrationOpen, onToggleRegistration }: HeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8 relative">
      <h1 className="text-white text-3xl font-bold flex-1 text-center drop-shadow-lg">
        ドッカンキャラ管理
      </h1>

      <Button
        onClick={onToggleRegistration}
        className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 z-10"
        size="icon"
      >
        {isRegistrationOpen ? (
          <Minus className="h-6 w-6 transition-transform duration-300" />
        ) : (
          <Plus className="h-6 w-6 transition-transform duration-300" />
        )}
        <span className="sr-only">
          {isRegistrationOpen ? '登録フォームを閉じる' : '登録フォームを開く'}
        </span>
      </Button>
    </div>
  );
}