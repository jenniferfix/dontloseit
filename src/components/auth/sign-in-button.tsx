import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/client";

export const SignInButton = () => {
	const { data: session, isPending, isRefetching } = authClient.useSession();

	const disabled = isPending || isRefetching;

	if (!session)
		return (
			<Button
				disabled={disabled}
				onClick={async () => {
					const data = await authClient.signIn.social({ provider: "google" });
				}}
			>
				Sign-in
			</Button>
		);
	else return <Button>Sign out</Button>;
};
