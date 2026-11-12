import React from "react";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useAppForm } from "@/components/use-app-form";
import { Button } from "../ui/button";

export const NewContainerDialog = ({ children }: { children: React.ReactElement }) => {
	const form = useAppForm({
		defaultValues: {
			containerName: "",
			description: "",
		},
	});

	const handleSubmit = React.useCallback(
		(e: React.SubmitEvent) => {
			e.preventDefault();
			e.stopPropagation();
			form.handleSubmit();
		},
		[form.handleSubmit],
	);

	return (
		<Dialog>
			<form.AppForm>
				<DialogTrigger render={children} />
				<DialogContent>
					<form onSubmit={handleSubmit}>
						<DialogHeader>
							<DialogTitle>New Container</DialogTitle>
							<DialogDescription>Add a new container</DialogDescription>
						</DialogHeader>
						<form.FieldGroup>
							<form.AppField
								name="containerName"
								children={(field) => (
									<field.Field>
										<field.FieldLabel>Name</field.FieldLabel>
										<field.Input
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											onBlur={field.handleBlur}
											placeholder="Drawer"
										/>
									</field.Field>
								)}
							/>
							<form.AppField
								name="description"
								children={(field) => (
									<field.Field className="mb-2">
										<field.FieldLabel>Description</field.FieldLabel>
										<field.Textarea rows={2} />
									</field.Field>
								)}
							/>
						</form.FieldGroup>
						<DialogFooter>
							<DialogClose render={<Button variant="outline">Cancel</Button>} />
							<Button type="submit">Save</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</form.AppForm>
		</Dialog>
	);
};
