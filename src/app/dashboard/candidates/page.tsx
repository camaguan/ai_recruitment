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

export default async function CandidatesDashboard() {
    const { data: applications, error } = await supabase
        .from("applications")
        .select(`
            id, stage, score, created_at,
            candidate:candidates(name, email),
            job:jobs(title)
        `)
        .order("created_at", { ascending: false });

    if (error) {
        return (
            <div className="p-8">
                <p className="text-xs font-black uppercase tracking-widest" style={{ color: "#FF3000" }}>
                    Error cargando candidatos: {error.message}
                </p>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">

            {/* ── Header ── */}
            <div className="border-b border-white/10 pb-6 mb-10">
                <span
                    className="text-[9px] font-black uppercase tracking-[0.25em] block mb-2"
                    style={{ color: "#FF3000" }}
                >
                    01. Pipeline
                </span>
                <div className="flex items-end justify-between">
                    <h1 className="text-4xl font-black uppercase tracking-tighter text-white leading-none">
                        Candidatos
                    </h1>
                    {applications && (
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/25">
                            {applications.length} postulacion{applications.length !== 1 ? "es" : ""}
                        </span>
                    )}
                </div>
            </div>

            {/* ── Table ── */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-white/15">
                            <th className="pb-3 text-left text-[9px] font-black uppercase tracking-[0.2em] text-white/35 pr-6">
                                Candidato
                            </th>
                            <th className="pb-3 text-left text-[9px] font-black uppercase tracking-[0.2em] text-white/35 pr-6">
                                Vacante
                            </th>
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
                        {applications?.map((app: any) => (
                            <tr
                                key={app.id}
                                className="hover:bg-white/[0.02] transition-colors group"
                            >
                                <td className="py-4 pr-6">
                                    <p className="text-sm font-bold text-white">{app.candidate.name}</p>
                                    <p className="text-[10px] text-white/35 mt-0.5 font-medium">{app.candidate.email}</p>
                                </td>
                                <td className="py-4 pr-6">
                                    <span className="text-xs text-white/50 font-medium">{app.job.title}</span>
                                </td>
                                <td className="py-4 pr-6">
                                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border ${STAGE_COLOR[app.stage] || "border-white/20 text-white/35"}`}>
                                        {STAGE_LABELS[app.stage] || app.stage}
                                    </span>
                                </td>
                                <td className="py-4 pr-6">
                                    {app.score != null ? (
                                        <span className="text-sm font-black tabular-nums" style={{ color: "#FF3000" }}>
                                            {app.score}/100
                                        </span>
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

                        {(!applications || applications.length === 0) && (
                            <tr>
                                <td colSpan={5} className="py-16 text-center">
                                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/25">
                                        No hay candidatos postulados aún.
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