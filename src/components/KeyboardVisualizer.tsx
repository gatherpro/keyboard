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
    macros,
  } = useStore();

  const [showKeycodeSelector, setShowKeycodeSelector] = useState(false);

  if (!keyboardJson || !parsedKeymap) {
    return null;
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
    // Check if it's a macro keycode
    if (keycode.startsWith('QK_MACRO_')) {
      const macroIndex = parseInt(keycode.replace('QK_MACRO_', ''));
      const macro = macros.find(m => m.id === macroIndex);
      if (macro) {
        return macro.name;
      }
    }

    const found = findKeycode(keycode);
    return found ? found.display : keycode;
  };

  const SCALE = 50; // Scale factor for positioning

  return (
    <div className="space-y-4">
      {/* Layer Selector */}
      <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-orange-200">
        <label className="block text-sm font-medium text-orange-800 mb-2">
          Layer
        </label>
        <select
          value={currentLayerIndex}
          onChange={(e) => setCurrentLayer(parseInt(e.target.value))}
          className="block w-full px-3 py-2 border border-orange-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
        >
          {parsedKeymap.layers.map((layer, index) => (
            <option key={index} value={index}>
              {layer.name}
            </option>
          ))}
        </select>
      </div>

      {/* Keyboard Layout */}
      <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-orange-200 overflow-auto">
        <div className="relative" style={{ minWidth: '800px', minHeight: '400px' }}>
          {layout.layout.map((key, index) => (
            <button
              key={index}
              onClick={() => handleKeyClick(index)}
              className={`absolute border-2 rounded flex items-center justify-center text-sm font-mono transition-colors ${
                selectedKeyIndex === index
                  ? 'border-orange-500 bg-orange-100'
                  : 'border-orange-300 bg-white hover:bg-orange-50'
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
          <div className="bg-white p-6 rounded-lg shadow-xl border-2 border-orange-300 max-w-2xl max-h-96 overflow-auto">
            <h3 className="text-lg font-bold text-orange-900 mb-4">キーコード選択</h3>
            <div className="grid grid-cols-6 gap-2">
              {QMK_KEYCODES.map((kc) => {
                let displayText = kc.display;
                let description = kc.description;

                // If it's a macro keycode, show the user-defined name
                if (kc.code.startsWith('QK_MACRO_')) {
                  const macroIndex = parseInt(kc.code.replace('QK_MACRO_', ''));
                  const macro = macros.find(m => m.id === macroIndex);
                  if (macro) {
                    displayText = macro.name;
                    description = macro.text;
                  }
                }

                return (
                  <button
                    key={kc.code}
                    onClick={() => handleKeycodeSelect(kc.code)}
                    className="px-3 py-2 border border-orange-300 rounded hover:bg-orange-100 text-xs"
                    title={description}
                  >
                    {displayText}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setShowKeycodeSelector(false)}
              className="mt-4 px-4 py-2 bg-orange-200 rounded hover:bg-orange-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
