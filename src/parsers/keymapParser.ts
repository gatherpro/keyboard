import { ParsedKeymap, Layer } from '../types';

/**
 * Parse keymap.c file and extract keymap information
 * @param content - Content of keymap.c file
 * @returns Parsed keymap object
 */
export function parseKeymapC(content: string): ParsedKeymap {
  // Step 1: Find keymaps array
  const keymapsMatch = content.match(
    /const\s+uint16_t\s+PROGMEM\s+keymaps\s*\[\]\[MATRIX_ROWS\]\[MATRIX_COLS\]\s*=\s*\{([\s\S]*?)\n\};/
  );

  if (!keymapsMatch) {
    throw new Error('Could not find keymaps array in keymap.c');
  }

  const keymapsContent = keymapsMatch[1];
  const keymapsStartIndex = keymapsMatch.index!;
  const keymapsEndIndex = keymapsStartIndex + keymapsMatch[0].length;

  // Step 3: Extract each layer's LAYOUT() content
  const layers = extractLayers(keymapsContent);

  return {
    layers,
    originalCode: content,
    keymapsStartIndex,
    keymapsEndIndex,
  };
}

/**
 * Extract layers from keymaps content
 */
function extractLayers(keymapsContent: string): Layer[] {
  const layers: Layer[] = [];

  // Regular expression to match each layer definition
  // Matches: [LAYER_NAME] = LAYOUT(...)
  const layerRegex = /\[(\w+)\]\s*=\s*LAYOUT\s*\(([\s\S]*?)\)(?=\s*,?\s*(?:\[|$))/g;

  let match;
  let layerIndex = 0;

  while ((match = layerRegex.exec(keymapsContent)) !== null) {
    const layerName = match[1];
    const layoutContent = match[2];

    // Parse keycodes from layout content
    const keys = parseLayoutContent(layoutContent);

    layers.push({
      name: layerName,
      keys,
    });

    layerIndex++;
  }

  return layers;
}

/**
 * Parse keycodes from LAYOUT() content
 */
function parseLayoutContent(content: string): string[] {
  // Remove comments
  let cleaned = content.replace(/\/\*[\s\S]*?\*\//g, ''); // Block comments
  cleaned = cleaned.replace(/\/\/.*$/gm, ''); // Line comments

  // Split by comma and clean up
  const keycodes = cleaned
    .split(',')
    .map(code => code.trim())
    .filter(code => code.length > 0);

  return keycodes;
}

/**
 * Generate keymap.c content from parsed data
 * @param parsed - Parsed keymap object
 * @param newLayers - Updated layers
 * @returns New keymap.c content
 */
export function generateKeymapC(parsed: ParsedKeymap, newLayers: Layer[]): string {
  const { originalCode, keymapsStartIndex, keymapsEndIndex } = parsed;

  // Generate new keymaps array content
  const newKeymapsArray = generateKeymapsArray(newLayers);

  // Replace the old keymaps array with the new one
  const before = originalCode.substring(0, keymapsStartIndex);
  const after = originalCode.substring(keymapsEndIndex);

  return before + newKeymapsArray + after;
}

/**
 * Generate keymaps array string from layers
 */
function generateKeymapsArray(layers: Layer[]): string {
  const layerStrings = layers.map(layer => {
    // Group keys for better formatting (e.g., 5 keys per row)
    const keysPerRow = 5;
    const keyRows: string[] = [];

    for (let i = 0; i < layer.keys.length; i += keysPerRow) {
      const rowKeys = layer.keys.slice(i, i + keysPerRow);
      keyRows.push('        ' + rowKeys.join(', '));
    }

    return `    [${layer.name}] = LAYOUT(\n${keyRows.join(',\n')}\n    )`;
  });

  return `const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {\n${layerStrings.join(',\n\n')}\n};`;
}
