import { Header } from '@/components/Header';
import { VisaSearch } from '@/components/VisaSearch';
import { InteractiveBackground } from '@/components/InteractiveBackground';

export default function Home() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-brand-black text-charcoal-900 dark:text-white selection:bg-brand-orange selection:text-white transition-colors duration-300">
            <Header />

            <InteractiveBackground />

            <main className="flex min-h-screen flex-col items-center pt-48 pb-12 px-4 relative overflow-hidden">

                {/* Hero Section */}
                <div className="w-full max-w-3xl mx-auto text-center mb-16 space-y-10">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-charcoal-100 dark:bg-white/5 border border-charcoal-200 dark:border-white/10 text-sm font-medium text-charcoal-600 dark:text-charcoal-300 shadow-sm mb-8 backdrop-blur-sm">
                        ✨ Simplified Travel Logistics
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-charcoal-900 dark:text-white">
                        Check visa requirements <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-red-500">
                            instantly.
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-charcoal-500 dark:text-charcoal-400 max-w-2xl mx-auto leading-relaxed">
                        Stop digging through government websites. Enter your passport and destination to get clear, up-to-date visa information in seconds.
                    </p>
                </div>

                {/* Search Component */}
                <VisaSearch />

                {/* Footer / Trust indicators could go here */}
            </main>
        </div>
    );
}

