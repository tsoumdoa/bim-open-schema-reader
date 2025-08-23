export default function Header() {
  return (
    <header className="border-foreground bg-background border-b-4">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-black tracking-tight uppercase">
              BIM Open Schema Reader
            </h1>
          </div>
          <nav className="hidden items-center space-x-8 md:flex">
            <a
              href="#features"
              className="hover: text-sm font-bold tracking-wider uppercase"
            >
              GitHub Repo
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
