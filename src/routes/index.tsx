import { createFileRoute, Link } from "@tanstack/react-router";
import { fetchNotes } from "~/utils/notes";

export const Route = createFileRoute("/")({
	component: NotesComponent,
	ssr: "data-only",
	loader: () => fetchNotes(),
});

function NotesComponent() {
	const notes = Route.useLoaderData();

	return (
		<div className='max-w-2xl mx-auto p-4'>
			{!notes.length ? (
				<p className='text-gray-500'>No notes</p>
			) : (
				<ul className='space-y-4'>
					{notes.map((n) => (
						<li key={n.id}>
							<Link
								to='/notes/$noteId'
								params={{ noteId: n.id }}
								className='border p-3 block rounded shadow-sm bg-white hover:shadow-md'
							>
								<h2 className='font-semibold'>{n.title}</h2>
								<p className='text-sm text-gray-600'>
									{n.note}
								</p>
								<p className='mt-2 text-xs text-gray-400'>
									Created:{" "}
									{new Date(n.created).toLocaleString()}
								</p>
							</Link>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
