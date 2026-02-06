
export enum JobStatus {
  DISPATCHED = 'DISPATCHED',
  ARRIVED_ORIGIN = 'ARRIVED_ORIGIN',
  SURVEY_WALKTHROUGH = 'SURVEY_WALKTHROUGH',
  BINDING_ESTIMATE = 'BINDING_ESTIMATE',
  OFFICE_VERIFICATION = 'OFFICE_VERIFICATION',
  CLIENT_APPROVAL = 'CLIENT_APPROVAL',
  LOADING = 'LOADING',
  LOAD_VERIFICATION = 'LOAD_VERIFICATION',
  IN_TRANSIT = 'IN_TRANSIT',
  WAREHOUSE_CUSTODY = 'WAREHOUSE_CUSTODY',
  DESTINATION_GATE = 'DESTINATION_GATE',
  UNLOADING = 'UNLOADING',
  FINAL_AUDIT = 'FINAL_AUDIT',
  COMPLETED = 'COMPLETED'
}

export type Perspective = 'DRIVER' | 'HELPER' | 'OFFICE' | 'WAREHOUSE' | 'CLIENT';

export interface InventoryItem {
  id: string;
  name: string;
  condition: string;
  verified: boolean;
  photoUrl?: string;
  location?: string;
}

export interface Address {
  name: string;
  street: string;
  cityStateZip: string;
  phone: string;
}

export interface DetailedCharges {
  weightBaseLbs: number;
  weightBaseRate: number;
  weightAddLbs: number;
  weightAddRate: number;
  cubicEstimateCuFt: number;
  cubicBaseCuFt: number;
  cubicBaseRate: number;
  cubicAddCuFt: number;
  cubicAddRate: number;
  hourlyPart1Start: string;
  hourlyPart1End: string;
  hourlyPart2Start: string;
  hourlyPart2End: string;
  hourlyMen: number;
  hourlyTrucks: number;
  hourlyRate: number;
  packingMaterialsTotal: number;
  fullPackingService: number;
  packingOther: number;
  fuelSurcharge: number;
  stairsOrigin: number;
  stairsDest: number;
  longCarryOrigin: number;
  longCarryDest: number;
  shuttleOrigin: number;
  shuttleDest: number;
  miscBulkyItem: number;
  splitStopOff: number;
  pgsService: number;
  valuationCharge: number;
  storageDays: number;
  storageCuFt: number;
  storageRate: number;
  storageOther: number;
  partialPayments: number[];
  priceAdjustment: number;
}

export interface CalendarEvent {
  id: string;
  date: string;
  type: 'JOB' | 'MAINTENANCE' | 'OFF' | 'REQUEST';
  label: string;
  status?: 'PENDING' | 'CONFIRMED';
}

export interface Job {
  id: string;
  pickupDate: string;
  firstAvailableDate: string;
  vehicleId: string;
  origin: Address;
  destination: Address;
  status: JobStatus;
  inventory: InventoryItem[];
  financials: DetailedCharges;
  valuationOption: 1 | 2;
  originSigned: boolean;
  deliverySigned: boolean;
  warehouseArrivalTimestamp?: string;
  warehouseHandshakeTimestamp?: string;
  storageEntryDate?: string;
  outboundScheduledDate?: string;
  pickupPaid: boolean;
  deliveryPaid: boolean;
  custodyHolder: 'DRIVER' | 'WAREHOUSE' | 'CLIENT';
  assignedHelpers: string[];
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}
