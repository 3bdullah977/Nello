import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { serial } from 'drizzle-orm/pg-core';
import { boolean, pgTable, text } from 'drizzle-orm/pg-core';
import { board } from './board';

export const user = pgTable('user', {
  id: serial('id').primaryKey(),
  username: text('username').notNull(),
  isAdmin: boolean('is_admin').notNull().default(false),
  email: text('email').notNull(),
  password: text('password').notNull(),
  imageUrl: text('image_url'),
});

export const userRelations = relations(user, ({ many }) => ({
  usersToBoards: many(usersToBoards),
}));

export const usersToBoards = pgTable('users_to_boards', {
  userId: serial('user_id')
    .notNull()
    .references(() => user.id),
  boardId: serial('board_id')
    .notNull()
    .references(() => board.id),
});

export const usersToBoardsRelations = relations(usersToBoards, ({ one }) => ({
  userId: one(user, {
    fields: [usersToBoards.userId],
    references: [user.id],
  }),
  boardId: one(board, {
    fields: [usersToBoards.boardId],
    references: [board.id],
  }),
}));

export type User = InferSelectModel<typeof user>;
export type InsertUser = InferInsertModel<typeof user>;
