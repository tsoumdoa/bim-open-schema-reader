export default function Header() {
	return (
		<header className="border-b-4 border-foreground bg-background">
			<div className="container mx-auto px-4 py-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-3">
						<h1 className="text-2xl font-black uppercase tracking-tight">BIM Open Schema Reader</h1>
					</div>
					<nav className="hidden md:flex items-center space-x-8">
						<a href="#features" className="text-sm font-bold uppercase tracking-wider hover:">
							GitHub Repo
						</a>
					</nav>
				</div>
			</div>
		</header>
	);
}	
