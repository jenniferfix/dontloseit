import * as t from "drizzle-orm/pg-core";

/**
 * timestamptz
 *
 * A point in time: Postgres `timestamp with time zone`, read and written as a
 * JS `Date`. Use this instead of `t.timestamp()` for every moment column.
 */
export const timestamptz = (name: string) =>
	t.timestamp(name, { withTimezone: true });
