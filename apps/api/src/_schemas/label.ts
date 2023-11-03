import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { serial, varchar } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { card } from './card';
import { board } from './board';

export const label = pgTable('label', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  color: varchar('color', { length: 20 }).notNull(),
  cardId: serial('card_id')
    .notNull()
    .references(() => card.id),
  boardId: serial('board_id')
    .notNull()
    .references(() => board.id),
});

export type Label = InferSelectModel<typeof label>;
export type InsertLabel = InferInsertModel<typeof label>;
