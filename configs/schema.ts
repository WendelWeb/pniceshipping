import { pgTable, serial, varchar,json } from "drizzle-orm/pg-core";

export const shipmentListing = pgTable("shipmentListing", {
  id: serial("id").primaryKey(),
  ownerId: varchar("ownerId").notNull(),
  fullName: varchar("fullName").notNull(),
  userName: varchar("userName").notNull(),
  category: varchar("category").notNull(),
  emailAdress: varchar("emailAdress").notNull(),
  trackingNumber: varchar("trackingNumber").notNull(),
  weight: varchar("weight").notNull(),
  status: varchar("status").notNull(),
  destination: varchar("destination").notNull(),
  estimatedDelivery: varchar("estimatedDelivery").notNull(),
  phone: varchar('phone'),
  statusDates: json("statusDates"),
});
