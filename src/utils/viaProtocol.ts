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

    // Send command via HID (convert Uint8Array to ArrayBuffer)
    await this.device.sendReport(0, command.buffer);

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
}

// Check if WebHID API is supported
export function isWebSerialSupported(): boolean {
  return 'hid' in navigator;
}
