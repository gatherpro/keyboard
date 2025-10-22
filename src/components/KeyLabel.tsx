import { KeyLabelStyle } from '../types';

interface KeyLabelProps {
  labels: string[]; // [main, layer1, layer2, layer3]
  labelStyle: KeyLabelStyle;
}

export function KeyLabel({ labels, labelStyle }: KeyLabelProps) {
  const [main, layer1, layer2, layer3] = labels;

  if (labelStyle === '1') {
    // 1分割: メインのみ中央に大きく表示
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <span className="text-base font-bold text-gray-900 truncate px-1">
          {main || 'KC_NO'}
        </span>
      </div>
    );
  }

  if (labelStyle === '2') {
    // 2分割: メイン（上・大）とレイヤー1（下・小）
    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center gap-1 p-1">
        <span className="text-sm font-bold text-gray-900 truncate">
          {main || 'KC_NO'}
        </span>
        <span className="text-xs text-blue-600 truncate">
          {layer1 || 'KC_NO'}
        </span>
      </div>
    );
  }

  if (labelStyle === '4') {
    // 4分割: メイン（中央大）+ レイヤー1（左上）+ レイヤー2（右上）+ レイヤー3（下）
    return (
      <div className="relative w-full h-full">
        {/* レイヤー1（左上・小） */}
        <div className="absolute top-0 left-0 p-1">
          <span className="text-[10px] text-blue-600 truncate">
            {layer1 || ''}
          </span>
        </div>

        {/* レイヤー2（右上・小） */}
        <div className="absolute top-0 right-0 p-1">
          <span className="text-[10px] text-green-600 truncate">
            {layer2 || ''}
          </span>
        </div>

        {/* メイン（中央・大） */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-gray-900 truncate px-1">
            {main || 'KC_NO'}
          </span>
        </div>

        {/* レイヤー3（下・小） */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center p-1">
          <span className="text-[10px] text-purple-600 truncate">
            {layer3 || ''}
          </span>
        </div>
      </div>
    );
  }

  return null;
}
