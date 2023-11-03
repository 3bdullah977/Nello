ALTER TABLE "card" DROP CONSTRAINT "card_board_id_board_id_fk";
--> statement-breakpoint
ALTER TABLE "card" DROP COLUMN IF EXISTS "board_id";