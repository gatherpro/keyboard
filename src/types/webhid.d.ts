// WebHID API type definitions

interface HIDDevice {
  opened: boolean;
  vendorId: number;
  productId: number;
  productName: string;
  collections: HIDCollectionInfo[];

  open(): Promise<void>;
  close(): Promise<void>;
  sendReport(reportId: number, data: Uint8Array | ArrayBuffer): Promise<void>;
  sendFeatureReport(reportId: number, data: Uint8Array | ArrayBuffer): Promise<void>;
  receiveFeatureReport(reportId: number): Promise<DataView>;

  addEventListener(
    type: 'inputreport',
    listener: (this: HIDDevice, ev: HIDInputReportEvent) => void
  ): void;
  removeEventListener(
    type: 'inputreport',
    listener: (this: HIDDevice, ev: HIDInputReportEvent) => void
  ): void;
}

interface HIDCollectionInfo {
  usagePage: number;
  usage: number;
  type: number;
  children: HIDCollectionInfo[];
  inputReports: HIDReportInfo[];
  outputReports: HIDReportInfo[];
  featureReports: HIDReportInfo[];
}

interface HIDReportInfo {
  reportId: number;
  items: HIDReportItem[];
}

interface HIDReportItem {
  isAbsolute: boolean;
  isArray: boolean;
  isBufferedBytes: boolean;
  isConstant: boolean;
  isLinear: boolean;
  isRange: boolean;
  isVolatile: boolean;
  hasNull: boolean;
  hasPreferredState: boolean;
  wrap: boolean;
  usages: number[];
  usageMinimum: number;
  usageMaximum: number;
  reportSize: number;
  reportCount: number;
  unitExponent: number;
  unitSystem: number;
  unitFactorLengthExponent: number;
  unitFactorMassExponent: number;
  unitFactorTimeExponent: number;
  unitFactorTemperatureExponent: number;
  unitFactorCurrentExponent: number;
  unitFactorLuminousIntensityExponent: number;
  logicalMinimum: number;
  logicalMaximum: number;
  physicalMinimum: number;
  physicalMaximum: number;
  strings: string[];
}

interface HIDInputReportEvent extends Event {
  readonly device: HIDDevice;
  readonly reportId: number;
  readonly data: DataView;
}

interface HIDDeviceFilter {
  vendorId?: number;
  productId?: number;
  usagePage?: number;
  usage?: number;
}

interface HIDDeviceRequestOptions {
  filters: HIDDeviceFilter[];
}

interface HID extends EventTarget {
  getDevices(): Promise<HIDDevice[]>;
  requestDevice(options: HIDDeviceRequestOptions): Promise<HIDDevice[]>;

  addEventListener(
    type: 'connect' | 'disconnect',
    listener: (this: HID, ev: HIDConnectionEvent) => void
  ): void;
  removeEventListener(
    type: 'connect' | 'disconnect',
    listener: (this: HID, ev: HIDConnectionEvent) => void
  ): void;
}

interface HIDConnectionEvent extends Event {
  readonly device: HIDDevice;
}

interface Navigator {
  hid: HID;
}
