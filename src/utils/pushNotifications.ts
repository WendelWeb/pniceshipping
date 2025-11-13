/**
 * Push notification service for sending notifications to mobile app users
 * Uses Expo Push Notification service
 */

export interface PushNotificationPayload {
  to: string; // Expo push token
  title: string;
  body: string;
  data?: {
    shipmentId?: string;
    trackingNumber?: string;
    status?: string;
    [key: string]: any;
  };
  sound?: 'default' | null;
  badge?: number;
  channelId?: string;
}

/**
 * Send a push notification using Expo's push notification service
 */
export async function sendPushNotification(payload: PushNotificationPayload): Promise<boolean> {
  try {
    const message = {
      to: payload.to,
      sound: payload.sound ?? 'default',
      title: payload.title,
      body: payload.body,
      data: payload.data ?? {},
      badge: payload.badge,
      channelId: payload.channelId ?? 'default',
    };

    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    const data = await response.json();
    console.log('Push notification sent:', data);

    return response.ok;
  } catch (error) {
    console.error('Error sending push notification:', error);
    return false;
  }
}

/**
 * Send notifications to multiple recipients
 */
export async function sendPushNotifications(payloads: PushNotificationPayload[]): Promise<boolean> {
  try {
    const messages = payloads.map(payload => ({
      to: payload.to,
      sound: payload.sound ?? 'default',
      title: payload.title,
      body: payload.body,
      data: payload.data ?? {},
      badge: payload.badge,
      channelId: payload.channelId ?? 'default',
    }));

    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messages),
    });

    const data = await response.json();
    console.log('Batch push notifications sent:', data);

    return response.ok;
  } catch (error) {
    console.error('Error sending batch push notifications:', error);
    return false;
  }
}

/**
 * Helper function to create a shipment status update notification
 */
export function createShipmentStatusNotification(
  pushToken: string,
  trackingNumber: string,
  newStatus: string,
  shipmentId: string
): PushNotificationPayload {
  const statusEmojis: Record<string, string> = {
    'En attente⏳': '⏳',
    'Recu📦': '📦',
    'En Transit✈️': '✈️',
    'Disponible🟢': '🟢',
    'Livré✅': '✅',
  };

  const emoji = statusEmojis[newStatus] || '📦';

  return {
    to: pushToken,
    title: `${emoji} Mise à jour de votre colis`,
    body: `Votre colis ${trackingNumber} est maintenant: ${newStatus}`,
    data: {
      shipmentId,
      trackingNumber,
      status: newStatus,
      type: 'shipment_status_update',
    },
    sound: 'default',
    badge: 1,
  };
}

/**
 * Helper function to create a new shipment notification
 */
export function createNewShipmentNotification(
  pushToken: string,
  trackingNumber: string,
  shipmentId: string
): PushNotificationPayload {
  return {
    to: pushToken,
    title: '📦 Nouveau Colis Enregistré',
    body: `Votre colis ${trackingNumber} a été enregistré avec succès!`,
    data: {
      shipmentId,
      trackingNumber,
      type: 'new_shipment',
    },
    sound: 'default',
    badge: 1,
  };
}

/**
 * Helper function to create a pricing update notification
 */
export function createPricingUpdateNotification(pushToken: string): PushNotificationPayload {
  return {
    to: pushToken,
    title: '💰 Tarifs Mis à Jour',
    body: 'Les tarifs d\'expédition ont été mis à jour. Consultez le calculateur pour les nouveaux prix.',
    data: {
      type: 'pricing_update',
    },
    sound: 'default',
  };
}
