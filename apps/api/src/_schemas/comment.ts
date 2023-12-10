import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { serial, timestamp } from 'drizzle-orm/pg-core';
import { pgTable, text } from 'drizzle-orm/pg-core';
import { card } from './card';
import { user } from './user';

export const comment = pgTable('comment', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  userId: serial('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  cardId: serial('card_id').references(() => card.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  createdAt: timestamp('created_at').$defaultFn(() => new Date()),
  updatedAt: timestamp('updated_at').$defaultFn(() => new Date()),
});

export type Comment = InferSelectModel<typeof comment>;
export type InsertComment = InferInsertModel<typeof comment>;
