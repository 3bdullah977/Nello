import { pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { user, usersToBoards } from './user';
import { boolean } from 'drizzle-orm/pg-core';
import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';

export const board = pgTable('board', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  creatorId: serial('creator_id')
    .references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' })
    .notNull(),
  isPrivate: boolean('is_private').notNull().default(false),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').$defaultFn(() => new Date()),
  updatedAt: timestamp('updated_at').$defaultFn(() => new Date()),
});

export const boardRelations = relations(board, ({ many }) => ({
  usersToBoards: many(usersToBoards),
}));

export type Board = InferSelectModel<typeof board>;
export type InsertBoard = InferInsertModel<typeof board>;
