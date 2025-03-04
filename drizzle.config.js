import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./configs/schema.ts",
  dbCredentials:{
    url:"postgresql://pniceshipping_owner:npg_t04gTEWqruzh@ep-falling-sea-a58tf9ru-pooler.us-east-2.aws.neon.tech/pniceshipping?sslmode=require"
  }
});
