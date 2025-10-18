import { KeyboardJson } from '../types';

/**
 * Parse and validate keyboard.json
 * @param jsonString - JSON string content
 * @returns Parsed KeyboardJson object
 */
export function parseKeyboardJson(jsonString: string): KeyboardJson {
  try {
    const data = JSON.parse(jsonString) as KeyboardJson;

    // Validate required fields
    if (!data.layouts) {
      throw new Error('Invalid keyboard.json: missing "layouts" field');
    }

    // Get the first layout (usually "LAYOUT")
    const layoutKeys = Object.keys(data.layouts);
    if (layoutKeys.length === 0) {
      throw new Error('Invalid keyboard.json: no layouts defined');
    }

    const firstLayout = data.layouts[layoutKeys[0]];
    if (!firstLayout.layout || !Array.isArray(firstLayout.layout)) {
      throw new Error('Invalid keyboard.json: layout definition is invalid');
    }

    return data;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Invalid JSON format: ' + error.message);
    }
    throw error;
  }
}

/**
 * Get the primary layout from keyboard.json
 */
export function getPrimaryLayout(keyboardJson: KeyboardJson) {
  const layoutKeys = Object.keys(keyboardJson.layouts);
  return keyboardJson.layouts[layoutKeys[0]];
}

/**
 * Get total number of keys in the layout
 */
export function getKeyCount(keyboardJson: KeyboardJson): number {
  const layout = getPrimaryLayout(keyboardJson);
  return layout.layout.length;
}
