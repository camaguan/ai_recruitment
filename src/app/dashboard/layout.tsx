"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const getLinkClass = (href: string) => {
        const isActive = pathname === href;
        return `block px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            isActive
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
        }`;
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex text-zinc-50">
            {/* Sidebar de Navegación */}
            <aside className="w-64 bg-zinc-900 border-r border-zinc-800 text-white flex flex-col">
                <div className="p-6">
                    <h2 className="text-2xl font-bold tracking-tight text-blue-400">
                        AI<span className="text-zinc-50">Recruit</span>
                    </h2>
                    <p className="text-xs text-zinc-500 mt-1">Hiring Dashboard</p>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    <Link
                        href="/dashboard"
                        className={getLinkClass("/dashboard")}
                    >
                        📊 Overview
                    </Link>
                    <Link
                        href="/dashboard/jobs"
                        className={getLinkClass("/dashboard/jobs")}
                    >
                        🏢 Vacantes
                    </Link>
                    <Link
                        href="/dashboard/candidates"
                        className={getLinkClass("/dashboard/candidates")}
                    >
                        👥 Candidatos
                    </Link>
                    <Link
                        href="/dashboard/settings"
                        className={getLinkClass("/dashboard/settings")}
                    >
                        ⚙️ Configuración
                    </Link>
                </nav>

                <div className="p-4 border-t border-zinc-800">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-sm font-bold text-zinc-300">
                            R
                        </div>
                        <div className="text-sm">
                            <p className="font-medium text-zinc-200">Recruiter</p>
                            <button className="text-xs text-zinc-500 hover:text-zinc-300">Cerrar sesión</button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Contenido Principal (Aquí se inyectan page.tsx) */}
            <main className="flex-1 overflow-y-auto bg-zinc-950">
                {children}
            </main>
        </div>
    );
}