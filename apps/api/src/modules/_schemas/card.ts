import { pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { column } from './column';

export const card = pgTable('card', {
  id: serial('id').primaryKey(),
  title: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  coverImage: varchar('cover_image'),
  columnId: serial('column_id')
    .notNull()
    .references(() => column.id),
});

export type Card = InferSelectModel<typeof card>;
export type InsertCard = InferInsertModel<typeof card>;
