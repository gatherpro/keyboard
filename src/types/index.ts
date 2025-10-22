// Editor Mode
export type EditorMode = 'device' | 'concept';

// Key Label Style (刻印の分割パターン)
export type KeyLabelStyle = '1' | '2' | '4';

// QMK Keyboard Types

export interface KeyPosition {
  matrix: [number, number]; // [row, col]
  x: number; // Physical X position
  y: number; // Physical Y position
  w?: number; // Key width (optional, default 1)
  h?: number; // Key height (optional, default 1)
}

// Concept Mode Key (構想モード用のキー定義)
export interface ConceptKey {
  id: string; // Unique identifier
  x: number; // Physical X position
  y: number; // Physical Y position
  w: number; // Key width
  h: number; // Key height
  color: string; // Background color (hex)
  labelStyle: KeyLabelStyle; // 1/2/4分割
  labels: string[]; // [main, layer1, layer2, layer3] のキーコード
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
  // Mode
  editorMode: EditorMode;

  // Files (Device Mode)
  keyboardJson: KeyboardJson | null;
  keymapC: string | null;
  parsedKeymap: ParsedKeymap | null;

  // Concept Mode
  conceptKeys: ConceptKey[];

  // Editor state
  currentLayerIndex: number;
  selectedKeyIndex: number | null;
  viaConnected: boolean;

  // Macro state
  macros: Macro[];

  // Mode Actions
  setEditorMode: (mode: EditorMode) => void;

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

  // Macro Actions
  loadMacrosFromVIA: () => Promise<void>;
  saveMacro: (id: number, name: string, text: string) => Promise<void>;
  deleteMacro: (id: number) => Promise<void>;

  // Concept Mode Actions
  addConceptKey: (key: ConceptKey) => void;
  updateConceptKey: (id: string, updates: Partial<ConceptKey>) => void;
  deleteConceptKey: (id: string) => void;
  setConceptKeyLabel: (id: string, layerIndex: number, keycode: string) => void;
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

// Macro Types

export interface Macro {
  id: number;
  name: string;
  text: string;
}
