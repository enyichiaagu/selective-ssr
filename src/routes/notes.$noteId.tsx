import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { fetchNoteById, updateNote } from "~/utils/notes";

interface Draft {
	id?: number;
	title?: string;
	note?: string;
}

const LOCAL_STORAGE_KEY = "draft_note";
const fetchLocalStorage = (): Draft => {
	const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
	const localState = raw ? JSON.parse(raw) : {};
	return localState;
};

const updateLocalStorage = (update: Draft | null) => {
	localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(update ?? {}));
};

export const Route = createFileRoute("/notes/$noteId")({
	params: {
		parse: ({ noteId }) => {
			if (noteId === ("new" as const)) {
				return { noteId };
			} else if (!isNaN(+noteId)) {
				return { noteId: +noteId };
			}
			throw new Error("Invalid Path");
		},
	},
	loader: async ({ params: { noteId } }) => {
		if (noteId === "new") {
			return fetchLocalStorage();
		}
		const { id, title, note } = await fetchNoteById({ data: noteId });
		return { id, title, note };
	},
	component: RouteComponent,
	ssr: false,
});

function RouteComponent() {
	const navigate = useNavigate();
	const fetchedNote = Route.useLoaderData();
	const [formValues, setFormValues] = useState(fetchedNote);

	useEffect(() => {
		setFormValues(fetchedNote);
		console.log(fetchedNote);
	}, [fetchedNote]);

	const handleInputChange = (
		event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = event.currentTarget;
		setFormValues((prevState) => {
			const nextState = { ...prevState, [name]: value };
			if (!fetchedNote?.id) updateLocalStorage(nextState);
			return nextState;
		});
	};

	return (
		<form
			onSubmit={async (event) => {
				event.preventDefault();
				const formData = new FormData(event.currentTarget);
				formData.append("noteId", fetchedNote?.id?.toString() || "");
				await updateNote({ data: formData });
				updateLocalStorage(null);
				return navigate({ to: "/" });
			}}
			method='post'
		>
			<div className='max-w-2xl mx-auto p-4 space-y-4'>
				<input
					type='text'
					name='title'
					placeholder='Untitled note'
					required
					value={formValues.title || ""}
					onChange={handleInputChange}
					className='w-full text-2xl font-bold p-2 border border-gray-300 rounded focus:outline-none focus:ring'
				/>

				<textarea
					name='note'
					placeholder='Start typing your note...'
					required
					value={formValues.note || ""}
					onChange={handleInputChange}
					className='w-full h-40 p-2 border border-gray-300 rounded focus:outline-none focus:ring'
				/>
				<button
					type='submit'
					className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
				>
					Save
				</button>
			</div>
		</form>
	);
}
