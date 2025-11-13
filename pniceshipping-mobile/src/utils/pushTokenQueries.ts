/**
 * Database queries for managing push notification tokens
 */

import { db } from '../config/database';
import { pushTokens } from '../config/schema';
import { eq, and } from 'drizzle-orm';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

export interface PushTokenRecord {
  id: number;
  userId: string;
  pushToken: string;
  deviceInfo?: any;
  createdAt: Date;
  updatedAt: Date;
  isActive: string;
}

/**
 * Register or update a push token for a user
 */
export async function registerPushToken(
  userId: string,
  pushToken: string
): Promise<boolean> {
  try {
    // Collect device info
    const deviceInfo = {
      brand: Device.brand,
      model: Device.modelName,
      platform: Platform.OS,
      osVersion: Platform.Version,
      deviceType: Device.deviceType,
    };

    // Check if token already exists
    const existing = await db
      .select()
      .from(pushTokens)
      .where(eq(pushTokens.pushToken, pushToken))
      .limit(1);

    if (existing.length > 0) {
      // Update existing token
      await db
        .update(pushTokens)
        .set({
          userId,
          deviceInfo,
          updatedAt: new Date(),
          isActive: 'true',
        })
        .where(eq(pushTokens.pushToken, pushToken));

      console.log('✅ Push token updated');
    } else {
      // Insert new token
      await db.insert(pushTokens).values({
        userId,
        pushToken,
        deviceInfo,
        isActive: 'true',
      });

      console.log('✅ Push token registered');
    }

    return true;
  } catch (error) {
    console.error('Error registering push token:', error);
    return false;
  }
}

/**
 * Get all active push tokens for a specific user
 */
export async function getUserPushTokens(userId: string): Promise<string[]> {
  try {
    const tokens = await db
      .select()
      .from(pushTokens)
      .where(
        and(
          eq(pushTokens.userId, userId),
          eq(pushTokens.isActive, 'true')
        )
      );

    return tokens.map(t => t.pushToken);
  } catch (error) {
    console.error('Error getting user push tokens:', error);
    return [];
  }
}

/**
 * Deactivate a push token (when user logs out or uninstalls)
 */
export async function deactivatePushToken(pushToken: string): Promise<boolean> {
  try {
    await db
      .update(pushTokens)
      .set({
        isActive: 'false',
        updatedAt: new Date(),
      })
      .where(eq(pushTokens.pushToken, pushToken));

    console.log('✅ Push token deactivated');
    return true;
  } catch (error) {
    console.error('Error deactivating push token:', error);
    return false;
  }
}

/**
 * Get all active push tokens (for broadcasting to all users)
 */
export async function getAllActivePushTokens(): Promise<PushTokenRecord[]> {
  try {
    const tokens = await db
      .select()
      .from(pushTokens)
      .where(eq(pushTokens.isActive, 'true'));

    return tokens as PushTokenRecord[];
  } catch (error) {
    console.error('Error getting all push tokens:', error);
    return [];
  }
}
