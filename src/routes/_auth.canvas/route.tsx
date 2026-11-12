import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Header } from "@/components/canvas/header";

export const Route = createFileRoute("/_auth/canvas")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<Header />
			<div>
				<Outlet />
			</div>
		</div>
	);
}
