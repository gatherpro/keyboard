import { useState } from 'react';
import { useStore } from '../stores/useStore';
import { getPrimaryLayout } from '../parsers/keyboardJsonParser';
import { QMK_KEYCODES, findKeycode } from '../utils/keycodes';

export function KeyboardVisualizer() {
  const {
    keyboardJson,
    parsedKeymap,
    currentLayerIndex,
    selectedKeyIndex,
    setCurrentLayer,
    selectKey,
    updateKeycode,
  } = useStore();

  const [showKeycodeSelector, setShowKeycodeSelector] = useState(false);

  if (!keyboardJson || !parsedKeymap) {
    return (
      <div className="bg-gray-100 p-6 rounded-lg text-center text-gray-500">
        Please load keyboard.json and keymap.c files first
      </div>
    );
  }

  const layout = getPrimaryLayout(keyboardJson);
  const currentLayer = parsedKeymap.layers[currentLayerIndex];

  const handleKeyClick = (index: number) => {
    selectKey(index);
    setShowKeycodeSelector(true);
  };

  const handleKeycodeSelect = (keycode: string) => {
    if (selectedKeyIndex !== null) {
      updateKeycode(currentLayerIndex, selectedKeyIndex, keycode);
      setShowKeycodeSelector(false);
      selectKey(null);
    }
  };

  const getKeycodeDisplay = (keycode: string): string => {
    const found = findKeycode(keycode);
    return found ? found.display : keycode;
  };

  const SCALE = 50; // Scale factor for positioning

  return (
    <div className="space-y-4">
      {/* Layer Selector */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Layer
        </label>
        <select
          value={currentLayerIndex}
          onChange={(e) => setCurrentLayer(parseInt(e.target.value))}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          {parsedKeymap.layers.map((layer, index) => (
            <option key={index} value={index}>
              {layer.name}
            </option>
          ))}
        </select>
      </div>

      {/* Keyboard Layout */}
      <div className="bg-white p-6 rounded-lg shadow-md overflow-auto">
        <div className="relative" style={{ minWidth: '800px', minHeight: '400px' }}>
          {layout.layout.map((key, index) => (
            <button
              key={index}
              onClick={() => handleKeyClick(index)}
              className={`absolute border-2 rounded flex items-center justify-center text-sm font-mono transition-colors ${
                selectedKeyIndex === index
                  ? 'border-blue-500 bg-blue-100'
                  : 'border-gray-300 bg-white hover:bg-gray-50'
              }`}
              style={{
                left: `${key.x * SCALE}px`,
                top: `${key.y * SCALE}px`,
                width: `${(key.w || 1) * SCALE - 4}px`,
                height: `${(key.h || 1) * SCALE - 4}px`,
              }}
              title={`Matrix: ${key.matrix[0]},${key.matrix[1]}`}
            >
              <span className="text-xs truncate p-1">
                {getKeycodeDisplay(currentLayer?.keys[index] || 'KC_NO')}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Keycode Selector Modal */}
      {showKeycodeSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl max-h-96 overflow-auto">
            <h3 className="text-lg font-bold mb-4">Select Keycode</h3>
            <div className="grid grid-cols-6 gap-2">
              {QMK_KEYCODES.map((kc) => (
                <button
                  key={kc.code}
                  onClick={() => handleKeycodeSelect(kc.code)}
                  className="px-3 py-2 border border-gray-300 rounded hover:bg-blue-50 text-xs"
                  title={kc.description}
                >
                  {kc.display}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowKeycodeSelector(false)}
              className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
