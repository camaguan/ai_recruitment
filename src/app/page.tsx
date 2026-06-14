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

    useEffect(() => { fetchJobs(); }, []);

    const handleScrollToVacancies = (e: React.MouseEvent) => {
        e.preventDefault();
        document.getElementById("vacancies")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="min-h-screen bg-white text-black flex flex-col">

            {/* ── Header ── */}
            <header className="sticky top-0 z-50 bg-white border-b-2 border-black px-4 py-3 md:px-6 md:py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Logo iconSize={28} textSize="text-xl md:text-2xl" variant="light" />
                    <Link
                        href="/login"
                        className="px-3 py-2 md:px-5 md:py-2.5 text-[9px] md:text-[10px] font-black uppercase tracking-widest border-2 border-black text-black hover:bg-black hover:text-white transition-colors duration-150 shrink-0"
                    >
                        <span className="hidden sm:inline">Ingresar como Reclutador</span>
                        <span className="sm:hidden">Ingresar</span>
                    </Link>
                </div>
            </header>

            {/* ── Hero ── */}
            <section className="relative border-b-2 border-black bg-[#F2F2F2] swiss-grid-pattern overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 py-24 md:py-36">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">

                        {/* Copy */}
                        <div className="md:col-span-8 space-y-6">
                            <div className="flex items-center gap-3">
                                <span
                                    className="text-[10px] font-black uppercase tracking-[0.2em]"
                                    style={{ color: "#FF3000" }}
                                >
                                    01. Portal de Empleo
                                </span>
                                <div className="h-px w-12 bg-black/20" />
                            </div>

                            <h1 className="text-6xl md:text-8xl lg:text-[7.5rem] font-black uppercase tracking-tighter leading-[0.88] text-black">
                                Encuentra<br />
                                tu próximo<br />
                                <span style={{ color: "#FF3000" }}>desafío.</span>
                            </h1>

                            <p className="text-base md:text-lg text-black/55 max-w-lg leading-relaxed font-medium">
                                e-Selector conecta candidatos con las mejores vacantes.
                                Proceso objetivo, ágil y completamente transparente.
                            </p>

                            <div className="pt-2">
                                <a
                                    href="#vacancies"
                                    onClick={handleScrollToVacancies}
                                    className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white text-xs font-black uppercase tracking-widest hover:bg-[#FF3000] transition-colors duration-150"
                                >
                                    Ver Vacantes Disponibles
                                    <span className="text-base leading-none">→</span>
                                </a>
                            </div>
                        </div>

                        {/* Bauhaus composition */}
                        <div className="hidden md:flex md:col-span-4 items-end justify-end h-full">
                            <div className="relative w-56 h-56">
                                <div className="absolute inset-0 border-2 border-black" />
                                <div className="absolute top-5 left-5 right-0 bottom-0 border-2 border-black swiss-dots" />
                                <div
                                    className="absolute top-10 left-10 w-20 h-20"
                                    style={{ backgroundColor: "#FF3000" }}
                                />
                                <div className="absolute bottom-5 right-5 w-10 h-10 border-2 border-black bg-white" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Features ── */}
            <section className="border-b-2 border-black">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3">
                        {[
                            {
                                num: "01",
                                title: "Análisis en Segundos",
                                body: "Extraemos habilidades, experiencia y fortalezas directamente de tu CV en tiempo real, sin formularios complicados.",
                            },
                            {
                                num: "02",
                                title: "Match Objetivo",
                                body: "Calculamos un índice de compatibilidad con los requisitos de la vacante, garantizando transparencia en cada paso.",
                            },
                            {
                                num: "03",
                                title: "Decisión Humana",
                                body: "e-Selector entrega información organizada. Todas las contrataciones son validadas por el equipo de reclutamiento.",
                            },
                        ].map((f, i) => (
                            <div
                                key={f.num}
                                className={`p-8 md:p-10 group hover:bg-black transition-colors duration-150 cursor-default border-b-2 md:border-b-0 border-black ${
                                    i < 2 ? "md:border-r-2" : ""
                                } last:border-b-0`}
                            >
                                <span
                                    className="text-[10px] font-black uppercase tracking-[0.2em] group-hover:text-[#FF3000] transition-colors"
                                    style={{ color: "#FF3000" }}
                                >
                                    {f.num}.
                                </span>
                                <h3 className="mt-3 text-lg font-black uppercase tracking-tight text-black group-hover:text-white transition-colors">
                                    {f.title}
                                </h3>
                                <p className="mt-2 text-sm text-black/55 leading-relaxed font-medium group-hover:text-white/60 transition-colors">
                                    {f.body}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Vacancies ── */}
            <section id="vacancies" className="flex-1 py-20 px-6 bg-white">
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* Section header */}
                    <div className="flex items-end justify-between border-b-2 border-black pb-6">
                        <div>
                            <span
                                className="text-[10px] font-black uppercase tracking-[0.2em] block mb-2"
                                style={{ color: "#FF3000" }}
                            >
                                02. Oportunidades
                            </span>
                            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-black leading-none">
                                Vacantes Disponibles
                            </h2>
                        </div>
                        {!loading && (
                            <span className="text-xs font-black uppercase tracking-widest text-black/30">
                                {jobs.length} activa{jobs.length !== 1 ? "s" : ""}
                            </span>
                        )}
                    </div>

                    {/* States */}
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div
                                className="w-8 h-8 border-2 border-black border-t-transparent animate-spin"
                                style={{ borderTopColor: "#FF3000" }}
                            />
                        </div>
                    ) : jobs.length === 0 ? (
                        <div className="py-20 text-center border-2 border-black bg-[#F2F2F2] swiss-dots">
                            <p className="text-xs font-black uppercase tracking-widest text-black/30">
                                No hay vacantes disponibles en este momento.
                            </p>
                        </div>
                    ) : (
                        /* Grid: shared left + top borders, each cell brings right + bottom */
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-l-2 border-t-2 border-black">
                            {jobs.map((job) => (
                                <div
                                    key={job.id}
                                    className="group border-r-2 border-b-2 border-black p-8 flex flex-col justify-between min-h-[200px] hover:bg-black transition-colors duration-150"
                                >
                                    <div className="space-y-3">
                                        <div className="flex items-start justify-between gap-3">
                                            <h3 className="text-base font-black uppercase tracking-tight text-black group-hover:text-white transition-colors leading-tight">
                                                {job.title}
                                            </h3>
                                            <span className="shrink-0 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border border-black text-black group-hover:border-white group-hover:text-white transition-colors">
                                                {job.seniority_required}
                                            </span>
                                        </div>
                                        <p className="text-xs text-black/50 group-hover:text-white/55 leading-relaxed font-medium transition-colors line-clamp-3">
                                            {job.description}
                                        </p>
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-black/15 group-hover:border-white/15 flex items-center justify-between transition-colors">
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-black/25 group-hover:text-white/25 transition-colors">
                                            Vacante Abierta
                                        </span>
                                        <Link
                                            href={`/apply/${job.id}`}
                                            className="text-[10px] font-black uppercase tracking-widest text-black group-hover:text-white flex items-center gap-1.5 transition-colors"
                                        >
                                            Postularse <span>→</span>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="border-t-2 border-black px-6 py-8 bg-white">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <Logo iconSize={22} textSize="text-sm" variant="light" />
                    <div className="text-right">
                        <p className="text-[9px] font-black uppercase tracking-widest text-black/35">
                            © {new Date().getFullYear()} e-Selector. Todos los derechos reservados.
                        </p>
                        <p className="text-[9px] text-black/25 mt-0.5 uppercase tracking-wider">
                            Potenciado por Next.js y Supabase
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
