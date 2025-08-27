import Link from "next/link";
export default function Header() {
	return (
		<header className="border-foreground bg-background w-full border-b-4">
			<div className="container mx-auto py-3">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-3">
						<h1 className="text-2xl font-black tracking-tight uppercase">
							<Link href="/" className="">
								BIM Open Schema Reader
							</Link>
						</h1>
					</div>
					<nav className="hidden items-center space-x-8 md:flex">
						<Link
							href="#features"
							className="hover: text-sm font-bold tracking-wider uppercase"
						>
							GitHub Repo
						</Link>
					</nav>
				</div>
			</div>
		</header>
	);
}
