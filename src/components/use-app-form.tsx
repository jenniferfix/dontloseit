import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { type AnyFieldApi, createFormHook } from "@tanstack/react-form";
import { cn } from "cn";
import * as React from "react";
import { getErrorMessage } from "../lib/get-error-message";
import {
	FormItemProvider,
	fieldContext,
	formContext,
	useFieldContext,
	useFormContext,
} from "./form-context";
import { Button } from "./ui/button";
import { Checkbox as CheckboxComponent } from "./ui/checkbox";
import {
	Field as FieldComponent,
	FieldContent,
	FieldDescription as FieldDescriptionComponent,
	FieldError,
	FieldGroup,
	FieldLabel as FieldLabelComponent,
	FieldLegend,
	FieldSeparator,
	FieldSet,
	FieldTitle,
} from "./ui/field";
import { Input as InputComponent } from "./ui/input";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
	InputGroupText,
	InputGroupTextarea,
} from "./ui/input-group";
import { Switch as SwitchComponent } from "./ui/switch";
import { Textarea as TextareaComponent } from "./ui/textarea";
import { Toggle as ToggleControl } from "./ui/toggle";

const { useAppForm, withForm } = createFormHook({
	fieldContext,
	formContext,
	fieldComponents: {
		Field,
		FieldContent,
		FieldDescription,
		FieldError,
		FieldInfo,
		FieldTitle,
		FieldLabel,
		Checkbox,
		FormLabel,
		FormMessage,
		FormControl,
		Input,
		Switch,
		InputGroup,
		InputGroupAddon,
		InputGroupButton,
		InputGroupInput,
		InputGroupText,
		InputGroupTextarea,
		Toggle,
		FieldRowProvider,
		Textarea,
	},
	formComponents: {
		Button,
		FieldGroup,
		FieldLegend,
		FieldSeparator,
		FieldSet,
		FormDescription,
		FormLabel,
	},
});

/** Marks a description or message as rendered so controls can point aria-describedby at it. */
function useDescribedByPart(
	setRendered: ((rendered: boolean) => void) | undefined,
	rendered: boolean,
) {
	React.useEffect(() => {
		if (!rendered || !setRendered) return;
		setRendered(true);
		return () => setRendered(false);
	}, [setRendered, rendered]);
}

function FieldRowProvider({ children }: { children: React.ReactNode }) {
	return <FormItemProvider>{children}</FormItemProvider>;
}

function Field({ className, ...props }: React.ComponentProps<typeof FieldComponent>) {
	return (
		<FormItemProvider>
			<FieldComponent className={cn(className)} {...props} />
		</FormItemProvider>
	);
}

function FormLabel({ className, ...props }: React.ComponentProps<typeof FieldLabel>) {
	return (
		<FieldLabelComponent
			data-slot="form-label"
			className={cn("text-lg font-semibold", className)}
			{...props}
		/>
	);
}

function FieldLabel({ className, ...props }: React.ComponentProps<typeof FieldLabelComponent>) {
	const { formItemId } = useFieldContext();

	return <FieldLabelComponent className={cn(className)} htmlFor={formItemId} {...props} />;
}

function FieldDescription({
	className,
	...props
}: React.ComponentProps<typeof FieldDescriptionComponent>) {
	const { formDescriptionId, setHasDescription } = useFieldContext();
	useDescribedByPart(setHasDescription, true);

	return <FieldDescriptionComponent className={cn(className)} id={formDescriptionId} {...props} />;
}

function Checkbox(props: React.ComponentProps<typeof CheckboxComponent>) {
	const { errors, describedBy, name, formItemId } = useFieldContext();
	return (
		<CheckboxComponent
			name={name}
			id={formItemId}
			aria-describedby={describedBy}
			aria-invalid={errors.length > 0}
			{...props}
		/>
	);
}

function Switch(props: React.ComponentProps<typeof SwitchComponent>) {
	const { errors, describedBy, name, formItemId } = useFieldContext();
	return (
		<SwitchComponent
			name={name}
			id={formItemId}
			aria-describedby={describedBy}
			aria-invalid={errors.length > 0}
			{...props}
		/>
	);
}

function Textarea(props: React.ComponentProps<typeof TextareaComponent>) {
	const { name, errors, formItemId, describedBy } = useFieldContext();
	return (
		<TextareaComponent
			name={name}
			id={formItemId}
			aria-describedby={describedBy}
			aria-invalid={errors.length > 0}
			{...props}
		/>
	);
}

function Input(props: React.ComponentProps<typeof InputComponent>) {
	const { name, errors, formItemId, describedBy } = useFieldContext();

	return (
		<InputComponent
			name={name}
			data-slot="form-control"
			id={formItemId}
			aria-describedby={describedBy}
			aria-invalid={errors.length > 0}
			{...props}
		/>
	);
}

function Toggle(props: React.ComponentProps<typeof ToggleControl>) {
	const { name, errors, formItemId, describedBy } = useFieldContext();
	return (
		<ToggleControl
			name={name}
			data-slot="form-control"
			id={formItemId}
			aria-describedby={describedBy}
			aria-invalid={errors.length > 0}
			{...props}
		/>
	);
}

function FormControl({ render, ...props }: useRender.ComponentProps<"div">) {
	const { errors, formItemId, describedBy } = useFieldContext();

	return useRender({
		defaultTagName: "div",
		props: mergeProps<"div">(
			{
				id: formItemId,
				"aria-describedby": describedBy,
				"aria-invalid": !!errors.length,
			},
			props,
		),

		render,
		state: {
			slot: "form-control",
		},
	});
}

function FormDescription({
	className,
	...props
}: React.ComponentProps<typeof FieldDescriptionComponent>) {
	return (
		<FieldDescriptionComponent
			data-slot="form-description"
			className={cn("text-muted-foreground text-sm", className)}
			{...props}
		/>
	);
}

function FormMessage({ className, ...props }: React.ComponentProps<"p">) {
	const { errors, formMessageId, setHasMessage } = useFieldContext();
	const body = errors.length ? String(errors.at(0)?.message ?? "") : props.children;
	useDescribedByPart(setHasMessage, !!body);

	if (!body) return null;

	return (
		<p
			data-slot="form-message"
			id={formMessageId}
			className={cn("text-destructive text-sm", className)}
			{...props}
		>
			{body}
		</p>
	);
}

function FieldInfo({ field }: { field: AnyFieldApi }) {
	const { formMessageId, setHasMessage } = useFieldContext();
	const showErrors = field.state.meta.isTouched && !field.state.meta.isValid;
	useDescribedByPart(setHasMessage, showErrors);

	return (
		<>
			{showErrors ? (
				<ul id={formMessageId} className="text-sm text-destructive">
					{/* onChange and onBlur validators can report the same message */}
					{[...new Set(field.state.meta.errors.map((e) => getErrorMessage(e)))].map((m) => (
						<li key={m}>
							<em>{m}</em>
						</li>
					))}
				</ul>
			) : null}
			{field.state.meta.isValidating ? "Validating..." : null}
		</>
	);
}

export { useAppForm, useFieldContext, useFormContext, withForm };
