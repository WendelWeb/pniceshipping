import { db } from '../config/database';
import { shipmentListing } from '../config/schema';
import { eq } from 'drizzle-orm';
import { Shipment, StatusDates } from '../types';

/**
 * Fetch all shipments for a specific user by ownerId
 */
export const findShipmentsByOwnerId = async (ownerId: string): Promise<Shipment[]> => {
  try {
    if (!ownerId || ownerId.trim() === '') {
      return [];
    }

    const results = await db
      .select()
      .from(shipmentListing)
      .where(eq(shipmentListing.ownerId, ownerId));

    // Map results to ensure statusDates is properly formatted
    return results.map((item) => ({
      ...item,
      statusDates: Array.isArray(item.statusDates)
        ? item.statusDates
        : typeof item.statusDates === 'string'
        ? JSON.parse(item.statusDates)
        : [],
    })) as Shipment[];
  } catch (error) {
    console.error('Error fetching shipments by ownerId:', error);
    throw error;
  }
};

/**
 * Fetch a single shipment by tracking number
 */
export const findShipmentByTrackingNumber = async (
  trackingNumber: string
): Promise<Shipment | null> => {
  try {
    if (!trackingNumber || trackingNumber.trim() === '') {
      return null;
    }

    const results = await db
      .select()
      .from(shipmentListing)
      .where(eq(shipmentListing.trackingNumber, trackingNumber));

    if (results.length === 0) {
      return null;
    }

    const shipment = results[0];
    return {
      ...shipment,
      statusDates: Array.isArray(shipment.statusDates)
        ? shipment.statusDates
        : typeof shipment.statusDates === 'string'
        ? JSON.parse(shipment.statusDates)
        : [],
    } as Shipment;
  } catch (error) {
    console.error('Error fetching shipment by tracking number:', error);
    throw error;
  }
};

/**
 * Get shipment statistics for a user
 */
export const getShipmentStats = (shipments: Shipment[]) => {
  return {
    total: shipments.length,
    pending: shipments.filter((s) => s.status === 'En attente⏳').length,
    received: shipments.filter((s) => s.status === 'Recu📦').length,
    inTransit: shipments.filter((s) => s.status === 'En Transit✈️').length,
    available: shipments.filter((s) => s.status === 'Disponible🟢').length,
    delivered: shipments.filter((s) => s.status === 'Livré✅').length,
  };
};

/**
 * Filter shipments by status
 */
export const filterShipmentsByStatus = (
  shipments: Shipment[],
  status: string
): Shipment[] => {
  if (status === 'all') {
    return shipments;
  }
  return shipments.filter((s) => s.status === status);
};

/**
 * Sort shipments by date (most recent first)
 */
export const sortShipmentsByDate = (shipments: Shipment[]): Shipment[] => {
  return [...shipments].sort((a, b) => {
    const dateA = a.statusDates && a.statusDates.length > 0
      ? new Date(a.statusDates[0].date).getTime()
      : 0;
    const dateB = b.statusDates && b.statusDates.length > 0
      ? new Date(b.statusDates[0].date).getTime()
      : 0;
    return dateB - dateA; // Most recent first
  });
};
