import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { db } from "@/db";
import { generateId } from "@/lib/uuid";

export const auth = betterAuth({
	baseURL: process.env.BETTER_AUTH_URL,
	emailAndPassword: {
		enabled: true,
	},
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		},
	},
	advanced: { database: { generateId: () => generateId("v4")() } },
	database: drizzleAdapter(db, {
		provider: "pg",
	}),
	plugins: [admin(), tanstackStartCookies()],
});
