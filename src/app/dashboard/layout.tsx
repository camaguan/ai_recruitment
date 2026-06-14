"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import Logo from "@/components/ui/Logo";

const NAV_ITEMS = [
    { href: "/dashboard",            label: "Overview",       sym: "◈" },
    { href: "/dashboard/jobs",       label: "Vacantes",       sym: "▣" },
    { href: "/dashboard/candidates", label: "Candidatos",     sym: "◉" },
    { href: "/dashboard/settings",   label: "Configuración",  sym: "◧" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const getLinkClass = (href: string) => {
        const isActive = pathname === href;
        return `flex items-center gap-3 px-6 py-3.5 text-[10px] font-black uppercase tracking-[0.18em] transition-all duration-150 border-l-2 ${
            isActive
                ? "border-[#FF3000] text-[#FF3000] bg-white/[0.04]"
                : "border-transparent text-white/40 hover:text-white hover:border-white/30"
        }`;
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        document.cookie = "sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax; Secure";
        router.push("/login");
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] flex flex-col md:flex-row">

            {/* ── Mobile Header ── */}
            <div className="flex md:hidden items-center justify-between border-b border-white/10 px-4 py-3 bg-[#0A0A0A] sticky top-0 z-40">
                <Logo iconSize={22} textSize="text-sm" variant="dark" />
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="text-white focus:outline-none p-1 border border-white/10"
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>
            </div>

            {/* ── Sidebar (Desktop) ── */}
            <aside className="hidden md:flex w-56 border-r border-white/10 flex-col flex-shrink-0 swiss-grid-pattern-dark">

                {/* Logo */}
                <div className="border-b border-white/10 px-6 py-5">
                    <Logo iconSize={26} textSize="text-base" variant="dark" />
                    <p className="text-[8px] font-black uppercase tracking-[0.3em] text-white/25 mt-2 pl-[38px]">
                        Hiring Dashboard
                    </p>
                </div>

                {/* Nav */}
                <nav className="flex-1 py-6 space-y-0.5">
                    {NAV_ITEMS.map(({ href, label, sym }) => (
                        <Link key={href} href={href} className={getLinkClass(href)}>
                            <span className="opacity-40 text-[11px]">{sym}</span>
                            {label}
                        </Link>
                    ))}
                </nav>

                {/* User / Logout */}
                <div className="border-t border-white/10 px-6 py-5 space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 border border-white/20 flex items-center justify-center text-[9px] font-black text-white/50">
                            R
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">
                            Recruiter
                        </span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-[9px] font-black uppercase tracking-[0.2em] text-white/25 hover:text-[#FF3000] transition-colors duration-150"
                    >
                        Cerrar Sesión →
                    </button>
                </div>
            </aside>

            {/* ── Sidebar (Mobile Overlay Drawer) ── */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 flex md:hidden">
                    {/* Backdrop */}
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-xs" onClick={() => setIsMobileMenuOpen(false)} />
                    {/* Drawer Content */}
                    <aside className="relative w-64 max-w-[80%] bg-[#0A0A0A] border-r border-white/10 flex flex-col swiss-grid-pattern-dark h-full">
                        {/* Logo */}
                        <div className="border-b border-white/10 px-6 py-5">
                            <Logo iconSize={26} textSize="text-base" variant="dark" />
                            <p className="text-[8px] font-black uppercase tracking-[0.3em] text-white/25 mt-2 pl-[38px]">
                                Hiring Dashboard
                            </p>
                        </div>

                        {/* Nav */}
                        <nav className="flex-1 py-6 space-y-0.5">
                            {NAV_ITEMS.map(({ href, label, sym }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={getLinkClass(href)}
                                >
                                    <span className="opacity-40 text-[11px]">{sym}</span>
                                    {label}
                                </Link>
                            ))}
                        </nav>

                        {/* User / Logout */}
                        <div className="border-t border-white/10 px-6 py-5 space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 border border-white/20 flex items-center justify-center text-[9px] font-black text-white/50">
                                    R
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">
                                    Recruiter
                                </span>
                            </div>
                            <button
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    handleLogout();
                                }}
                                className="text-[9px] font-black uppercase tracking-[0.2em] text-white/25 hover:text-[#FF3000] transition-colors duration-150"
                            >
                                Cerrar Sesión →
                            </button>
                        </div>
                    </aside>
                </div>
            )}

            {/* ── Main ── */}
            <main className="flex-1 overflow-y-auto bg-[#0A0A0A]">
                {children}
            </main>
        </div>
    );
}