import { create } from 'zustand';
import { EditorState, KeyboardJson, ParsedKeymap } from '../types';
import { parseKeymapC, generateKeymapC } from '../parsers/keymapParser';
import { parseKeyboardJson } from '../parsers/keyboardJsonParser';
import { VIADevice, isWebSerialSupported } from '../utils/viaProtocol';
import { parseKeycodeToNumber, convertNumberToKeycode } from '../utils/keycodeConverter';
import { ergogainKeyboard } from '../data/ergogain';

const viaDevice = new VIADevice();

export const useStore = create<EditorState>((set, get) => ({
  // State
  keyboardJson: null,
  keymapC: null,
  parsedKeymap: null,
  currentLayerIndex: 0,
  selectedKeyIndex: null,
  viaConnected: false,
  macros: [],

  // Actions
  loadKeyboardJson: (json: KeyboardJson) => {
    set({ keyboardJson: json });
  },

  loadKeymapC: (content: string) => {
    try {
      const parsed = parseKeymapC(content);
      set({
        keymapC: content,
        parsedKeymap: parsed,
        currentLayerIndex: 0,
        selectedKeyIndex: null,
      });
    } catch (error) {
      console.error('Error parsing keymap.c:', error);
      throw error;
    }
  },

  setCurrentLayer: (index: number) => {
    set({ currentLayerIndex: index, selectedKeyIndex: null });
  },

  selectKey: (index: number | null) => {
    set({ selectedKeyIndex: index });
  },

  updateKeycode: async (layerIndex: number, keyIndex: number, keycode: string) => {
    const { parsedKeymap, viaConnected, keyboardJson } = get();
    if (!parsedKeymap) return;

    const newLayers = [...parsedKeymap.layers];
    const layer = { ...newLayers[layerIndex] };
    const keys = [...layer.keys];
    keys[keyIndex] = keycode;
    layer.keys = keys;
    newLayers[layerIndex] = layer;

    set({
      parsedKeymap: {
        ...parsedKeymap,
        layers: newLayers,
      },
    });

    // If VIA is connected, update the keyboard in real-time
    if (viaConnected && keyboardJson) {
      try {
        const layout = Object.values(keyboardJson.layouts)[0].layout;
        const keyPosition = layout[keyIndex];
        const [row, col] = keyPosition.matrix;

        // Convert keycode string to number (simplified)
        const keycodeNum = parseKeycodeToNumber(keycode);
        await viaDevice.setKeycode(layerIndex, row, col, keycodeNum);
      } catch (error) {
        console.error('Failed to update keycode via VIA:', error);
      }
    }
  },

  generateKeymapC: () => {
    const { parsedKeymap } = get();
    if (!parsedKeymap) {
      throw new Error('No keymap loaded');
    }

    return generateKeymapC(parsedKeymap, parsedKeymap.layers);
  },

  // VIA Actions
  connectVIA: async () => {
    if (!isWebSerialSupported()) {
      alert('WebHID API is not supported in this browser. Please use Chrome, Edge, or Opera.');
      return false;
    }

    try {
      const connected = await viaDevice.connect();
      if (connected) {
        set({ viaConnected: true });

        // Get device name
        const deviceName = viaDevice.getDeviceName();
        console.log('VIA device connected:', deviceName);

        // Auto-load keyboard.json for supported keyboards
        if (deviceName.toLowerCase().includes('ergogain')) {
          set({ keyboardJson: ergogainKeyboard });
          console.log('Auto-loaded ergogain keyboard layout');

          // Auto-load keymap from device
          try {
            const layout = Object.values(ergogainKeyboard.layouts)[0].layout;
            const rows = Math.max(...layout.map(k => k.matrix[0])) + 1;
            const cols = Math.max(...layout.map(k => k.matrix[1])) + 1;

            const layerCount = await viaDevice.getLayerCount();
            const layers: ParsedKeymap['layers'] = [];

            for (let layer = 0; layer < layerCount; layer++) {
              const matrixKeymap = await viaDevice.getLayerKeymap(layer, rows, cols);
              const keys: string[] = [];

              // Convert matrix format to layout format
              for (const position of layout) {
                const [row, col] = position.matrix;
                const keycode = matrixKeymap[row][col];
                keys.push(convertNumberToKeycode(keycode));
              }

              layers.push({
                name: `Layer ${layer}`,
                keys,
              });
            }

            set({
              parsedKeymap: {
                layers,
                originalCode: '',
                keymapsStartIndex: 0,
                keymapsEndIndex: 0,
              },
            });

            console.log('Keymap auto-loaded from VIA device');
          } catch (error) {
            console.error('Failed to auto-load keymap:', error);
          }

          // Auto-load macros from device (optimized)
          try {
            const macroTexts = await viaDevice.getAllMacros();
            const macros = macroTexts.map((text, index) => ({
              id: index,
              name: `マクロ ${index + 1}`,
              text,
            }));

            set({ macros });
            console.log('Macros auto-loaded from VIA device:', macros);
          } catch (error) {
            console.error('Failed to auto-load macros:', error);
          }
        }

        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to connect VIA device:', error);
      return false;
    }
  },

  disconnectVIA: async () => {
    try {
      await viaDevice.disconnect();
      set({ viaConnected: false });
      console.log('VIA device disconnected');
    } catch (error) {
      console.error('Failed to disconnect VIA device:', error);
    }
  },

  loadKeymapFromVIA: async () => {
    const { keyboardJson } = get();
    if (!viaDevice.isConnected() || !keyboardJson) {
      throw new Error('VIA device not connected or keyboard.json not loaded');
    }

    try {
      const layout = Object.values(keyboardJson.layouts)[0].layout;
      const rows = Math.max(...layout.map(k => k.matrix[0])) + 1;
      const cols = Math.max(...layout.map(k => k.matrix[1])) + 1;

      const layerCount = await viaDevice.getLayerCount();
      const layers: ParsedKeymap['layers'] = [];

      for (let layer = 0; layer < layerCount; layer++) {
        const matrixKeymap = await viaDevice.getLayerKeymap(layer, rows, cols);
        const keys: string[] = [];

        // Convert matrix format to layout format
        for (const position of layout) {
          const [row, col] = position.matrix;
          const keycode = matrixKeymap[row][col];
          keys.push(convertNumberToKeycode(keycode));
        }

        layers.push({
          name: `Layer ${layer}`,
          keys,
        });
      }

      set({
        parsedKeymap: {
          layers,
          originalCode: '',
          keymapsStartIndex: 0,
          keymapsEndIndex: 0,
        },
      });

      console.log('Keymap loaded from VIA device');
    } catch (error) {
      console.error('Failed to load keymap from VIA:', error);
      throw error;
    }
  },

  // Macro Actions
  loadMacrosFromVIA: async (onProgress?: (current: number, total: number) => void) => {
    if (!viaDevice.isConnected()) {
      throw new Error('VIA device not connected');
    }

    try {
      const macroTexts = await viaDevice.getAllMacros(onProgress);
      const macros = macroTexts.map((text, index) => ({
        id: index,
        name: `マクロ ${index + 1}`,
        text,
      }));

      set({ macros });
      console.log('Macros loaded from VIA device:', macros);
    } catch (error) {
      console.error('Failed to load macros from VIA:', error);
      throw error;
    }
  },

  saveMacro: async (id: number, name: string, text: string) => {
    const { macros, viaConnected } = get();

    // Update local state
    const existingIndex = macros.findIndex(m => m.id === id);
    let newMacros;

    if (existingIndex >= 0) {
      // Update existing macro
      newMacros = [...macros];
      newMacros[existingIndex] = { id, name, text };
    } else {
      // Add new macro
      newMacros = [...macros, { id, name, text }];
    }

    set({ macros: newMacros });

    // If VIA is connected, save to device
    if (viaConnected) {
      try {
        await viaDevice.setMacro(id, text);
        console.log('Macro saved to device:', { id, name, text });
      } catch (error) {
        console.error('Failed to save macro to device:', error);
        alert(`マクロの保存に失敗しました: ${error}`);
        throw error;
      }
    }
  },

  deleteMacro: async (id: number) => {
    const { macros, viaConnected } = get();

    // Remove from local state
    const newMacros = macros.filter(m => m.id !== id);
    set({ macros: newMacros });

    // If VIA is connected, clear on device
    if (viaConnected) {
      try {
        await viaDevice.setMacro(id, '');
        console.log('Macro deleted from device:', id);
      } catch (error) {
        console.error('Failed to delete macro from device:', error);
        alert(`マクロの削除に失敗しました: ${error}`);
      }
    }
  },
}));

// Helper functions for file upload
export async function loadKeyboardJsonFile(file: File): Promise<KeyboardJson> {
  const content = await file.text();
  return parseKeyboardJson(content);
}

export async function loadKeymapCFile(file: File): Promise<string> {
  return await file.text();
}
