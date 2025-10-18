// Keycode conversion between QMK string format and VIA numeric format

// Basic keycodes mapping (QMK string -> VIA number)
const KEYCODE_MAP: Record<string, number> = {
  'KC_NO': 0x0000,
  'KC_TRNS': 0x0001,

  // Letters
  'KC_A': 0x0004, 'KC_B': 0x0005, 'KC_C': 0x0006, 'KC_D': 0x0007,
  'KC_E': 0x0008, 'KC_F': 0x0009, 'KC_G': 0x000A, 'KC_H': 0x000B,
  'KC_I': 0x000C, 'KC_J': 0x000D, 'KC_K': 0x000E, 'KC_L': 0x000F,
  'KC_M': 0x0010, 'KC_N': 0x0011, 'KC_O': 0x0012, 'KC_P': 0x0013,
  'KC_Q': 0x0014, 'KC_R': 0x0015, 'KC_S': 0x0016, 'KC_T': 0x0017,
  'KC_U': 0x0018, 'KC_V': 0x0019, 'KC_W': 0x001A, 'KC_X': 0x001B,
  'KC_Y': 0x001C, 'KC_Z': 0x001D,

  // Numbers
  'KC_1': 0x001E, 'KC_2': 0x001F, 'KC_3': 0x0020, 'KC_4': 0x0021,
  'KC_5': 0x0022, 'KC_6': 0x0023, 'KC_7': 0x0024, 'KC_8': 0x0025,
  'KC_9': 0x0026, 'KC_0': 0x0027,

  // Special keys
  'KC_ENT': 0x0028, 'KC_ESC': 0x0029, 'KC_BSPC': 0x002A, 'KC_TAB': 0x002B,
  'KC_SPC': 0x002C, 'KC_MINS': 0x002D, 'KC_EQL': 0x002E, 'KC_LBRC': 0x002F,
  'KC_RBRC': 0x0030, 'KC_BSLS': 0x0031, 'KC_SCLN': 0x0033, 'KC_QUOT': 0x0034,
  'KC_GRV': 0x0035, 'KC_COMM': 0x0036, 'KC_DOT': 0x0037, 'KC_SLSH': 0x0038,

  // Function keys
  'KC_F1': 0x003A, 'KC_F2': 0x003B, 'KC_F3': 0x003C, 'KC_F4': 0x003D,
  'KC_F5': 0x003E, 'KC_F6': 0x003F, 'KC_F7': 0x0040, 'KC_F8': 0x0041,
  'KC_F9': 0x0042, 'KC_F10': 0x0043, 'KC_F11': 0x0044, 'KC_F12': 0x0045,

  // Arrow keys
  'KC_RGHT': 0x004F, 'KC_LEFT': 0x0050, 'KC_DOWN': 0x0051, 'KC_UP': 0x0052,

  // Modifiers
  'KC_LCTL': 0x00E0, 'KC_LSFT': 0x00E1, 'KC_LALT': 0x00E2, 'KC_LGUI': 0x00E3,
  'KC_RCTL': 0x00E4, 'KC_RSFT': 0x00E5, 'KC_RALT': 0x00E6, 'KC_RGUI': 0x00E7,

  // Mouse keys
  'MS_BTN1': 0x7218, 'MS_BTN2': 0x7219, 'MS_BTN3': 0x721A,
  'MS_BTN4': 0x721B, 'MS_BTN5': 0x721C,
  'MS_UP': 0x7220, 'MS_DOWN': 0x7221, 'MS_LEFT': 0x7222, 'MS_RGHT': 0x7223,

  // Layer switching
  'MO(0)': 0x5100, 'MO(1)': 0x5101, 'MO(2)': 0x5102, 'MO(3)': 0x5103,
  'TG(0)': 0x5200, 'TG(1)': 0x5201, 'TG(2)': 0x5202, 'TG(3)': 0x5203,
  'TO(0)': 0x5000, 'TO(1)': 0x5001, 'TO(2)': 0x5002, 'TO(3)': 0x5003,
};

// Create reverse mapping (VIA number -> QMK string)
const REVERSE_KEYCODE_MAP: Record<number, string> = {};
for (const [key, value] of Object.entries(KEYCODE_MAP)) {
  REVERSE_KEYCODE_MAP[value] = key;
}

export function parseKeycodeToNumber(keycode: string): number {
  // Handle shifted keys like S(KC_LBRC)
  const shiftedMatch = keycode.match(/^S\((.+)\)$/);
  if (shiftedMatch) {
    const baseKeycode = shiftedMatch[1];
    const baseNum = KEYCODE_MAP[baseKeycode];
    if (baseNum !== undefined) {
      return baseNum | 0x0100; // Add shift modifier
    }
  }

  // Handle MO() layer keys
  const moMatch = keycode.match(/^MO\((\d+)\)$/);
  if (moMatch) {
    const layer = parseInt(moMatch[1]);
    return 0x5100 + layer;
  }

  // Handle TG() layer keys
  const tgMatch = keycode.match(/^TG\((\d+)\)$/);
  if (tgMatch) {
    const layer = parseInt(tgMatch[1]);
    return 0x5200 + layer;
  }

  // Handle TO() layer keys
  const toMatch = keycode.match(/^TO\((\d+)\)$/);
  if (toMatch) {
    const layer = parseInt(toMatch[1]);
    return 0x5000 + layer;
  }

  // Direct mapping
  const mapped = KEYCODE_MAP[keycode];
  if (mapped !== undefined) {
    return mapped;
  }

  // Default to KC_NO
  console.warn(`Unknown keycode: ${keycode}, defaulting to KC_NO`);
  return 0x0000;
}

export function convertNumberToKeycode(num: number): string {
  // Handle shifted keys
  if ((num & 0x0100) === 0x0100) {
    const baseNum = num & ~0x0100;
    const baseKeycode = REVERSE_KEYCODE_MAP[baseNum];
    if (baseKeycode) {
      return `S(${baseKeycode})`;
    }
  }

  // Handle MO() layer keys
  if ((num & 0xFF00) === 0x5100) {
    const layer = num & 0x00FF;
    return `MO(${layer})`;
  }

  // Handle TG() layer keys
  if ((num & 0xFF00) === 0x5200) {
    const layer = num & 0x00FF;
    return `TG(${layer})`;
  }

  // Handle TO() layer keys
  if ((num & 0xFF00) === 0x5000) {
    const layer = num & 0x00FF;
    return `TO(${layer})`;
  }

  // Direct mapping
  const mapped = REVERSE_KEYCODE_MAP[num];
  if (mapped !== undefined) {
    return mapped;
  }

  // Default to KC_NO
  console.warn(`Unknown keycode number: 0x${num.toString(16)}, defaulting to KC_NO`);
  return 'KC_NO';
}
