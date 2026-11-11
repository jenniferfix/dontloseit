import { defineRelations } from "drizzle-orm";
import * as tables from "./schema";

export const relations = defineRelations(tables, (r) => ({
	container: {
		parent: r.one.container({ from: r.container.parentId, to: r.container.id }),
		user: r.one.user({ from: r.container.userId, to: r.user.id }),
	},
	item: {
		container: r.one.container({
			from: r.item.containerId,
			to: r.container.id,
		}),
		user: r.one.user({ from: r.item.userId, to: r.user.id }),
	},

	/**
	 * auth related schema
	 */
	account: { user: r.one.user({ from: r.account.userId, to: r.user.id }) },
	session: { user: r.one.user({ from: r.session.userId, to: r.user.id }) },
	user: {
		accounts: r.many.account(),
		sessions: r.many.session(),
	},
}));
