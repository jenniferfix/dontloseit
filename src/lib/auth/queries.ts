import { queryOptions } from "@tanstack/react-query";
import { authClient, type Session } from "@/lib/auth/client";

export const getSessionQueryKey = () => ["session"] as const;

export const getSessionQueryOptions = () => {
	return queryOptions({
		queryKey: getSessionQueryKey(),
		queryFn: async (): Promise<Session | null> => {
			const { data, error } = await authClient.getSession();
			if (error) throw error;
			return data;
		},
	});
};
