import { pgTable, serial, timestamp, text, varchar } from 'drizzle-orm/pg-core';
import { user } from './user';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { board } from './board';

export const document = pgTable('document', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  content: text('content'),
  creatorId: serial('creator_id').references(() => user.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  boardId: serial('board_id').references(() => board.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  createdAt: timestamp('created_at').$defaultFn(() => new Date()),
  updatedAt: timestamp('updated_at').$defaultFn(() => new Date()),
});

export type Document = InferSelectModel<typeof document>;
export type InsertDocument = InferInsertModel<typeof document>;
