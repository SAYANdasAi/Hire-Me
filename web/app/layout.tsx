import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HireMe | AI Career Pathway & Job Discovery",
  description: "Map your career journey with AI, discover jobs using semantic search, optimize your resume, and connect with tech recruiters.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gradient-premium min-h-screen text-foreground antialiased selection:bg-primary selection:text-primary-foreground`}>
        {/* Header/Navbar */}
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/60 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <span className="bg-gradient-to-r from-violet-400 via-purple-500 to-indigo-500 bg-clip-text text-xl font-bold tracking-tight text-transparent">
                HireMe
              </span>
              <span className="hidden rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-purple-400 sm:inline-block border border-primary/20">
                AI Pathway
              </span>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex space-x-1">
              <Link
                href="/"
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                Roadmap
              </Link>
              <Link
                href="/feed"
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                Community Feed
              </Link>
              <Link
                href="/search"
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                AI Job Search
              </Link>
              <Link
                href="/resume"
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                Resume Optimizer
              </Link>
            </nav>

            {/* Simulated Auth Controls */}
            <div className="flex items-center space-x-4">
              <Link
                href="/saved"
                className="hidden sm:inline-block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mr-2"
              >
                Saved
              </Link>
              
              {/* Mock User Avatar */}
              <div className="flex items-center space-x-2 cursor-pointer border border-border bg-accent/40 rounded-full pl-2 pr-1 py-1 hover:border-violet-500/30 transition-all">
                <span className="text-xs font-semibold text-white px-1">Alex Carter</span>
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="User avatar"
                  className="w-7 h-7 rounded-full border border-border"
                />
              </div>
            </div>
          </div>

          {/* Mobile Tab Bar (Bottom) */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/80 backdrop-blur-md px-4 py-2">
            <nav className="flex justify-around items-center">
              <Link
                href="/"
                className="flex flex-col items-center justify-center text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mb-0.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v6M3 21h18M12 3v18" />
                </svg>
                Roadmap
              </Link>
              <Link
                href="/feed"
                className="flex flex-col items-center justify-center text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mb-0.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
                Feed
              </Link>
              <Link
                href="/search"
                className="flex flex-col items-center justify-center text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mb-0.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
                </svg>
                Jobs
              </Link>
              <Link
                href="/resume"
                className="flex flex-col items-center justify-center text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mb-0.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                Optimize
              </Link>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </body>
    </html>
  );
}
