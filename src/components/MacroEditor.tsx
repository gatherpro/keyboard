import { useState } from 'react';

interface Macro {
  id: number;
  name: string;
  text: string;
}

interface MacroEditorProps {
  macros: Macro[];
  onSaveMacro: (id: number, name: string, text: string) => void;
  onDeleteMacro: (id: number) => void;
  onLoadMacros: (onProgress?: (current: number, total: number) => void) => Promise<void>;
}

export function MacroEditor({ macros, onSaveMacro, onDeleteMacro, onLoadMacros }: MacroEditorProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editText, setEditText] = useState('');
  const [showAddNew, setShowAddNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState({ current: 0, total: 0 });

  const handleEdit = (macro: Macro) => {
    setEditingId(macro.id);
    setEditName(macro.name);
    setEditText(macro.text);
  };

  const handleSave = () => {
    if (editingId !== null) {
      onSaveMacro(editingId, editName, editText);
      setEditingId(null);
      setEditName('');
      setEditText('');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditName('');
    setEditText('');
    setShowAddNew(false);
  };

  const handleAddNew = () => {
    setShowAddNew(true);
    setEditingId(macros.length);
    setEditName(`マクロ ${macros.length + 1}`);
    setEditText('');
  };

  const handleSaveNew = () => {
    if (editingId !== null) {
      onSaveMacro(editingId, editName, editText);
      setShowAddNew(false);
      setEditingId(null);
      setEditName('');
      setEditText('');
    }
  };

  const handleLoadMacros = async () => {
    setLoading(true);
    setLoadProgress({ current: 0, total: 0 });
    try {
      await onLoadMacros((current, total) => {
        setLoadProgress({ current, total });
      });
    } finally {
      setLoading(false);
      setLoadProgress({ current: 0, total: 0 });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-orange-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-orange-900">マクロ管理</h3>
        <div className="flex gap-2">
          <button
            onClick={handleLoadMacros}
            disabled={loading}
            className={`px-4 py-2 text-white text-sm font-semibold rounded-lg shadow-md transition-colors ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? '読み込み中...' : 'デバイスから読込'}
          </button>
          <button
            onClick={handleAddNew}
            disabled={loading}
            className="px-4 py-2 bg-orange-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-orange-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            ＋ 新規追加
          </button>
        </div>
      </div>

      <p className="text-sm text-orange-700 mb-4">
        マクロを設定すると、1つのキーで複数の文字を入力できます（例：メールアドレス、住所など）
      </p>

      {/* Loading Progress */}
      {loading && loadProgress.total > 0 && (
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-blue-800">
              マクロを読み込み中... ({loadProgress.current} / {loadProgress.total})
            </span>
            <span className="text-sm text-blue-600 font-semibold">
              {Math.round((loadProgress.current / loadProgress.total) * 100)}%
            </span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(loadProgress.current / loadProgress.total) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Macro List */}
      <div className="space-y-3">
        {macros.map((macro) => (
          <div
            key={macro.id}
            className="border-2 border-orange-200 rounded-lg p-4"
          >
            {editingId === macro.id ? (
              // Edit mode
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
                    placeholder="例: メールアドレス"
                  />
                </div>
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
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
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
            ) : (
              // View mode
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-orange-900">{macro.name}</h4>
                    <p className="text-sm text-gray-600 font-mono bg-gray-50 p-2 rounded mt-1">
                      {macro.text || '（テキストなし）'}
                    </p>
                  </div>
                  <div className="flex gap-2">
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
                  placeholder="例: メールアドレス"
                />
              </div>
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
              <div className="flex gap-2">
                <button
                  onClick={handleSaveNew}
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
