"use client";

import { Globe, LayoutDashboard } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-brand-black/50 backdrop-blur-md border-b border-charcoal-200 dark:border-white/5 transition-colors duration-300">
            <Link href="/" className="flex items-center gap-2">
                <div className="p-2 bg-brand-orange rounded-xl">
                    <Globe className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight text-charcoal-900 dark:text-white">GlobalPass</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-charcoal-500 dark:text-charcoal-400">
                <Link href="/" className="hover:text-charcoal-900 dark:hover:text-white transition-colors">
                    Home
                </Link>
                <SignedIn>
                    <Link href="/dashboard" className="flex items-center gap-1.5 hover:text-charcoal-900 dark:hover:text-white transition-colors">
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                    </Link>
                </SignedIn>
                <a href="#" className="hover:text-charcoal-900 dark:hover:text-white transition-colors">About</a>
            </nav>

            <div className="flex items-center gap-3">
                <ThemeToggle />

                <SignedOut>
                    <SignInButton mode="modal">
                        <button className="px-5 py-2.5 text-sm font-semibold text-white bg-brand-orange rounded-full hover:bg-brand-orange-hover transition-colors shadow-lg">
                            Sign In
                        </button>
                    </SignInButton>
                </SignedOut>

                <SignedIn>
                    <UserButton
                        afterSignOutUrl="/"
                        appearance={{
                            elements: {
                                avatarBox: "w-9 h-9"
                            }
                        }}
                    />
                </SignedIn>
            </div>
        </header>
    );
}
