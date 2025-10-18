// QMK Keyboard Types

export interface KeyPosition {
  matrix: [number, number]; // [row, col]
  x: number; // Physical X position
  y: number; // Physical Y position
  w?: number; // Key width (optional, default 1)
  h?: number; // Key height (optional, default 1)
}

export interface KeyboardLayout {
  name: string;
  layout: KeyPosition[];
}

export interface KeyboardJson {
  manufacturer: string;
  keyboard_name: string;
  maintainer: string;
  processor: string;
  bootloader: string;
  layouts: {
    [layoutName: string]: KeyboardLayout;
  };
}

// Keymap Types

export interface Layer {
  name: string;
  keys: string[]; // Array of keycodes
}

export interface ParsedKeymap {
  layers: Layer[];
  originalCode: string;
  keymapsStartIndex: number;
  keymapsEndIndex: number;
}

// Store State Types

export interface EditorState {
  // Files
  keyboardJson: KeyboardJson | null;
  keymapC: string | null;
  parsedKeymap: ParsedKeymap | null;

  // Editor state
  currentLayerIndex: number;
  selectedKeyIndex: number | null;
  viaConnected: boolean;

  // Actions
  loadKeyboardJson: (json: KeyboardJson) => void;
  loadKeymapC: (content: string) => void;
  setCurrentLayer: (index: number) => void;
  selectKey: (index: number | null) => void;
  updateKeycode: (layerIndex: number, keyIndex: number, keycode: string) => Promise<void>;
  generateKeymapC: () => string;

  // VIA Actions
  connectVIA: () => Promise<boolean>;
  disconnectVIA: () => Promise<void>;
  loadKeymapFromVIA: () => Promise<void>;
}

// QMK Keycode categories

export type KeycodeCategory =
  | 'basic'
  | 'modifier'
  | 'layer'
  | 'special'
  | 'mouse'
  | 'media';

export interface Keycode {
  code: string;
  display: string;
  category: KeycodeCategory;
  description?: string;
}
