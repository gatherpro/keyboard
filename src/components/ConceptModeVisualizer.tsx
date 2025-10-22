import { useState } from 'react';
import { useStore } from '../stores/useStore';
import { ConceptKey } from '../types';
import { KeyLabel } from './KeyLabel';
import { keyboardTemplates } from '../data/keyboardTemplates';

const SCALE = 50; // Scale factor for positioning

export function ConceptModeVisualizer() {
  const {
    conceptKeys,
    addConceptKey,
    updateConceptKey,
    deleteConceptKey,
    setConceptKeyLabel,
  } = useStore();

  const [selectedKeyId, setSelectedKeyId] = useState<string | null>(null);
  const [draggedKeyId, setDraggedKeyId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  const selectedKey = conceptKeys.find(k => k.id === selectedKeyId);

  // Add new key
  const handleAddKey = () => {
    const newKey: ConceptKey = {
      id: `key-${Date.now()}`,
      x: 0,
      y: 0,
      w: 1,
      h: 1,
      color: '#f0f0f0',
      labelStyle: '1',
      labels: ['KC_NO', 'KC_NO', 'KC_NO', 'KC_NO'], // [main, layer1, layer2, layer3]
    };
    addConceptKey(newKey);
    setSelectedKeyId(newKey.id);
  };

  // Load template
  const handleLoadTemplate = (templateId: string) => {
    const template = keyboardTemplates.find(t => t.id === templateId);
    if (!template) return;

    // Clear existing keys
    conceptKeys.forEach(k => deleteConceptKey(k.id));

    // Add template keys
    template.keys.forEach((keyData, index) => {
      const newKey: ConceptKey = {
        ...keyData,
        id: `key-${Date.now()}-${index}`,
      };
      addConceptKey(newKey);
    });

    setShowTemplateModal(false);
    setSelectedKeyId(null);
  };

  // Mouse down on key - start dragging
  const handleKeyMouseDown = (e: React.MouseEvent, keyId: string) => {
    e.preventDefault();
    const key = conceptKeys.find(k => k.id === keyId);
    if (!key) return;

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setDraggedKeyId(keyId);
    setSelectedKeyId(keyId);
  };

  // Mouse move - update key position while dragging
  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!draggedKeyId) return;

    const canvas = e.currentTarget as HTMLElement;
    const rect = canvas.getBoundingClientRect();
    const x = Math.round((e.clientX - rect.left - dragOffset.x) / SCALE * 2) / 2;
    const y = Math.round((e.clientY - rect.top - dragOffset.y) / SCALE * 2) / 2;

    updateConceptKey(draggedKeyId, {
      x: Math.max(0, x),
      y: Math.max(0, y),
    });
  };

  // Mouse up - stop dragging
  const handleMouseUp = () => {
    setDraggedKeyId(null);
  };

  // Delete selected key
  const handleDeleteKey = () => {
    if (selectedKeyId) {
      deleteConceptKey(selectedKeyId);
      setSelectedKeyId(null);
    }
  };

  // Update key properties
  const handleUpdateKeyProp = (prop: keyof ConceptKey, value: any) => {
    if (selectedKeyId) {
      updateConceptKey(selectedKeyId, { [prop]: value });
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-purple-200">
        <div className="flex items-center gap-4 flex-wrap">
          <button
            onClick={() => setShowTemplateModal(true)}
            className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            📋 テンプレートから作成
          </button>
          <button
            onClick={handleAddKey}
            className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
          >
            + キーを追加
          </button>
          {selectedKey && (
            <>
              <button
                onClick={handleDeleteKey}
                className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
              >
                選択したキーを削除
              </button>
              <span className="text-purple-800 font-medium">
                選択中: {selectedKey.id}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Main Layout: Canvas + Editor Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Canvas */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-lg border-2 border-purple-200">
          <div
            className="relative border-2 border-dashed border-purple-300 rounded-lg"
            style={{ minWidth: '800px', minHeight: '400px' }}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {conceptKeys.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-purple-400">
                <p>「+ キーを追加」ボタンでキーを配置しましょう</p>
              </div>
            )}

            {conceptKeys.map((key) => (
              <div
                key={key.id}
                onMouseDown={(e) => handleKeyMouseDown(e, key.id)}
                className={`absolute border-2 rounded cursor-move transition-all ${
                  selectedKeyId === key.id
                    ? 'border-purple-500 shadow-lg z-10'
                    : 'border-purple-300 hover:border-purple-400'
                }`}
                style={{
                  left: `${key.x * SCALE}px`,
                  top: `${key.y * SCALE}px`,
                  width: `${key.w * SCALE - 4}px`,
                  height: `${key.h * SCALE - 4}px`,
                  backgroundColor: key.color,
                }}
              >
                <KeyLabel labels={key.labels} labelStyle={key.labelStyle} />
              </div>
            ))}
          </div>
        </div>

        {/* Editor Panel */}
        <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-purple-200">
          <h3 className="text-lg font-bold text-purple-900 mb-4">キー設定</h3>

          {selectedKey ? (
            <div className="space-y-4">
              {/* Position */}
              <div>
                <label className="block text-sm font-medium text-purple-800 mb-1">
                  位置 (X, Y)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    step="0.25"
                    value={selectedKey.x}
                    onChange={(e) => handleUpdateKeyProp('x', parseFloat(e.target.value))}
                    className="px-3 py-2 border border-purple-300 rounded-md"
                  />
                  <input
                    type="number"
                    step="0.25"
                    value={selectedKey.y}
                    onChange={(e) => handleUpdateKeyProp('y', parseFloat(e.target.value))}
                    className="px-3 py-2 border border-purple-300 rounded-md"
                  />
                </div>
              </div>

              {/* Size */}
              <div>
                <label className="block text-sm font-medium text-purple-800 mb-1">
                  サイズ (Width, Height)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    step="0.25"
                    min="0.25"
                    value={selectedKey.w}
                    onChange={(e) => handleUpdateKeyProp('w', parseFloat(e.target.value))}
                    className="px-3 py-2 border border-purple-300 rounded-md"
                  />
                  <input
                    type="number"
                    step="0.25"
                    min="0.25"
                    value={selectedKey.h}
                    onChange={(e) => handleUpdateKeyProp('h', parseFloat(e.target.value))}
                    className="px-3 py-2 border border-purple-300 rounded-md"
                  />
                </div>
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-purple-800 mb-1">
                  キーの色
                </label>
                <input
                  type="color"
                  value={selectedKey.color}
                  onChange={(e) => handleUpdateKeyProp('color', e.target.value)}
                  className="w-full h-10 border border-purple-300 rounded-md cursor-pointer"
                />
              </div>

              {/* Label Style */}
              <div>
                <label className="block text-sm font-medium text-purple-800 mb-1">
                  刻印スタイル
                </label>
                <select
                  value={selectedKey.labelStyle}
                  onChange={(e) => handleUpdateKeyProp('labelStyle', e.target.value)}
                  className="w-full px-3 py-2 border border-purple-300 rounded-md"
                >
                  <option value="1">1分割（メインのみ）</option>
                  <option value="2">2分割（メイン + レイヤー1）</option>
                  <option value="4">4分割（全レイヤー）</option>
                </select>
              </div>

              {/* Labels for each layer */}
              <div>
                <label className="block text-sm font-medium text-purple-800 mb-2">
                  レイヤーごとのキーコード
                </label>
                <div className="space-y-2">
                  {['メイン', 'レイヤー1', 'レイヤー2', 'レイヤー3'].map((layerName, idx) => (
                    <div key={idx}>
                      <label className="block text-xs text-purple-700 mb-1">
                        {layerName}
                      </label>
                      <input
                        type="text"
                        value={selectedKey.labels[idx] || ''}
                        onChange={(e) => setConceptKeyLabel(selectedKey.id, idx, e.target.value)}
                        className="w-full px-3 py-1 text-sm border border-purple-300 rounded-md"
                        placeholder="KC_NO"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-purple-600 text-sm">
              キーを選択して設定を編集してください
            </p>
          )}
        </div>
      </div>

      {/* Template Selection Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl border-2 border-purple-300 max-w-4xl max-h-[80vh] overflow-auto">
            <h3 className="text-2xl font-bold text-purple-900 mb-4">キーボードテンプレート選択</h3>

            {/* Integrated Keyboards */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-purple-800 mb-3">一体型</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {keyboardTemplates
                  .filter(t => t.category === 'integrated')
                  .map(template => (
                    <button
                      key={template.id}
                      onClick={() => handleLoadTemplate(template.id)}
                      className="p-4 border-2 border-purple-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-left"
                    >
                      <div className="font-bold text-purple-900">{template.name}</div>
                      <div className="text-sm text-purple-700 mt-1">{template.description}</div>
                    </button>
                  ))}
              </div>
            </div>

            {/* Split Keyboards */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-purple-800 mb-3">分割型</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {keyboardTemplates
                  .filter(t => t.category === 'split')
                  .map(template => (
                    <button
                      key={template.id}
                      onClick={() => handleLoadTemplate(template.id)}
                      className="p-4 border-2 border-purple-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-left"
                    >
                      <div className="font-bold text-purple-900">{template.name}</div>
                      <div className="text-sm text-purple-700 mt-1">{template.description}</div>
                    </button>
                  ))}
              </div>
            </div>

            <button
              onClick={() => setShowTemplateModal(false)}
              className="mt-4 px-4 py-2 bg-purple-200 rounded hover:bg-purple-300 transition-colors"
            >
              キャンセル
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
