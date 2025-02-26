import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const shipmentListing = pgTable("shipmentListing", {
  id: serial("id").primaryKey(),
  fullName: varchar("fullName").notNull(),
  userName: varchar("userName").notNull(),
  category: varchar("category").notNull(),
  emailAdress: varchar("emailAdress").notNull(),
  trackingNumber: varchar("trackingNumber").notNull(),
  weight: varchar("weight").notNull(),
  status: varchar("status").notNull(),
});
