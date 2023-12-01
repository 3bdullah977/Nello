import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { board } from './board';

export const column = pgTable('column', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  position: integer('position').notNull(),
  boardId: serial('board_id')
    .references(() => board.id)
    .notNull(),
  createdAt: timestamp('created_at').$defaultFn(() => new Date()),
  updatedAt: timestamp('updated_at').$defaultFn(() => new Date()),
});

export type Column = InferSelectModel<typeof column>;
export type InsertColumn = InferInsertModel<typeof column>;
