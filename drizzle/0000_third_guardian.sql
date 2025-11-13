CREATE TABLE "deliveryBatch" (
	"id" serial PRIMARY KEY NOT NULL,
	"ownerId" varchar NOT NULL,
	"deliveryDate" timestamp DEFAULT now(),
	"totalWeight" varchar NOT NULL,
	"serviceFee" integer DEFAULT 10 NOT NULL,
	"shippingCost" integer NOT NULL,
	"totalCost" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar NOT NULL,
	"value" json NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"updated_by" varchar,
	CONSTRAINT "settings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "shipmentListing" (
	"id" serial PRIMARY KEY NOT NULL,
	"ownerId" varchar NOT NULL,
	"fullName" varchar NOT NULL,
	"userName" varchar NOT NULL,
	"category" varchar NOT NULL,
	"emailAdress" varchar NOT NULL,
	"trackingNumber" varchar NOT NULL,
	"weight" varchar NOT NULL,
	"status" varchar NOT NULL,
	"destination" varchar NOT NULL,
	"estimatedDelivery" varchar NOT NULL,
	"phone" varchar,
	"statusDates" json
);
--> statement-breakpoint
CREATE TABLE "shipmentToDelivery" (
	"shipmentId" integer NOT NULL,
	"deliveryBatchId" integer NOT NULL,
	"shipmentDetails" json NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_whatsapp_phone_numbers" (
	"id" serial PRIMARY KEY NOT NULL,
	"phone" text NOT NULL,
	"owner_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "shipmentToDelivery" ADD CONSTRAINT "shipmentToDelivery_shipmentId_shipmentListing_id_fk" FOREIGN KEY ("shipmentId") REFERENCES "public"."shipmentListing"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipmentToDelivery" ADD CONSTRAINT "shipmentToDelivery_deliveryBatchId_deliveryBatch_id_fk" FOREIGN KEY ("deliveryBatchId") REFERENCES "public"."deliveryBatch"("id") ON DELETE no action ON UPDATE no action;