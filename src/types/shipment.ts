export interface StatusDates {
  date: string;
  status: string;
  location?: string;
}
export interface Shipment {
  id: number;
  ownerId: string;
  fullName: string;
  userName: string;
  category: string;
  emailAdress: string;
  trackingNumber: string;
  weight: string;
  status: string;
  destination: string;
  estimatedDelivery: string;
  statusDates: StatusDates[];
  phone: string | null;
  cost?: number; // Ajouté pour compatibilité
}
// export interface Shipment {
//   id: number;
//   ownerId: string;
//   fullName: string;
//   userName: string;
//   category: string;
//   emailAdress: string; // Note: Consider renaming to `emailAddress` for consistency
//   trackingNumber: string;
//   weight: string;
//   status: string;
//   destination: string;
//   estimatedDelivery: string;
//   statusDates: StatusDates[] ;
//   phone: string; // Add missing property
// }

export interface ShipmentFormData {
    fullName?: string;
    userName?: string;
    emailAdress?: string;
    trackingNumber?: string;
    category?: string;
    weight?: number;
    status?: string;
    destination?: string;
    [key: string]: any;
  }
  export interface ShipmentFormItem {
    label: string;
    name: string;
    fieldType: string;
    required: boolean;
    column: number;
    icon: string;
    options?: string[];
  }