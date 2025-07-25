import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

export interface Note {
	id: number;
	title: string;
	note: string;
	created: string;
}

const notes: Note[] = [];

export const fetchNotes = createServerFn().handler(async () => {
	const reversedNotes = [...notes].reverse();
	return reversedNotes;
});

export const addNote = createServerFn({
	method: "POST",
	response: "data",
})
	.validator((note) => {
		if (!(note instanceof FormData)) throw new Error("Invalid form data");
		let title = note.get("title");
		let noteText = note.get("note");

		if (!title || !noteText)
			throw new Error("Note must have title and content");
		return { title: title.toString(), note: noteText.toString() };
	})
	.handler(async ({ data: { title, note } }) => {
		const inputNote: Note = {
			id: notes.length + 1,
			title,
			note,
			created: new Date().toISOString(),
		};
		notes.push(inputNote);
		return inputNote;
	});
