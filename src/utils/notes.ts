import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

export interface Note {
	id: number;
	title: string;
	note: string;
	created: string;
}

const notes: Note[] = [];

export const fetchNoteById = createServerFn()
	.validator((noteId: number) => noteId)
	.handler(({ data }) => {
		const storedNote = notes[data - 1];
		if (storedNote) return storedNote;
		throw notFound();
	});

export const fetchNotes = createServerFn().handler(() => {
	const reversedNotes = [...notes].reverse();
	return reversedNotes;
});

export const updateNote = createServerFn({
	method: "POST",
	response: "data",
})
	.validator((note) => {
		if (!(note instanceof FormData)) throw new Error("Invalid form data");
		let noteId = note.get("noteId");
		let title = note.get("title");
		let noteText = note.get("note");

		if (!title || !noteText)
			throw new Error("Note must have title and content");
		return {
			id: noteId ? Number(noteId) : undefined,
			title: title.toString(),
			note: noteText.toString(),
		};
	})
	.handler(({ data: { title, note, id } }) => {
		if (id) {
			let storedNote = notes[id - 1];
			notes[id - 1] = { ...storedNote, ...{ title, note } };
			return notes[id - 1];
		}
		let inputNote: Note = {
			id: notes.length + 1,
			title,
			note,
			created: new Date().toISOString(),
		};
		notes.push(inputNote);
		return inputNote;
	});
