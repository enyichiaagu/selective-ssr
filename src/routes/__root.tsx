/// <reference types="vite/client" />
import {
	HeadContent,
	Link,
	Scripts,
	createRootRoute,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import * as React from "react";
import { DefaultCatchBoundary } from "~/components/DefaultCatchBoundary";
import { NotFound } from "~/components/NotFound";
import appCss from "~/styles/app.css?url";

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{ title: "Noteland" },
			{
				name: "description",
				content: "An app with a very original idea",
			},
		],
		links: [
			{ rel: "stylesheet", href: appCss },
			{ rel: "icon", href: "/favicon.ico" },
		],
	}),
	errorComponent: DefaultCatchBoundary,
	notFoundComponent: () => <NotFound />,
	shellComponent: RootDocument,
	ssr: true,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html>
			<head>
				<HeadContent />
			</head>
			<body>
				<header className='w-full px-4 py-3 border-b'>
					<div className='max-w-4xl mx-auto flex items-center justify-between'>
						<h1 className='text-lg font-semibold'>
							<Link to='/'>Noteland</Link>
						</h1>
						<Link
							to='/notes/$noteId'
							params={{ noteId: "new" }}
							className='px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition'
						>
							Add note
						</Link>
					</div>
				</header>
				{children}
				<TanStackRouterDevtools position='bottom-right' />
				<Scripts />
			</body>
		</html>
	);
}
