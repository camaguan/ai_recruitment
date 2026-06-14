import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const STAGE_LABELS: Record<string, string> = {
    cv_received:  "Recibido",
    ai_parsing:   "Procesando",
    human_review: "Revisión",
    interview:    "Entrevista",
    rejected:     "Descartado",
    hired:        "Contratado",
};

const STAGE_COLOR: Record<string, string> = {
    cv_received:  "border-white/20 text-white/40",
    ai_parsing:   "border-blue-400/50 text-blue-400",
    human_review: "border-yellow-400/50 text-yellow-400",
    interview:    "border-green-400/50 text-green-400",
    rejected:     "border-red-500/50 text-red-400",
    hired:        "border-emerald-400/50 text-emerald-400",
};

export default async function DashboardOverview() {
    const { count: totalJobs } = await supabase
        .from("jobs")
        .select("*", { count: "exact", head: true });

    const { count: totalCandidates } = await supabase
        .from("candidates")
        .select("*", { count: "exact", head: true });

    const { data: scoredApps } = await supabase
        .from("applications")
        .select("score")
        .not("score", "is", null);

    const avgScore =
        scoredApps && scoredApps.length > 0
            ? Math.round(
                scoredApps.reduce((acc, app) => acc + (app.score || 0), 0) / scoredApps.length
            )
            : null;

    const { data: recentApplications } = await supabase
        .from("applications")
        .select(`
            id, stage, score, created_at,
            candidate:candidates(name, email),
            job:jobs(title)
        `)
        .order("created_at", { ascending: false })
        .limit(5);

    return (
        <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-12">

            {/* ── Header ── */}
            <div className="border-b border-white/10 pb-6">
                <span
                    className="text-[9px] font-black uppercase tracking-[0.25em] block mb-2"
                    style={{ color: "#FF3000" }}
                >
                    01. Resumen
                </span>
                <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-white leading-none">
                    Panel de Reclutamiento
                </h1>
            </div>

            {/* ── Stats grid ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 border-l border-t border-white/10">
                {[
                    { label: "Vacantes Publicadas", value: totalJobs ?? 0,  suffix: "" },
                    { label: "Total Candidatos",    value: totalCandidates ?? 0, suffix: "" },
                    { label: "Match Promedio",      value: avgScore ?? "—", suffix: avgScore != null ? "/100" : "" },
                ].map((stat) => (
                    <div
                        key={stat.label}
                        className="border-r border-b border-white/10 p-6 sm:p-8 hover:bg-white/[0.025] transition-colors group"
                    >
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/35 mb-4">
                            {stat.label}
                        </p>
                        <div className="flex items-end gap-1.5">
                            <span className="text-6xl font-black text-white leading-none tabular-nums">
                                {stat.value}
                            </span>
                            {stat.suffix && (
                                <span className="text-xl font-black text-white/25 pb-1">{stat.suffix}</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Recent applications ── */}
            <div>
                <div className="flex items-end justify-between border-b border-white/10 pb-4 mb-0">
                    <div>
                        <span
                            className="text-[9px] font-black uppercase tracking-[0.25em] block mb-1"
                            style={{ color: "#FF3000" }}
                        >
                            02. Recientes
                        </span>
                        <h2 className="text-xl font-black uppercase tracking-tight text-white leading-none">
                            Postulaciones Recientes
                        </h2>
                    </div>
                    <Link
                        href="/dashboard/candidates"
                        className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 hover:text-[#FF3000] transition-colors duration-150"
                    >
                        Ver todos →
                    </Link>
                </div>

                {recentApplications && recentApplications.length > 0 ? (
                    <div className="divide-y divide-white/[0.06]">
                        {recentApplications.map((app: any) => (
                            <div
                                key={app.id}
                                className="flex flex-col md:flex-row md:items-center justify-between py-5 gap-4 hover:bg-white/[0.02] transition-colors"
                            >
                                <div>
                                    <p className="text-sm font-bold text-white">{app.candidate.name}</p>
                                    <p className="text-[10px] text-white/35 mt-0.5 font-medium">{app.candidate.email}</p>
                                </div>
                                <div className="flex flex-wrap items-center gap-4">
                                    <span className="text-[10px] font-bold text-white/45 uppercase tracking-wider">
                                        {app.job.title}
                                    </span>
                                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border ${STAGE_COLOR[app.stage] || "border-white/20 text-white/35"}`}>
                                        {STAGE_LABELS[app.stage] || app.stage}
                                    </span>
                                    {app.score != null ? (
                                        <span
                                            className="text-sm font-black tabular-nums"
                                            style={{ color: "#FF3000" }}
                                        >
                                            {app.score}/100
                                        </span>
                                    ) : (
                                        <span className="text-xs text-white/25 font-medium">—</span>
                                    )}
                                    <Link
                                        href={`/dashboard/candidates/${app.id}`}
                                        className="text-[9px] font-black uppercase tracking-[0.2em] text-white/25 hover:text-white transition-colors"
                                    >
                                        Ver →
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-16 text-center border border-white/10 mt-0 swiss-dots-dark">
                        <p className="text-[9px] text-white/25 font-black uppercase tracking-[0.2em]">
                            No hay postulaciones registradas aún.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
