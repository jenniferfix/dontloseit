import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/auth")({
	beforeLoad: ({ context: { session } }) => {
		if (!session) throw redirect({ to: "/" });
	},
});
