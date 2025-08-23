
"use client"

import Header from "./components/header";
import InitialDisplay from "./components/initial-display";


export default function Home() {


	return (
		<div className="min-h-screen bg-background">
			<Header />

			<main className="container mx-auto px-4 py-16">
				<InitialDisplay />
			</main>

		</div>
	)
}
