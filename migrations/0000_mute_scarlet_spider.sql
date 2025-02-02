CREATE TABLE "user" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"role" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
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
ALTER TABLE "verification_code" ADD CONSTRAINT "verification_code_requested_by_user_id_fk" FOREIGN KEY ("requested_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_code_request_idx" ON "verification_code" USING btree ("code","requested_for","requested_by");