import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Header } from "@/components/canvas/header";

export const Route = createFileRoute("/_auth/canvas")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex h-dvh flex-col">
			<Header />
			<div className="min-h-0 flex-1 overflow-hidden">
				<Outlet />
			</div>
		</div>
	);
}
