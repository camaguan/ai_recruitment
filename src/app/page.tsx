"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import Logo from "@/components/ui/Logo";

export default function Home() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchJobs = async () => {
        const { data } = await supabase
            .from("jobs")
            .select("*")
            .eq("status", "open")
            .order("created_at", { ascending: false });
        if (data) setJobs(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleScrollToVacancies = (e: React.MouseEvent) => {
        e.preventDefault();
        const element = document.getElementById("vacancies");
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans select-none selection:bg-blue-600 selection:text-white">
            {/* Header / Navbar */}
            <header className="sticky top-0 z-50 backdrop-blur-md bg-zinc-950/80 border-b border-zinc-900/80 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Logo iconSize={32} textSize="text-2xl" />
                    <Link 
                        href="/login"
                        className="px-4 py-2 text-sm font-medium border border-zinc-800 rounded-lg hover:bg-zinc-900 hover:text-white transition-all duration-200"
                    >
                        Ingreso Reclutador
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative overflow-hidden py-24 px-6 border-b border-zinc-900 bg-radial-[circle_at_top] from-blue-950/25 via-transparent to-transparent">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-semibold uppercase tracking-wider">
                        🤖 Reclutamiento Automatizado de Próxima Generación
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
                        Encuentra tu próximo desafío impulsado por IA
                    </h1>
                    <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
                        AI Recruit agiliza los procesos de contratación. Analizamos tu currículum de forma inteligente con IA para vincularte a la vacante ideal en minutos.
                    </p>
                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a 
                            href="#vacancies"
                            onClick={handleScrollToVacancies}
                            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/10 active:scale-[0.98] transition-all duration-200 cursor-pointer"
                        >
                            Ver Vacantes Disponibles
                        </a>
                    </div>
                </div>
            </section>

            {/* Business Value Features Section */}
            <section className="py-20 px-6 max-w-7xl mx-auto w-full border-b border-zinc-900">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-zinc-900/30 p-8 rounded-2xl border border-zinc-900 space-y-4">
                        <div className="text-3xl text-blue-500">⚡</div>
                        <h3 className="text-xl font-bold text-white">Análisis en Segundos</h3>
                        <p className="text-sm text-zinc-400 leading-relaxed">
                            Procesamiento inteligente mediante IA que extrae tus habilidades, experiencia y fortalezas clave directamente de tu archivo PDF en tiempo real.
                        </p>
                    </div>

                    <div className="bg-zinc-900/30 p-8 rounded-2xl border border-zinc-900 space-y-4">
                        <div className="text-3xl text-blue-500">🎯</div>
                        <h3 className="text-xl font-bold text-white">Match Inteligente</h3>
                        <p className="text-sm text-zinc-400 leading-relaxed">
                            Calculamos un índice de compatibilidad objetivo con los requerimientos de la vacante, facilitando el trabajo de los reclutadores y garantizando justicia.
                        </p>
                    </div>

                    <div className="bg-zinc-900/30 p-8 rounded-2xl border border-zinc-900 space-y-4">
                        <div className="text-3xl text-blue-500">⚖️</div>
                        <h3 className="text-xl font-bold text-white">Decisión Humana</h3>
                        <p className="text-sm text-zinc-400 leading-relaxed">
                            Aunque la IA ayuda a calificar y resumir perfiles, todas las contrataciones son validadas por nuestro equipo de reclutamiento operativo (Human-in-the-loop).
                        </p>
                    </div>
                </div>
            </section>

            {/* Public Vacancies Section */}
            <section id="vacancies" className="flex-1 py-20 px-6 max-w-7xl mx-auto w-full space-y-10">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight text-white">
                        Oportunidades Disponibles
                    </h2>
                    <p className="text-sm text-zinc-400">
                        Selecciona una vacante activa para aplicar e iniciar el proceso
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="text-center py-20 bg-zinc-900/30 rounded-2xl border border-zinc-900 p-8">
                        <p className="text-zinc-500 italic">No hay vacantes disponibles en este momento.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {jobs.map((job) => (
                            <div 
                                key={job.id} 
                                className="group relative bg-zinc-900/50 p-6 rounded-2xl border border-zinc-900 shadow-xl flex flex-col justify-between transition-all duration-300 hover:border-zinc-800 hover:-translate-y-1 hover:bg-zinc-900"
                            >
                                <div className="space-y-4">
                                    <div className="flex items-start justify-between">
                                        <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                                            {job.title}
                                        </h3>
                                        <span className="px-2.5 py-1 bg-zinc-800 border border-zinc-700 text-xs font-semibold rounded-md text-zinc-300">
                                            {job.seniority_required}
                                        </span>
                                    </div>
                                    <p className="text-sm text-zinc-400 line-clamp-3 leading-relaxed">
                                        {job.description}
                                    </p>
                                </div>
                                <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                                    <span className="text-xs text-zinc-650">Vacante Abierta</span>
                                    <Link 
                                        href={`/apply/${job.id}`}
                                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                                    >
                                        Postularse <span>→</span>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Footer */}
            <footer className="border-t border-zinc-900 py-10 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-600">
                    <p>© {new Date().getFullYear()} AI Recruit. Todos los derechos reservados.</p>
                    <p>Potenciado por Next.js, Supabase y Gemini AI</p>
                </div>
            </footer>
        </div>
    );
}
