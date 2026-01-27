import { Globe } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-brand-black/50 backdrop-blur-md border-b border-charcoal-200 dark:border-white/5 transition-colors duration-300">
            <div className="flex items-center gap-2">
                <div className="p-2 bg-brand-orange rounded-xl">
                    <Globe className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight text-charcoal-900 dark:text-white">GlobalPass</span>
            </div>

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-charcoal-500 dark:text-charcoal-400">
                <a href="#" className="hover:text-charcoal-900 dark:hover:text-white transition-colors">Destinations</a>
                <a href="#" className="hover:text-charcoal-900 dark:hover:text-white transition-colors">Journal</a>
                <a href="#" className="hover:text-charcoal-900 dark:hover:text-white transition-colors">About</a>
            </nav>

            <div className="flex items-center gap-3">
                <ThemeToggle />
                <button className="hidden md:block px-4 py-2 text-sm font-medium text-charcoal-700 dark:text-white border border-charcoal-200 dark:border-white/10 rounded-full hover:bg-charcoal-100 dark:hover:bg-white/5 transition-colors">
                    Get App
                </button>
            </div>
        </header>
    );
}


