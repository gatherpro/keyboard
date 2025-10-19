import { Keycode } from '../types';

// QMK Keycodes definition
export const QMK_KEYCODES: Keycode[] = [
  // Basic Keys
  { code: 'KC_A', display: 'A', category: 'basic' },
  { code: 'KC_B', display: 'B', category: 'basic' },
  { code: 'KC_C', display: 'C', category: 'basic' },
  { code: 'KC_D', display: 'D', category: 'basic' },
  { code: 'KC_E', display: 'E', category: 'basic' },
  { code: 'KC_F', display: 'F', category: 'basic' },
  { code: 'KC_G', display: 'G', category: 'basic' },
  { code: 'KC_H', display: 'H', category: 'basic' },
  { code: 'KC_I', display: 'I', category: 'basic' },
  { code: 'KC_J', display: 'J', category: 'basic' },
  { code: 'KC_K', display: 'K', category: 'basic' },
  { code: 'KC_L', display: 'L', category: 'basic' },
  { code: 'KC_M', display: 'M', category: 'basic' },
  { code: 'KC_N', display: 'N', category: 'basic' },
  { code: 'KC_O', display: 'O', category: 'basic' },
  { code: 'KC_P', display: 'P', category: 'basic' },
  { code: 'KC_Q', display: 'Q', category: 'basic' },
  { code: 'KC_R', display: 'R', category: 'basic' },
  { code: 'KC_S', display: 'S', category: 'basic' },
  { code: 'KC_T', display: 'T', category: 'basic' },
  { code: 'KC_U', display: 'U', category: 'basic' },
  { code: 'KC_V', display: 'V', category: 'basic' },
  { code: 'KC_W', display: 'W', category: 'basic' },
  { code: 'KC_X', display: 'X', category: 'basic' },
  { code: 'KC_Y', display: 'Y', category: 'basic' },
  { code: 'KC_Z', display: 'Z', category: 'basic' },

  { code: 'KC_1', display: '1', category: 'basic' },
  { code: 'KC_2', display: '2', category: 'basic' },
  { code: 'KC_3', display: '3', category: 'basic' },
  { code: 'KC_4', display: '4', category: 'basic' },
  { code: 'KC_5', display: '5', category: 'basic' },
  { code: 'KC_6', display: '6', category: 'basic' },
  { code: 'KC_7', display: '7', category: 'basic' },
  { code: 'KC_8', display: '8', category: 'basic' },
  { code: 'KC_9', display: '9', category: 'basic' },
  { code: 'KC_0', display: '0', category: 'basic' },

  { code: 'KC_ENT', display: 'Enter', category: 'basic' },
  { code: 'KC_ESC', display: 'Esc', category: 'basic' },
  { code: 'KC_BSPC', display: 'Backspace', category: 'basic' },
  { code: 'KC_TAB', display: 'Tab', category: 'basic' },
  { code: 'KC_SPC', display: 'Space', category: 'basic' },
  { code: 'KC_MINS', display: '-', category: 'basic' },
  { code: 'KC_EQL', display: '=', category: 'basic' },
  { code: 'KC_LBRC', display: '[', category: 'basic' },
  { code: 'KC_RBRC', display: ']', category: 'basic' },
  { code: 'KC_BSLS', display: '\\', category: 'basic' },
  { code: 'KC_SCLN', display: ';', category: 'basic' },
  { code: 'KC_QUOT', display: "'", category: 'basic' },
  { code: 'KC_GRV', display: '`', category: 'basic' },
  { code: 'KC_COMM', display: ',', category: 'basic' },
  { code: 'KC_DOT', display: '.', category: 'basic' },
  { code: 'KC_SLSH', display: '/', category: 'basic' },

  // Modifiers
  { code: 'KC_LCTL', display: 'LCtrl', category: 'modifier' },
  { code: 'KC_LSFT', display: 'LShift', category: 'modifier' },
  { code: 'KC_LALT', display: 'LAlt', category: 'modifier' },
  { code: 'KC_LGUI', display: 'LWin', category: 'modifier' },
  { code: 'KC_RCTL', display: 'RCtrl', category: 'modifier' },
  { code: 'KC_RSFT', display: 'RShift', category: 'modifier' },
  { code: 'KC_RALT', display: 'RAlt', category: 'modifier' },
  { code: 'KC_RGUI', display: 'RWin', category: 'modifier' },

  // Special
  { code: 'KC_TRNS', display: 'Trans', category: 'special', description: 'Transparent (pass through to next layer)' },
  { code: 'KC_NO', display: 'No', category: 'special', description: 'No action' },

  // Mouse Keys
  { code: 'MS_BTN1', display: 'M Left', category: 'mouse' },
  { code: 'MS_BTN2', display: 'M Right', category: 'mouse' },
  { code: 'MS_BTN3', display: 'M Middle', category: 'mouse' },
  { code: 'MS_UP', display: 'M Up', category: 'mouse' },
  { code: 'MS_DOWN', display: 'M Down', category: 'mouse' },
  { code: 'MS_LEFT', display: 'M Left', category: 'mouse' },
  { code: 'MS_RGHT', display: 'M Right', category: 'mouse' },

  // Media Keys
  { code: 'KC_MUTE', display: 'Mute', category: 'media' },
  { code: 'KC_VOLU', display: 'Vol+', category: 'media' },
  { code: 'KC_VOLD', display: 'Vol-', category: 'media' },
  { code: 'KC_MPLY', display: 'Play', category: 'media' },
  { code: 'KC_MSTP', display: 'Stop', category: 'media' },
  { code: 'KC_MPRV', display: 'Prev', category: 'media' },
  { code: 'KC_MNXT', display: 'Next', category: 'media' },

  // Macro Keys
  { code: 'QK_MACRO_0', display: 'M0', category: 'special', description: 'マクロ 0' },
  { code: 'QK_MACRO_1', display: 'M1', category: 'special', description: 'マクロ 1' },
  { code: 'QK_MACRO_2', display: 'M2', category: 'special', description: 'マクロ 2' },
  { code: 'QK_MACRO_3', display: 'M3', category: 'special', description: 'マクロ 3' },
  { code: 'QK_MACRO_4', display: 'M4', category: 'special', description: 'マクロ 4' },
  { code: 'QK_MACRO_5', display: 'M5', category: 'special', description: 'マクロ 5' },
  { code: 'QK_MACRO_6', display: 'M6', category: 'special', description: 'マクロ 6' },
  { code: 'QK_MACRO_7', display: 'M7', category: 'special', description: 'マクロ 7' },
  { code: 'QK_MACRO_8', display: 'M8', category: 'special', description: 'マクロ 8' },
  { code: 'QK_MACRO_9', display: 'M9', category: 'special', description: 'マクロ 9' },
  { code: 'QK_MACRO_10', display: 'M10', category: 'special', description: 'マクロ 10' },
  { code: 'QK_MACRO_11', display: 'M11', category: 'special', description: 'マクロ 11' },
  { code: 'QK_MACRO_12', display: 'M12', category: 'special', description: 'マクロ 12' },
  { code: 'QK_MACRO_13', display: 'M13', category: 'special', description: 'マクロ 13' },
  { code: 'QK_MACRO_14', display: 'M14', category: 'special', description: 'マクロ 14' },
  { code: 'QK_MACRO_15', display: 'M15', category: 'special', description: 'マクロ 15' },
];

// Layer switching functions (will be parsed specially)
export const LAYER_FUNCTIONS = [
  { code: 'MO', display: 'MO()', category: 'layer', description: 'Momentary layer switch' },
  { code: 'TG', display: 'TG()', category: 'layer', description: 'Toggle layer' },
  { code: 'TO', display: 'TO()', category: 'layer', description: 'Switch to layer' },
  { code: 'LT', display: 'LT()', category: 'layer', description: 'Layer tap' },
] as const;

export function getKeycodesByCategory(category: string): Keycode[] {
  return QMK_KEYCODES.filter(kc => kc.category === category);
}

export function findKeycode(code: string): Keycode | undefined {
  return QMK_KEYCODES.find(kc => kc.code === code);
}
