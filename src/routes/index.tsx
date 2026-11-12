import { createFileRoute } from "@tanstack/react-router";
import { SignInButton } from "@/components/auth/sign-in-button";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	return (
		<div className="p-8">
			<div>
				<h1 className="text-4xl font-bold">Don't Lose It!</h1>
				<p>
					Jennifers app to help her not lose stuff. This is a private application. You shouldn't be
					here.
				</p>
			</div>
			<div>
				<SignInButton />
			</div>
		</div>
	);
}
