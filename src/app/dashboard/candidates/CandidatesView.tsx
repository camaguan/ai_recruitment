"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

interface Application {
    id: string;
    stage: string;
    score: number | null;
    created_at: string;
    candidate: { name: string; email: string };
    job: { id: string; title: string };
}

interface Job {
    id: string;
    title: string;
}

interface Props {
    applications: any[];
    jobs: Job[];
}

const STAGE_LABELS: Record<string, string> = {
    cv_received: "Recibido",
    ai_parsing: "Procesando",
    human_review: "Revisión",
    interview: "Entrevista",
    rejected: "Descartado",
    hired: "Contratado",
};

const STAGE_COLOR: Record<string, string> = {
    cv_received: "border-white/20 text-white/40",
    ai_parsing: "border-blue-400/50 text-blue-400",
    human_review: "border-yellow-400/50 text-yellow-400",
    interview: "border-green-400/50 text-green-400",
    rejected: "border-red-500/50 text-red-400",
    hired: "border-emerald-400/50 text-emerald-400",
};

function normalize(raw: any[]): Application[] {
    return (raw ?? []).map((a) => ({
        ...a,
        candidate: Array.isArray(a.candidate) ? a.candidate[0] : a.candidate,
        job: Array.isArray(a.job) ? a.job[0] : a.job,
    }));
}

export default function CandidatesView({ applications: rawApplications = [], jobs = [] }: Props) {
    const [selectedJobId, setSelectedJobId] = useState<string>("all");
    const [sortByScore, setSortByScore] = useState(false);

    const applications = useMemo(() => normalize(rawApplications), [rawApplications]);

    const filtered = useMemo(() => {
        let list: Application[] = selectedJobId === "all"
            ? applications
            : applications.filter(a => a.job?.id === selectedJobId);

        if (sortByScore) {
            list = [...list].sort((a, b) => {
                if (a.score == null && b.score == null) return 0;
                if (a.score == null) return 1;
                if (b.score == null) return -1;
                return b.score - a.score;
            });
        }
        return list;
    }, [applications, selectedJobId, sortByScore]);

    const selectedJobTitle = selectedJobId === "all"
        ? null
        : jobs.find(j => j.id === selectedJobId)?.title;

    return (
        <div className="p-4 sm:p-8 max-w-7xl mx-auto">

            {/* ── Header ── */}
            <div className="border-b border-white/10 pb-6 mb-8">
                <span
                    className="text-[9px] font-black uppercase tracking-[0.25em] block mb-2"
                    style={{ color: "#FF3000" }}
                >
                    01. Pipeline
                </span>
                <div className="flex items-end justify-between">
                    <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-white leading-none">
                        Candidatos
                    </h1>
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/25">
                        {filtered.length} postulacion{filtered.length !== 1 ? "es" : ""}
                    </span>
                </div>
            </div>

            {/* ── Filters ── */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/35">
                    Vacante
                </span>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setSelectedJobId("all")}
                        className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.15em] border transition-colors duration-150 ${selectedJobId === "all"
                                ? "border-[#FF3000] text-[#FF3000]"
                                : "border-white/15 text-white/35 hover:border-white/30 hover:text-white/60"
                            }`}
                    >
                        Todas
                    </button>
                    {jobs.map(job => (
                        <button
                            key={job.id}
                            onClick={() => setSelectedJobId(job.id)}
                            className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.15em] border transition-colors duration-150 ${selectedJobId === job.id
                                    ? "border-[#FF3000] text-[#FF3000]"
                                    : "border-white/15 text-white/35 hover:border-white/30 hover:text-white/60"
                                }`}
                        >
                            {job.title}
                        </button>
                    ))}
                </div>

                <div className="hidden sm:block w-px h-4 bg-white/10" />

                <button
                    onClick={() => setSortByScore(s => !s)}
                    className={`flex items-center gap-2 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.15em] border transition-colors duration-150 ${sortByScore
                            ? "border-[#FF3000] text-[#FF3000]"
                            : "border-white/15 text-white/35 hover:border-white/30 hover:text-white/60"
                        }`}
                >
                    <span>↓</span> Ordenar por Score
                </button>
            </div>

            {/* ── Ranking label ── */}
            {selectedJobId !== "all" && sortByScore && filtered.length > 0 && (
                <div className="border-l-2 pl-4 mb-6" style={{ borderColor: "#FF3000" }}>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">
                        Ranking — {selectedJobTitle}
                    </p>
                </div>
            )}

            {/* ── Mobile Cards ── */}
            <div className="block sm:hidden space-y-4">
                {filtered.map((app, i) => (
                    <div
                        key={app.id}
                        className="border border-white/10 p-5 space-y-4 hover:bg-white/[0.02] transition-colors"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3">
                                {sortByScore && selectedJobId !== "all" && (
                                    <span
                                        className="text-[9px] font-black tabular-nums pt-0.5 shrink-0"
                                        style={{ color: "#FF3000" }}
                                    >
                                        #{i + 1}
                                    </span>
                                )}
                                <div>
                                    <p className="text-sm font-bold text-white">{app.candidate?.name}</p>
                                    <p className="text-[10px] text-white/35 mt-0.5 font-medium">{app.candidate?.email}</p>
                                </div>
                            </div>
                            {app.score != null ? (
                                <span className="text-sm font-black tabular-nums shrink-0" style={{ color: "#FF3000" }}>
                                    {app.score}/100
                                </span>
                            ) : (
                                <span className="text-xs text-white/25 font-medium shrink-0">—</span>
                            )}
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-white/5">
                            <div className="flex flex-col gap-1.5">
                                {selectedJobId === "all" && (
                                    <span className="text-xs text-white/50 font-medium">{app.job?.title}</span>
                                )}
                                <span className={`self-start text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 border ${STAGE_COLOR[app.stage] || "border-white/20 text-white/35"}`}>
                                    {STAGE_LABELS[app.stage] || app.stage}
                                </span>
                            </div>
                            <Link
                                href={`/dashboard/candidates/${app.id}`}
                                className="text-[9px] font-black uppercase tracking-[0.2em] text-white/25 hover:text-white transition-colors"
                            >
                                Ver →
                            </Link>
                        </div>
                    </div>
                ))}

                {filtered.length === 0 && (
                    <div className="py-16 text-center border border-white/10">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/25">
                            No hay candidatos para esta vacante.
                        </p>
                    </div>
                )}
            </div>

            {/* ── Table (Desktop) ── */}
            <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-white/15">
                            {sortByScore && selectedJobId !== "all" && (
                                <th className="pb-3 text-left text-[9px] font-black uppercase tracking-[0.2em] text-white/35 pr-4 w-10">
                                    #
                                </th>
                            )}
                            <th className="pb-3 text-left text-[9px] font-black uppercase tracking-[0.2em] text-white/35 pr-6">
                                Candidato
                            </th>
                            {selectedJobId === "all" && (
                                <th className="pb-3 text-left text-[9px] font-black uppercase tracking-[0.2em] text-white/35 pr-6">
                                    Vacante
                                </th>
                            )}
                            <th className="pb-3 text-left text-[9px] font-black uppercase tracking-[0.2em] text-white/35 pr-6">
                                Estado
                            </th>
                            <th className="pb-3 text-left text-[9px] font-black uppercase tracking-[0.2em] text-white/35 pr-6">
                                Score
                            </th>
                            <th className="pb-3 text-right text-[9px] font-black uppercase tracking-[0.2em] text-white/35">
                                <span className="sr-only">Acciones</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.05]">
                        {filtered.map((app, i) => (
                            <tr
                                key={app.id}
                                className="hover:bg-white/[0.02] transition-colors group"
                            >
                                {sortByScore && selectedJobId !== "all" && (
                                    <td className="py-4 pr-4">
                                        <span
                                            className={`text-xs font-black tabular-nums ${i === 0 ? "" : "text-white/20"}`}
                                            style={i === 0 ? { color: "#FF3000" } : {}}
                                        >
                                            {i === 0 ? "◆" : `${i + 1}`}
                                        </span>
                                    </td>
                                )}
                                <td className="py-4 pr-6">
                                    <p className="text-sm font-bold text-white">{app.candidate?.name}</p>
                                    <p className="text-[10px] text-white/35 mt-0.5 font-medium">{app.candidate?.email}</p>
                                </td>
                                {selectedJobId === "all" && (
                                    <td className="py-4 pr-6">
                                        <span className="text-xs text-white/50 font-medium">{app.job?.title}</span>
                                    </td>
                                )}
                                <td className="py-4 pr-6">
                                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border ${STAGE_COLOR[app.stage] || "border-white/20 text-white/35"}`}>
                                        {STAGE_LABELS[app.stage] || app.stage}
                                    </span>
                                </td>
                                <td className="py-4 pr-6">
                                    {app.score != null ? (
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-black tabular-nums" style={{ color: "#FF3000" }}>
                                                {app.score}/100
                                            </span>
                                            <div className="hidden lg:block w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full"
                                                    style={{
                                                        width: `${app.score}%`,
                                                        backgroundColor: app.score >= 75 ? "#22c55e" : app.score >= 50 ? "#eab308" : "#FF3000",
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-white/25 font-medium">—</span>
                                    )}
                                </td>
                                <td className="py-4 text-right">
                                    <Link
                                        href={`/dashboard/candidates/${app.id}`}
                                        className="text-[9px] font-black uppercase tracking-[0.2em] text-white/25 hover:text-white transition-colors"
                                    >
                                        Ver →
                                    </Link>
                                </td>
                            </tr>
                        ))}

                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={6} className="py-16 text-center">
                                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/25">
                                        No hay candidatos para esta vacante.
                                    </p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}