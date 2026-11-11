import { and, eq, sql } from "drizzle-orm";
import type { DatabaseExecutor } from "../";
import { container, item } from "../schema";

export async function moveContainer(
	db: DatabaseExecutor,
	userId: string,
	containerId: string,
	newParentId: string | null,
) {
	await db.transaction(async (tx) => {
		if (newParentId !== null) {
			const [parent] = await tx
				.select({ id: container.id })
				.from(container)
				.where(and(eq(container.userId, userId), eq(container.id, newParentId)))
				.limit(1);
			if (!parent) {
				throw new Error("Parent container not found");
			}
			const result = await tx.execute(sql`
        WITH RECURSIVE ancestors AS (
          SELECT id, parent_id FROM container WHERE id = ${newParentId} AND user_id = ${userId}
          UNION ALL
          SELECT c.id, c.parent_id
          FROM container c
          JOIN ancestors a ON c.id = a.parent_id
        )
        SELECT 1 FROM ancestors WHERE id = ${containerId} LIMIT 1
      `);

			if (result.rows.length) {
				throw new Error(
					"Cannot move a container into itself or one of its own descendants",
				);
			}
		}

		const moved = await tx
			.update(container)
			.set({ parentId: newParentId })
			.where(and(eq(container.userId, userId), eq(container.id, containerId)))
			.returning({ id: container.id });

		if (!moved.length) {
			throw new Error("Container not found");
		}
	});
}

export async function deleteContainer(
	db: DatabaseExecutor,
	userId: string,
	containerId: string,
) {
	await db.transaction(async (tx) => {
		await tx
			.update(container)
			.set({ parentId: null })
			.where(
				and(eq(container.userId, userId), eq(container.parentId, containerId)),
			);
		await tx
			.update(item)
			.set({ containerId: null })
			.where(and(eq(item.userId, userId), eq(item.containerId, containerId)));
		const deleted = await tx
			.delete(container)
			.where(and(eq(container.userId, userId), eq(container.id, containerId)))
			.returning({ id: container.id });

		if (!deleted.length) {
			throw new Error("Container not found");
		}
	});
}
