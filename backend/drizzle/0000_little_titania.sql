CREATE TABLE "questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"question" text NOT NULL,
	"option_a" varchar(255) NOT NULL,
	"option_b" varchar(255) NOT NULL,
	"option_c" varchar(255) NOT NULL,
	"option_d" varchar(255) NOT NULL,
	"answer" char(1) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
