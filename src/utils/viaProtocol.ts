// VIA Protocol implementation for WebHID API

export class VIADevice {
  private device: HIDDevice | null = null;

  async connect(): Promise<boolean> {
    try {
      // Request HID device
      const devices = await navigator.hid.requestDevice({
        filters: [
          { usagePage: 0xFF60, usage: 0x61 }, // VIA usage page
          { usagePage: 0xFF60, usage: 0x0061 }
        ]
      });

      if (devices.length === 0) {
        console.error('No device selected');
        return false;
      }

      this.device = devices[0];

      // Open the device
      if (!this.device.opened) {
        await this.device.open();
      }

      console.log('Connected to:', this.device.productName);
      return true;
    } catch (error) {
      console.error('Failed to connect:', error);
      return false;
    }
  }

  async disconnect(): Promise<void> {
    if (this.device && this.device.opened) {
      await this.device.close();
    }
    this.device = null;
  }

  isConnected(): boolean {
    return this.device !== null && this.device.opened;
  }

  getDeviceName(): string {
    return this.device?.productName || 'Unknown Device';
  }

  // VIA Protocol: Get Protocol Version
  async getProtocolVersion(): Promise<number> {
    const command = new Uint8Array(32);
    command[0] = 0x01; // VIA_PROTOCOL_VERSION
    const response = await this.sendCommand(command);
    return (response[1] << 8) | response[2];
  }

  // VIA Protocol: Get Keycode
  async getKeycode(layer: number, row: number, col: number): Promise<number> {
    const command = new Uint8Array(32);
    command[0] = 0x04; // VIA_GET_KEYCODE
    command[1] = layer;
    command[2] = row;
    command[3] = col;
    const response = await this.sendCommand(command);
    return (response[4] << 8) | response[5];
  }

  // VIA Protocol: Set Keycode
  async setKeycode(layer: number, row: number, col: number, keycode: number): Promise<void> {
    const command = new Uint8Array(32);
    command[0] = 0x05; // VIA_SET_KEYCODE
    command[1] = layer;
    command[2] = row;
    command[3] = col;
    command[4] = (keycode >> 8) & 0xFF;
    command[5] = keycode & 0xFF;
    await this.sendCommand(command);
  }

  // VIA Protocol: Dynamic Keymap Get Layer Count
  async getLayerCount(): Promise<number> {
    const command = new Uint8Array(32);
    command[0] = 0x11; // VIA_DYNAMIC_KEYMAP_GET_LAYER_COUNT
    const response = await this.sendCommand(command);
    return response[1];
  }

  // Send command and wait for response
  private async sendCommand(command: Uint8Array): Promise<Uint8Array> {
    if (!this.device || !this.device.opened) {
      throw new Error('Device not connected');
    }

    // Send command via HID
    await this.device.sendReport(0, command);

    // Wait for response
    return new Promise((resolve, reject) => {
      if (!this.device) {
        reject(new Error('Device disconnected'));
        return;
      }

      const timeout = setTimeout(() => {
        if (this.device) {
          this.device.removeEventListener('inputreport', handler);
        }
        reject(new Error('Response timeout'));
      }, 1000);

      const handler = (event: HIDInputReportEvent) => {
        clearTimeout(timeout);
        if (this.device) {
          this.device.removeEventListener('inputreport', handler);
        }
        resolve(new Uint8Array(event.data.buffer));
      };

      this.device.addEventListener('inputreport', handler);
    });
  }

  // Get entire keymap for a layer
  async getLayerKeymap(layer: number, rows: number, cols: number): Promise<number[][]> {
    const keymap: number[][] = [];
    for (let row = 0; row < rows; row++) {
      const rowKeys: number[] = [];
      for (let col = 0; col < cols; col++) {
        const keycode = await this.getKeycode(layer, row, col);
        rowKeys.push(keycode);
      }
      keymap.push(rowKeys);
    }
    return keymap;
  }

  // Set entire keymap for a layer
  async setLayerKeymap(layer: number, keymap: number[][]): Promise<void> {
    for (let row = 0; row < keymap.length; row++) {
      for (let col = 0; col < keymap[row].length; col++) {
        await this.setKeycode(layer, row, col, keymap[row][col]);
      }
    }
  }

  // VIA Protocol: Get Macro Buffer Size
  async getMacroBufferSize(): Promise<number> {
    const command = new Uint8Array(32);
    command[0] = 0x0D; // VIA_DYNAMIC_KEYMAP_MACRO_GET_BUFFER_SIZE
    const response = await this.sendCommand(command);
    return (response[1] << 8) | response[2];
  }

  // VIA Protocol: Get Macro Count
  async getMacroCount(): Promise<number> {
    const command = new Uint8Array(32);
    command[0] = 0x0C; // VIA_DYNAMIC_KEYMAP_MACRO_GET_COUNT
    const response = await this.sendCommand(command);
    return response[1];
  }

  // VIA Protocol: Get Macro Buffer (read portion of macro buffer)
  async getMacroBuffer(offset: number, size: number): Promise<Uint8Array> {
    const command = new Uint8Array(32);
    command[0] = 0x0E; // VIA_DYNAMIC_KEYMAP_MACRO_GET_BUFFER
    command[1] = (offset >> 8) & 0xFF;
    command[2] = offset & 0xFF;
    command[3] = size;
    const response = await this.sendCommand(command);
    return response.slice(4, 4 + size);
  }

  // VIA Protocol: Set Macro Buffer (write portion of macro buffer)
  async setMacroBuffer(offset: number, data: Uint8Array): Promise<void> {
    const command = new Uint8Array(32);
    command[0] = 0x0F; // VIA_DYNAMIC_KEYMAP_MACRO_SET_BUFFER
    command[1] = (offset >> 8) & 0xFF;
    command[2] = offset & 0xFF;
    command[3] = data.length;
    for (let i = 0; i < data.length && i < 28; i++) {
      command[4 + i] = data[i];
    }
    await this.sendCommand(command);
  }

  // VIA Protocol: Reset Macro Buffer
  async resetMacroBuffer(): Promise<void> {
    const command = new Uint8Array(32);
    command[0] = 0x10; // VIA_DYNAMIC_KEYMAP_MACRO_RESET
    await this.sendCommand(command);
  }

  // Helper: Convert QMK keycode to character
  private keycodeToChar(keycode: number): string {
    // Letters (KC_A = 0x04)
    if (keycode >= 0x04 && keycode <= 0x1D) {
      return String.fromCharCode(97 + (keycode - 0x04)); // a-z
    }
    // Numbers 1-9 (KC_1 = 0x1E)
    if (keycode >= 0x1E && keycode <= 0x26) {
      return String.fromCharCode(49 + (keycode - 0x1E)); // 1-9
    }
    // Number 0 (KC_0 = 0x27)
    if (keycode === 0x27) {
      return '0';
    }
    // Special characters
    const specialKeys: { [key: number]: string } = {
      0x2C: ' ',  // KC_SPC
      0x37: '.',  // KC_DOT
      0x36: ',',  // KC_COMM
      0x2D: '-',  // KC_MINS
    };
    return specialKeys[keycode] || '';
  }

  // Get all macros from device (optimized)
  async getAllMacros(onProgress?: (current: number, total: number) => void): Promise<string[]> {
    const bufferSize = await this.getMacroBufferSize();
    const macros: string[] = [];
    const macroCount = 16; // DYNAMIC_KEYMAP_MACRO_COUNT
    const macroSize = Math.floor(bufferSize / macroCount); // Size per macro slot

    console.log('Macro buffer size:', bufferSize, 'per macro:', macroSize);

    // Read each macro slot individually and skip empty ones
    for (let macroId = 0; macroId < macroCount; macroId++) {
      if (onProgress) {
        onProgress(macroId + 1, macroCount);
      }

      const offset = macroId * macroSize;

      // Read first byte to check if macro is empty
      const firstByte = await this.getMacroBuffer(offset, 1);
      if (firstByte[0] === 0x00) {
        // Empty macro, skip
        macros.push('');
        continue;
      }

      // Read full macro data
      const buffer: number[] = [];
      for (let i = 0; i < macroSize; i += 28) {
        const chunkSize = Math.min(28, macroSize - i);
        const chunk = await this.getMacroBuffer(offset + i, chunkSize);
        buffer.push(...Array.from(chunk));
      }

      // Parse this macro
      let currentMacro = '';
      let i = 0;
      let isShifted = false;

      while (i < buffer.length) {
        const byte = buffer[i];

        if (byte === 0x00) {
          // End of macro
          break;
        }

        if (byte === 1) {
          // SS_TAP_CODE
          i++;
          if (i < buffer.length) {
            const keycode = buffer[i];
            let char = this.keycodeToChar(keycode);
            if (isShifted && char) {
              char = char.toUpperCase();
            }
            currentMacro += char;
          }
        } else if (byte === 2) {
          // SS_DOWN_CODE
          i++;
          if (i < buffer.length && buffer[i] === 0xE1) {
            // Shift down
            isShifted = true;
          }
        } else if (byte === 3) {
          // SS_UP_CODE
          i++;
          if (i < buffer.length && buffer[i] === 0xE1) {
            // Shift up
            isShifted = false;
          }
        }

        i++;
      }

      macros.push(currentMacro);
    }

    return macros;
  }

  // Helper: Convert character to QMK keycode with modifiers
  private charToKeycode(char: string): { keycode: number; needsShift: boolean } {
    const c = char.charCodeAt(0);

    // Lowercase letters
    if (c >= 97 && c <= 122) { // a-z
      return { keycode: 0x04 + (c - 97), needsShift: false }; // KC_A = 0x04
    }
    // Uppercase letters
    if (c >= 65 && c <= 90) { // A-Z
      return { keycode: 0x04 + (c - 65), needsShift: true };
    }
    // Numbers
    if (c >= 49 && c <= 57) { // 1-9
      return { keycode: 0x1E + (c - 49), needsShift: false }; // KC_1 = 0x1E
    }
    if (c === 48) { // 0
      return { keycode: 0x27, needsShift: false }; // KC_0 = 0x27
    }

    // Special characters (simplified)
    const specialChars: { [key: string]: { keycode: number; needsShift: boolean } } = {
      ' ': { keycode: 0x2C, needsShift: false }, // KC_SPC
      '.': { keycode: 0x37, needsShift: false }, // KC_DOT
      ',': { keycode: 0x36, needsShift: false }, // KC_COMM
      '@': { keycode: 0x1F, needsShift: true },  // KC_2 with shift
      '-': { keycode: 0x2D, needsShift: false }, // KC_MINS
      '_': { keycode: 0x2D, needsShift: true },  // KC_MINS with shift
    };

    if (char in specialChars) {
      return specialChars[char];
    }

    // Default: space
    return { keycode: 0x2C, needsShift: false };
  }

  // Set a macro (VIA format)
  async setMacro(macroId: number, text: string): Promise<void> {
    console.log(`Setting macro ${macroId} with text: "${text}"`);
    const bytes: number[] = [];

    // VIA macro format:
    // 1 = SS_TAP_CODE (tap a key)
    // 2 = SS_DOWN_CODE (press down)
    // 3 = SS_UP_CODE (release)
    // 4 = SS_DELAY_CODE (delay)

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const { keycode, needsShift } = this.charToKeycode(char);
      console.log(`Char '${char}' (${char.charCodeAt(0)}) -> keycode 0x${keycode.toString(16)}, shift: ${needsShift}`);

      if (needsShift) {
        bytes.push(0x01); // Escape
        bytes.push(0x02); // SS_DOWN_CODE
        bytes.push(0xE1); // KC_LSFT
      }

      bytes.push(0x01); // Escape
      bytes.push(0x01); // SS_TAP_CODE
      bytes.push(keycode);

      if (needsShift) {
        bytes.push(0x01); // Escape
        bytes.push(0x03); // SS_UP_CODE
        bytes.push(0xE1); // KC_LSFT
      }
    }

    bytes.push(0x00); // End of macro marker

    // Write to buffer at appropriate offset
    const offset = macroId * 128; // Assume each macro gets 128 bytes max
    const data = new Uint8Array(bytes);

    // Write in chunks if necessary
    for (let i = 0; i < data.length; i += 28) {
      const chunkSize = Math.min(28, data.length - i);
      const chunk = data.slice(i, i + chunkSize);
      await this.setMacroBuffer(offset + i, chunk);
    }
  }
}

// Check if WebHID API is supported
export function isWebSerialSupported(): boolean {
  return 'hid' in navigator;
}
