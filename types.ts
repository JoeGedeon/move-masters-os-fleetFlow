
/**
 * Represents the 14 distinct states of the Move Masters operational workflow.
 * These states track the lifecycle of a job from initial booking to final completion.
 *
 * @enum {string}
 * @readonly
 */
export enum JobStatus {
  /**
   * **Stage 1: Dispatch**
   * Initial state when a job is created and assigned to a vehicle/crew.
   * - **Role:** Office/Dispatch
   * - **Action:** Assigns resources and notifies the crew.
   */
  DISPATCHED = 'DISPATCHED',

  /**
   * **Stage 2: Arrival**
   * Crew has arrived at the pickup location (Origin).
   * - **Role:** Driver/Foreman
   * - **Trigger:** GPS geofence or manual "Arrived" confirmation.
   */
  ARRIVED_ORIGIN = 'ARRIVED_ORIGIN',

  /**
   * **Stage 3: Survey**
   * Crew conducts a walkthrough to verify inventory against the estimate.
   * - **Role:** Driver/Foreman & Client
   * - **Purpose:** identify undisclosed items or access issues before work begins.
   */
  SURVEY_WALKTHROUGH = 'SURVEY_WALKTHROUGH',

  /**
   * **Stage 4: Rate Lock (Gate 1)**
   * **CRITICAL GATE:** The binding estimate is finalized based on the survey.
   * - **Role:** Office (Hub Authorization Required)
   * - **Gate:** Workflow pauses here until the Office reviews and locks the final rates.
   * - **Prevention:** Prevents "bait and switch" or disputes later.
   */
  BINDING_ESTIMATE = 'BINDING_ESTIMATE',

  /**
   * **Stage 5: Office Verification**
   * Internal check to ensure all paperwork is generated and compliant.
   * - **Role:** Office
   * - **Purpose:** Pre-loading compliance check.
   */
  OFFICE_VERIFICATION = 'OFFICE_VERIFICATION',

  /**
   * **Stage 6: Client Approval (Gate 2)**
   * **LIABILITY GATE:** Client signs the Bill of Lading and Valuation selection.
   * - **Role:** Client
   * - **Gate:** Loading cannot commence without a signature.
   * - **Legal:** Establishes liability coverage (Valuation) and contract acceptance.
   */
  CLIENT_APPROVAL = 'CLIENT_APPROVAL',

  /**
   * **Stage 7: Loading**
   * Physical loading of goods onto the truck.
   * - **Role:** Crew (Driver/Helpers)
   * - **Action:** Inventory items are tagged and loaded.
   */
  LOADING = 'LOADING',

  /**
   * **Stage 8: Load Verification (Handoff Gate)**
   * Verification that all items are loaded and accounted for.
   * - **Role:** Driver & Client
   * - **Gate:** Client must sign off that the home is empty/goods are loaded.
   * - **Purpose:** Prevents "left behind" claims.
   */
  LOAD_VERIFICATION = 'LOAD_VERIFICATION',

  /**
   * **Stage 9: In Transit**
   * Goods are moving to the destination or warehouse.
   * - **Role:** Driver
   * - **Logic:** Hub decides routing here (Direct Delivery vs. Warehouse Storage).
   */
  IN_TRANSIT = 'IN_TRANSIT',

  /**
   * **Stage 10: Warehouse Custody**
   * (Optional) Goods are stored in the warehouse.
   * - **Role:** Warehouse Manager
   * - **Custody:** Liability transfers from Driver to Warehouse.
   */
  WAREHOUSE_CUSTODY = 'WAREHOUSE_CUSTODY',

  /**
   * **Stage 11: Destination Gate (Gate 3)**
   * **FINANCIAL GATE:** Arrival at destination, pending payment.
   * - **Role:** Office/Hub
   * - **Gate:** Unloading is physically blocked until the balance is paid in full.
   * - **Policy:** "No Pay, No Key" (or No Unload).
   */
  DESTINATION_GATE = 'DESTINATION_GATE',

  /**
   * **Stage 12: Unloading**
   * Physical unloading of goods into the destination property.
   * - **Role:** Crew
   * - **Action:** Items are placed in designated rooms.
   */
  UNLOADING = 'UNLOADING',

  /**
   * **Stage 13: Final Audit (Completion Gate)**
   * Final walkthrough to check for damage and ensure all items were delivered.
   * - **Role:** Client & Driver
   * - **Gate:** Client must sign the final delivery receipt to release the crew.
   */
  FINAL_AUDIT = 'FINAL_AUDIT',

  /**
   * **Stage 14: Completed**
   * Job is closed, archived, and financial reconciliation is done.
   * - **Role:** System/Office
   * - **Status:** Terminal state.
   */
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
