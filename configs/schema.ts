import { pgTable, serial, varchar, json, integer, timestamp, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Table pour les colis (inchangée)
export const shipmentListing = pgTable("shipmentListing", {
  id: serial("id").primaryKey(),
  ownerId: varchar("ownerId").notNull(),
  fullName: varchar("fullName").notNull(),
  userName: varchar("userName").notNull(),
  category: varchar("category").notNull(),
  emailAdress: varchar("emailAdress").notNull(),
  trackingNumber: varchar("trackingNumber", { length: 20 }).notNull(),
  weight: varchar("weight").notNull(),
  status: varchar("status").notNull(),
  destination: varchar("destination").notNull(),
  estimatedDelivery: varchar("estimatedDelivery").notNull(),
  phone: varchar("phone"),
  statusDates: json("statusDates"),
});

// Table pour les lots de livraisons (ajout de shippingCost)
export const deliveryBatch = pgTable("deliveryBatch", {
  id: serial("id").primaryKey(),
  ownerId: varchar("ownerId").notNull(),
  deliveryDate: timestamp("deliveryDate").defaultNow(),
  totalWeight: varchar("totalWeight").notNull(),
  serviceFee: integer("serviceFee").notNull().default(10),
  shippingCost: integer("shippingCost").notNull(), // Coût de livraison basé sur le poids et la destination
  totalCost: integer("totalCost").notNull(), // shippingCost + serviceFee
});

// Table de relation avec les détails des colis (ajout du coût dans shipmentDetails)
export const shipmentToDelivery = pgTable("shipmentToDelivery", {
  shipmentId: integer("shipmentId").notNull().references(() => shipmentListing.id),
  deliveryBatchId: integer("deliveryBatchId").notNull().references(() => deliveryBatch.id),
  shipmentDetails: json("shipmentDetails").notNull(), // Inclura le coût par colis
});

// Relations (inchangées)
export const shipmentListingRelations = relations(shipmentListing, ({ many }) => ({
  deliveryBatches: many(shipmentToDelivery),
}));

export const deliveryBatchRelations = relations(deliveryBatch, ({ many }) => ({
  shipments: many(shipmentToDelivery),
}));

export const shipmentToDeliveryRelations = relations(shipmentToDelivery, ({ one }) => ({
  shipment: one(shipmentListing, {
    fields: [shipmentToDelivery.shipmentId],
    references: [shipmentListing.id],
  }),
  deliveryBatch: one(deliveryBatch, {
    fields: [shipmentToDelivery.deliveryBatchId],
    references: [deliveryBatch.id],
  }),
}));


export const userWhatsappPhoneNumbers = pgTable('user_whatsapp_phone_numbers', {
  id: serial('id').primaryKey(),
  phone: text('phone').notNull(),
  ownerId: text('owner_id').notNull(), // Changé de integer à text pour supporter les UUID
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});