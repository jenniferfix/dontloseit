import { NewContainerDialog } from "@/components/container/new-container-dialog";
import { Button } from "@/components/ui/button";

export const Header = () => {
	return (
		<header className="flex">
			<NewContainerDialog>
				<Button>Add Container</Button>
			</NewContainerDialog>
			<Button>Add Item</Button>
		</header>
	);
};
