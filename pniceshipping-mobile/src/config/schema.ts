import { pgTable, serial, varchar, json, timestamp } from 'drizzle-orm/pg-core';

export const shipmentListing = pgTable('shipmentListing', {
  id: serial('id').primaryKey(),
  ownerId: varchar('ownerId').notNull(),
  fullName: varchar('fullName').notNull(),
  userName: varchar('userName').notNull(),
  category: varchar('category').notNull(),
  emailAdress: varchar('emailAdress').notNull(),
  trackingNumber: varchar('trackingNumber').notNull(),
  weight: varchar('weight').notNull(),
  status: varchar('status').notNull(),
  destination: varchar('destination').notNull(),
  estimatedDelivery: varchar('estimatedDelivery').notNull(),
  phone: varchar('phone'),
  statusDates: json('statusDates'),
});

// Table de paramètres pour les tarifs dynamiques
export const settings = pgTable('settings', {
  id: serial('id').primaryKey(),
  key: varchar('key').notNull().unique(),
  value: json('value').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  updatedBy: varchar('updated_by'),
});

// Table pour les tokens de notifications push
export const pushTokens = pgTable('push_tokens', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id').notNull(),
  pushToken: varchar('push_token').notNull().unique(),
  deviceInfo: json('device_info'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  isActive: varchar('is_active').notNull().default('true'),
});
