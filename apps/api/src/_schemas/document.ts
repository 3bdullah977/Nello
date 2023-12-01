import { pgTable, serial, timestamp, text } from 'drizzle-orm/pg-core';
import { user } from './user';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { board } from './board';

export const document = pgTable('document', {
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

export type Document = InferSelectModel<typeof document>;
export type InsertDocument = InferInsertModel<typeof document>;
