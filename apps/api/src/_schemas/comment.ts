import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { serial } from 'drizzle-orm/pg-core';
import { pgTable, text } from 'drizzle-orm/pg-core';
import { card } from './card';
import { user } from './user';

export const comment = pgTable('comment', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  userId: serial('user_id')
    .notNull()
    .references(() => user.id),
  cardId: serial('card_id')
    .notNull()
    .references(() => card.id),
});

export type Comment = InferSelectModel<typeof comment>;
export type InsertComment = InferInsertModel<typeof comment>;
