import { createFileRoute } from "@tanstack/react-router";
import { Stage } from "@/components/canvas/stage";

export const Route = createFileRoute("/_auth/canvas/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <Stage />;
}
