// Types for Pnice Shipping Mobile App

export interface StatusDates {
  date: string;
  status: string;
  location: string;
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
  cost?: number;
}

export interface ShipmentStats {
  total: number;
  pending: number;
  received: number;
  inTransit: number;
  available: number;
  delivered: number;
}

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  date: string;
  category: 'update' | 'promo' | 'info' | 'alert';
  image?: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
  totalShipments: number;
  shipmentsStats: ShipmentStats;
}

export type ShipmentStatus =
  | 'En attente⏳'
  | 'Recu📦'
  | 'En Transit✈️'
  | 'Disponible🟢'
  | 'Livré✅';

export type DestinationType = 'cap-haitien' | 'port-au-prince';

export interface ShippingCalculation {
  weight: number;
  destination: DestinationType;
  category?: 'standard' | 'telephone' | 'ordinateur-portable' | 'starlink';
  shippingCost: number;
  serviceFee: number;
  totalCost: number;
}
