import { boolean, index, pgTable, text } from "drizzle-orm/pg-core";
import { generateId } from "@/lib/uuid";
import { timestamptz } from "../timestamptz";

export const user = pgTable("user", {
	id: text("id").primaryKey().$defaultFn(generateId("v7")),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("email_verified").default(false).notNull(),
	image: text("image"),
	createdAt: timestamptz("created_at").defaultNow().notNull(),
	updatedAt: timestamptz("updated_at")
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
	role: text("role"),
	banned: boolean("banned").default(false),
	banReason: text("ban_reason"),
	banExpires: timestamptz("ban_expires"),
});

export const session = pgTable(
	"session",
	{
		id: text("id").primaryKey().$defaultFn(generateId("v7")),
		expiresAt: timestamptz("expires_at").notNull(),
		token: text("token").notNull().unique(),
		createdAt: timestamptz("created_at").defaultNow().notNull(),
		updatedAt: timestamptz("updated_at")
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
		ipAddress: text("ip_address"),
		userAgent: text("user_agent"),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		impersonatedBy: text("impersonated_by"),
	},
	(table) => [index("session_user_id_idx").on(table.userId)],
);

export const account = pgTable(
	"account",
	{
		id: text("id").primaryKey().$defaultFn(generateId("v7")),
		accountId: text("account_id").notNull(),
		providerId: text("provider_id").notNull(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		accessToken: text("access_token"),
		refreshToken: text("refresh_token"),
		idToken: text("id_token"),
		accessTokenExpiresAt: timestamptz("access_token_expires_at"),
		refreshTokenExpiresAt: timestamptz("refresh_token_expires_at"),
		scope: text("scope"),
		password: text("password"),
		createdAt: timestamptz("created_at").defaultNow().notNull(),
		updatedAt: timestamptz("updated_at")
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(table) => [index("account_user_id_idx").on(table.userId)],
);

export const verification = pgTable(
	"verification",
	{
		id: text("id").primaryKey().$defaultFn(generateId("v7")),
		identifier: text("identifier").notNull(),
		value: text("value").notNull(),
		expiresAt: timestamptz("expires_at").notNull(),
		createdAt: timestamptz("created_at").defaultNow().notNull(),
		updatedAt: timestamptz("updated_at")
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(table) => [index("verification_identifier_idx").on(table.identifier)],
);
