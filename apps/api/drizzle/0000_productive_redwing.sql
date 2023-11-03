CREATE TABLE IF NOT EXISTS "board" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"creator_id" serial NOT NULL,
	"is_private" boolean DEFAULT false NOT NULL,
	"image_url" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "card" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"board_id" serial NOT NULL,
	"cover_image" varchar,
	"column_id" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "column" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"position" integer NOT NULL,
	"board_id" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "comment" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"user_id" serial NOT NULL,
	"card_id" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "label" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"color" varchar(20) NOT NULL,
	"card_id" serial NOT NULL,
	"board_id" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"is_admin" boolean DEFAULT false NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users_to_boards" (
	"user_id" serial NOT NULL,
	"board_id" serial NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "board" ADD CONSTRAINT "board_creator_id_user_id_fk" FOREIGN KEY ("creator_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "card" ADD CONSTRAINT "card_board_id_board_id_fk" FOREIGN KEY ("board_id") REFERENCES "board"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "card" ADD CONSTRAINT "card_column_id_column_id_fk" FOREIGN KEY ("column_id") REFERENCES "column"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "column" ADD CONSTRAINT "column_board_id_board_id_fk" FOREIGN KEY ("board_id") REFERENCES "board"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comment" ADD CONSTRAINT "comment_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comment" ADD CONSTRAINT "comment_card_id_card_id_fk" FOREIGN KEY ("card_id") REFERENCES "card"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "label" ADD CONSTRAINT "label_card_id_card_id_fk" FOREIGN KEY ("card_id") REFERENCES "card"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "label" ADD CONSTRAINT "label_board_id_board_id_fk" FOREIGN KEY ("board_id") REFERENCES "board"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_boards" ADD CONSTRAINT "users_to_boards_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_boards" ADD CONSTRAINT "users_to_boards_board_id_board_id_fk" FOREIGN KEY ("board_id") REFERENCES "board"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
