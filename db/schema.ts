import { IndividualType } from "@/models/Spider.model";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const spiders = sqliteTable("spiders", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  spiderSpecies: text("species").notNull(),
  individualType: text("individual_type").$type<IndividualType | undefined>(),
  lastFed: text("last_fed").notNull(),
  feedingFrequency: text("feeding_frequency").notNull(),
  lastMolt: text("last_molt").notNull(),
  imageUri: text("image_uri"),
  isFavourite: integer("is_favourite", { mode: "boolean" }).default(false),
  status: text("status"),
  nextFeedingDate: text("next_feeding_date"),
});

export type SpiderDB = typeof spiders.$inferSelect;
