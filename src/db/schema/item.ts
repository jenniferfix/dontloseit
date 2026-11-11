import {
	foreignKey,
	index,
	pgTable,
	text,
	uniqueIndex,
	uuid,
} from "drizzle-orm/pg-core";
import { generateId } from "@/lib/uuid";
import { timestamptz } from "../timestamptz";
import { user } from "./auth";
import { container } from "./container";

export const item = pgTable(
	"item",
	{
		id: uuid("id").primaryKey().$defaultFn(generateId()),
		userId: uuid("user_id")
			.notNull()
			.references(() => user.id),
		containerId: uuid("container_id").references(() => container.id, {
			onDelete: "set null",
			onUpdate: "cascade",
		}),
		name: text("name"),
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
		}),
		index("item_container_id_idx").on(t.containerId),
		index("item_user_id_idx").on(t.userId),
		index("item_scan_code_idx").on(t.scanCode),
		uniqueIndex("item_scan_code_user_id_uidx").on(t.scanCode, t.userId),
	],
);
