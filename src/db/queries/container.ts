import { eq, sql } from "drizzle-orm";
import type { DatabaseExecutor } from "../";
import { container } from "../schema";

export async function moveContainer(
	db: DatabaseExecutor,
	containerId: string,
	newParentId: string | null,
) {
	await db.transaction(async (tx) => {
		if (newParentId !== null) {
			const result = await tx.execute(sql`
        WITH RECURSIVE ancestors AS (
          SELECT id, parent_id FROM container WHERE id = ${newParentId}
          UNION ALL
          SELECT c.id, c.parent_id
          FROM container c
          JOIN ancestors a ON c.id = a.parent_id
        )
        SELECT 1 FROM ancestors WHERE id = ${containerId} LIMIT 1
      `);
			if (result.rows.length) {
				throw new Error(
					"Cannot move a container into itself or one of its own decendants",
				);
			}
		}

		await tx
			.update(container)
			.set({ parentId: newParentId })
			.where(eq(container.id, containerId));
	});
}
