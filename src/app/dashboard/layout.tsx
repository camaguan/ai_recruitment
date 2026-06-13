import Link from "next/link";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar de Navegación */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col">
                <div className="p-6">
                    <h2 className="text-2xl font-bold tracking-tight text-blue-400">
                        AI<span className="text-white">Recruit</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">Hiring Dashboard</p>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    <Link
                        href="/dashboard/jobs"
                        className="block px-4 py-2.5 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                        🏢 Vacantes
                    </Link>
                    <Link
                        href="/dashboard/candidates"
                        className="block px-4 py-2.5 rounded-md text-sm font-medium bg-blue-600 text-white shadow-sm transition-colors"
                    >
                        👥 Candidatos
                    </Link>
                    <Link
                        href="/dashboard/settings"
                        className="block px-4 py-2.5 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                        ⚙️ Configuración
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold">
                            R
                        </div>
                        <div className="text-sm">
                            <p className="font-medium">Recruiter</p>
                            <button className="text-xs text-slate-400 hover:text-white">Cerrar sesión</button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Contenido Principal (Aquí se inyectan page.tsx) */}
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}