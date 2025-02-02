CREATE TABLE "verification_code" (
	"id" uuid PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"requested_for" text NOT NULL,
	"requested_by" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "verification_code_code_unique" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "verification_code" ADD CONSTRAINT "verification_code_requested_by_user_id_fk" FOREIGN KEY ("requested_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;