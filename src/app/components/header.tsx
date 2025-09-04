import Link from "next/link";
export default function Header() {
  return (
    <header className="border-foreground bg-background sticky top-0 z-50 w-full border-b-4">
      <div className="w-full p-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-black tracking-tight uppercase">
              BIM Open Schema Reader
            </h1>
          </div>
          <nav className="hidden items-center space-x-8 md:flex">
            <Link
              href="https://github.com/tsoumdoa/bim-open-schema-reader"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold tracking-wider uppercase hover:underline"
            >
              GitHub Repo
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
