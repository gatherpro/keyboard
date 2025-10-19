import { useState } from 'react';
import { Macro, ShortcutMacro } from '../types';

interface MacroEditorProps {
  macros: Macro[];
  onSaveMacro: (id: number, name: string, text: string, type?: 'text' | 'shortcut', shortcut?: ShortcutMacro) => void;
  onDeleteMacro: (id: number) => void;
}

// Shortcut presets
const SHORTCUT_PRESETS = [
  { name: 'コピー', ctrl: true, alt: false, shift: false, win: false, key: 'C' },
  { name: 'ペースト', ctrl: true, alt: false, shift: false, win: false, key: 'V' },
  { name: '切り取り', ctrl: true, alt: false, shift: false, win: false, key: 'X' },
  { name: 'アンドゥ', ctrl: true, alt: false, shift: false, win: false, key: 'Z' },
  { name: 'リドゥ', ctrl: true, alt: false, shift: false, win: false, key: 'Y' },
  { name: '全選択', ctrl: true, alt: false, shift: false, win: false, key: 'A' },
  { name: '保存', ctrl: true, alt: false, shift: false, win: false, key: 'S' },
  { name: 'ウィンドウ切替', ctrl: false, alt: true, shift: false, win: false, key: 'Tab' },
  { name: 'デスクトップ表示', ctrl: false, alt: false, shift: false, win: true, key: 'D' },
];

// Key options for dropdown
const KEY_OPTIONS = [
  // Letters
  ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)),
  // Numbers
  ...Array.from({ length: 10 }, (_, i) => String(i)),
  // Function keys
  ...Array.from({ length: 12 }, (_, i) => `F${i + 1}`),
  // Special keys
  'Tab', 'Enter', 'Esc', 'Space', 'Backspace', 'Delete',
  'Home', 'End', 'PageUp', 'PageDown',
  'Left', 'Right', 'Up', 'Down',
];

export function MacroEditor({ macros, onSaveMacro, onDeleteMacro }: MacroEditorProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editType, setEditType] = useState<'text' | 'shortcut'>('text');
  const [editText, setEditText] = useState('');
  const [editShortcut, setEditShortcut] = useState<ShortcutMacro>({
    ctrl: false,
    alt: false,
    shift: false,
    win: false,
    key: 'C',
  });
  const [showAddNew, setShowAddNew] = useState(false);

  const handleEdit = (macro: Macro) => {
    setEditingId(macro.id);
    setEditName(macro.name);
    setEditType(macro.type || 'text');
    setEditText(macro.text);
    if (macro.shortcut) {
      setEditShortcut(macro.shortcut);
    }
  };

  const handleSave = () => {
    if (editingId !== null) {
      onSaveMacro(editingId, editName, editText, editType, editType === 'shortcut' ? editShortcut : undefined);
      setEditingId(null);
      resetForm();
    }
  };

  const resetForm = () => {
    setEditName('');
    setEditType('text');
    setEditText('');
    setEditShortcut({ ctrl: false, alt: false, shift: false, win: false, key: 'C' });
  };

  const handleCancel = () => {
    setEditingId(null);
    resetForm();
    setShowAddNew(false);
  };

  const handleAddNew = () => {
    setShowAddNew(true);
    setEditingId(macros.length);
    setEditName(`マクロ ${macros.length + 1}`);
    resetForm();
  };

  const handleSaveNew = () => {
    if (editingId !== null) {
      onSaveMacro(editingId, editName, editText, editType, editType === 'shortcut' ? editShortcut : undefined);
      setShowAddNew(false);
      setEditingId(null);
      resetForm();
    }
  };

  const applyPreset = (preset: typeof SHORTCUT_PRESETS[0]) => {
    setEditShortcut({
      ctrl: preset.ctrl,
      alt: preset.alt,
      shift: preset.shift,
      win: preset.win,
      key: preset.key,
    });
  };

  const formatShortcut = (shortcut: ShortcutMacro): string => {
    const modifiers = [];
    if (shortcut.win) modifiers.push('Win');
    if (shortcut.ctrl) modifiers.push('Ctrl');
    if (shortcut.alt) modifiers.push('Alt');
    if (shortcut.shift) modifiers.push('Shift');
    return [...modifiers, shortcut.key].join('+');
  };

  const renderEditForm = (isNew: boolean) => (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-orange-800 mb-1">
          マクロ名
        </label>
        <input
          type="text"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          className="w-full px-3 py-2 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="例: コピー"
        />
      </div>

      {/* Type Selection */}
      <div>
        <label className="block text-sm font-medium text-orange-800 mb-2">
          タイプ
        </label>
        <div className="flex gap-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              checked={editType === 'text'}
              onChange={() => setEditType('text')}
              className="mr-2"
            />
            <span className="text-sm">テキスト</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              checked={editType === 'shortcut'}
              onChange={() => setEditType('shortcut')}
              className="mr-2"
            />
            <span className="text-sm">ショートカットキー</span>
          </label>
        </div>
      </div>

      {editType === 'text' ? (
        <div>
          <label className="block text-sm font-medium text-orange-800 mb-1">
            入力するテキスト
          </label>
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full px-3 py-2 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-sm"
            rows={3}
            placeholder="例: user@example.com"
          />
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-orange-800 mb-2">
            ショートカットキー設定
          </label>

          {/* Presets */}
          <div className="mb-3">
            <div className="text-xs text-gray-600 mb-2">プリセット:</div>
            <div className="flex flex-wrap gap-2">
              {SHORTCUT_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded hover:bg-blue-200"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Modifiers */}
          <div className="mb-3">
            <div className="text-xs text-gray-600 mb-2">修飾キー:</div>
            <div className="flex flex-wrap gap-3">
              {[
                { key: 'ctrl' as const, label: 'Ctrl' },
                { key: 'alt' as const, label: 'Alt' },
                { key: 'shift' as const, label: 'Shift' },
                { key: 'win' as const, label: 'Win' },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editShortcut[key]}
                    onChange={(e) => setEditShortcut({ ...editShortcut, [key]: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Key Selection */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">キー:</label>
            <select
              value={editShortcut.key}
              onChange={(e) => setEditShortcut({ ...editShortcut, key: e.target.value })}
              className="w-full px-3 py-2 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {KEY_OPTIONS.map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </div>

          {/* Preview */}
          <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-200">
            <div className="text-xs text-gray-600 mb-1">プレビュー:</div>
            <div className="font-mono text-sm font-semibold text-orange-900">
              {formatShortcut(editShortcut)}
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={isNew ? handleSaveNew : handleSave}
          className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700"
        >
          保存
        </button>
        <button
          onClick={handleCancel}
          className="px-4 py-2 bg-gray-300 text-gray-800 text-sm font-semibold rounded-lg hover:bg-gray-400"
        >
          キャンセル
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-orange-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-orange-900">マクロ管理</h3>
        <button
          onClick={handleAddNew}
          className="px-4 py-2 bg-orange-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-orange-700 transition-colors"
        >
          ＋ 新規追加
        </button>
      </div>

      <p className="text-sm text-orange-700 mb-4">
        テキストマクロやショートカットキーを設定できます（例：メールアドレス、Ctrl+C など）
      </p>

      {/* Macro List */}
      <div className="space-y-3">
        {macros.map((macro) => (
          <div
            key={macro.id}
            className="border-2 border-orange-200 rounded-lg p-4"
          >
            {editingId === macro.id ? (
              renderEditForm(false)
            ) : (
              // View mode
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-orange-900">{macro.name}</h4>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                        {macro.type === 'shortcut' ? 'ショートカット' : 'テキスト'}
                      </span>
                    </div>
                    {macro.type === 'shortcut' && macro.shortcut ? (
                      <p className="text-sm font-mono font-semibold text-orange-700 bg-orange-50 p-2 rounded mt-1">
                        {formatShortcut(macro.shortcut)}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-600 font-mono bg-gray-50 p-2 rounded mt-1">
                        {macro.text || '（テキストなし）'}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(macro)}
                      className="px-3 py-1 bg-orange-600 text-white text-xs font-semibold rounded hover:bg-orange-700"
                    >
                      編集
                    </button>
                    <button
                      onClick={() => onDeleteMacro(macro.id)}
                      className="px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded hover:bg-red-700"
                    >
                      削除
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Add New Form */}
        {showAddNew && editingId !== null && !macros.find(m => m.id === editingId) && (
          <div className="border-2 border-orange-300 rounded-lg p-4 bg-orange-50">
            {renderEditForm(true)}
          </div>
        )}

        {macros.length === 0 && !showAddNew && (
          <div className="text-center py-8 text-gray-500">
            マクロがありません。「新規追加」ボタンでマクロを追加してください。
          </div>
        )}
      </div>
    </div>
  );
}
