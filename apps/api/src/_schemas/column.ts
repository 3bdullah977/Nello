import { integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { board } from './board';

export const column = pgTable('column', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  position: integer('position').notNull(),
  boardId: serial('board_id')
    .references(() => board.id)
    .notNull(),
});

export type Column = InferSelectModel<typeof column>;
export type InsertColumn = InferInsertModel<typeof column>;
