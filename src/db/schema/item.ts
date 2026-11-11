import {
	foreignKey,
	index,
	pgTable,
	text,
	uniqueIndex,
} from "drizzle-orm/pg-core";
import { generateId } from "@/lib/uuid";
import { timestamptz } from "../timestamptz";
import { user } from "./auth";
import { container } from "./container";

export const item = pgTable(
	"item",
	{
		id: text("id").primaryKey().$defaultFn(generateId("v7")),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
		containerId: text("container_id"),
		name: text("name").notNull(),
		description: text("description"),
		scanCode: text("scan_code"),
		createdAt: timestamptz("created_at").defaultNow().notNull(),
		updatedAt: timestamptz("updated_at")
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(t) => [
		// an items container must belong to the same user
		foreignKey({
			name: "item_container_same_user_fk",
			columns: [t.containerId, t.userId],
			foreignColumns: [container.id, container.userId],
		}).onDelete("restrict"),
		index("item_container_id_idx").on(t.containerId),
		index("item_user_id_idx").on(t.userId),
		uniqueIndex("item_scan_code_user_id_uidx").on(t.scanCode, t.userId),
	],
);
