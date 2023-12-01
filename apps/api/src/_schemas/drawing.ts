import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { user } from './user';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { board } from './board';

export const drawing = pgTable('drawing', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  creatorId: serial('creator_id')
    .notNull()
    .references(() => user.id),
  boardId: serial('board_id')
    .notNull()
    .references(() => board.id),
  createdAt: timestamp('created_at').$defaultFn(() => new Date()),
  updatedAt: timestamp('updated_at').$defaultFn(() => new Date()),
});

export type Drawing = InferSelectModel<typeof drawing>;
export type InsertDrawing = InferInsertModel<typeof drawing>;
