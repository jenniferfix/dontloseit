import { createFormHookContexts, useSelector } from "@tanstack/react-form";
import * as React from "react";

const {
	fieldContext,
	formContext,
	useFieldContext: useFormFieldContext,
	useFormContext,
} = createFormHookContexts();

type FormItemContextValue = {
	id: string;
	hasDescription: boolean;
	hasMessage: boolean;
	setHasDescription: (rendered: boolean) => void;
	setHasMessage: (rendered: boolean) => void;
};

const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue);

const useFieldContext = () => {
	const { id, hasDescription, hasMessage, setHasDescription, setHasMessage } =
		React.useContext(FormItemContext);
	const { name, store, ...fieldContext } = useFormFieldContext();
	const errors = useSelector(store, (state) => state.meta.errors);

	if (!fieldContext) {
		throw new Error("useFieldContext should be used within <FormItem>");
	}

	const formDescriptionId = `${id}-form-item-description`;
	const formMessageId = `${id}-form-item-message`;
	// Only reference the description and message while they are rendered.
	const describedBy =
		[hasDescription && formDescriptionId, hasMessage && formMessageId].filter(Boolean).join(" ") ||
		undefined;

	return {
		id,
		name,
		formItemId: `${id}-form-item`,
		formDescriptionId,
		formMessageId,
		describedBy,
		setHasDescription,
		setHasMessage,
		errors,
		store,
		...fieldContext,
	};
};

/** Gives one field row its ids and tracks which describing elements are rendered. */
function FormItemProvider({ children }: { children: React.ReactNode }) {
	const id = React.useId();
	const [hasDescription, setHasDescription] = React.useState(false);
	const [hasMessage, setHasMessage] = React.useState(false);
	const value = React.useMemo(
		() => ({ id, hasDescription, hasMessage, setHasDescription, setHasMessage }),
		[id, hasDescription, hasMessage],
	);

	return <FormItemContext.Provider value={value}>{children}</FormItemContext.Provider>;
}

export {
	FormItemProvider,
	fieldContext,
	formContext,
	useFieldContext,
	useFormContext,
	useFormFieldContext,
};
