import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import CandidateActions from "./CandidateActions";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const STAGE_LABELS: Record<string, string> = {
    cv_received:  "Recibido",
    ai_parsing:   "Procesando",
    human_review: "En Revisión",
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

export default async function CandidateDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const { data: app, error } = await supabase
        .from("applications")
        .select(`
            id, stage, score, created_at,
            candidate:candidates(name, email, cv_pdf_url),
            job:jobs(title),
            evaluations:ai_evaluations(json_result)
        `)
        .eq("id", id)
        .single();

    if (error || !app) {
        return (
            <div className="p-8">
                <p className="text-xs font-black uppercase tracking-widest" style={{ color: "#FF3000" }}>
                    Error cargando el perfil.
                </p>
            </div>
        );
    }

    const aiData    = app.evaluations?.[0]?.json_result;
    const candidate = (Array.isArray(app.candidate) ? app.candidate[0] : app.candidate) as any;
    const job       = (Array.isArray(app.job) ? app.job[0] : app.job) as any;

    return (
        <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-10">

            {/* ── Header ── */}
            <div className="border-b border-white/10 pb-6">
                <Link
                    href="/dashboard/candidates"
                    className="text-[9px] font-black uppercase tracking-[0.2em] text-white/25 hover:text-white transition-colors mb-4 block"
                >
                    ← Volver a Candidatos
                </Link>

                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                    <div>
                        <span
                            className="text-[9px] font-black uppercase tracking-[0.25em] block mb-3"
                            style={{ color: "#FF3000" }}
                        >
                            Perfil de Candidato
                        </span>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter text-white leading-none">
                            {candidate?.name}
                        </h1>
                        <div className="flex flex-wrap items-center gap-3 mt-4">
                            <span className="text-xs text-white/40 font-medium">{candidate?.email}</span>
                            <span className="text-white/20">·</span>
                            <span className="text-xs font-bold text-white/50 uppercase tracking-wider">{job?.title}</span>
                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border ${STAGE_COLOR[app.stage] || "border-white/20 text-white/35"}`}>
                                {STAGE_LABELS[app.stage] || app.stage}
                            </span>
                        </div>
                    </div>

                    {/* Score */}
                    {app.score != null && (
                        <div className="border border-white/15 px-6 py-4 sm:px-8 sm:py-5 text-center shrink-0 self-start">
                            <span
                                className="block text-4xl sm:text-5xl font-black tabular-nums leading-none"
                                style={{ color: "#FF3000" }}
                            >
                                {app.score}
                            </span>
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 block mt-2">
                                /100 Score
                            </span>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="mt-6">
                    <CandidateActions applicationId={app.id} currentStage={app.stage} />
                </div>
            </div>

            {/* ── Content grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* ── Analysis ── */}
                <div className="lg:col-span-2 space-y-0">
                    <div className="border border-white/10">
                        {/* Section label */}
                        <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">
                                Análisis del Perfil
                            </h2>
                        </div>

                        {aiData ? (
                            <div className="divide-y divide-white/[0.06]">
                                {/* Summary */}
                                <div className="px-6 py-5">
                                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">
                                        Resumen Profesional
                                    </p>
                                    <p className="text-sm text-white/70 leading-relaxed font-medium">{aiData.summary}</p>
                                </div>

                                {/* Classification + Risk */}
                                <div className="grid grid-cols-2 divide-x divide-white/[0.06]">
                                    <div className="px-6 py-5">
                                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">
                                            Clasificación / Seniority
                                        </p>
                                        <p className="text-sm font-black text-white uppercase tracking-tight">
                                            {aiData.classification}
                                        </p>
                                    </div>
                                    <div className="px-6 py-5">
                                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">
                                            Nivel de Riesgo
                                        </p>
                                        <p className={`text-sm font-black uppercase tracking-tight ${
                                            aiData.riskLevel === "High"   ? "text-red-400"    :
                                            aiData.riskLevel === "Medium" ? "text-yellow-400" :
                                            "text-green-400"
                                        }`}>
                                            {aiData.riskLevel}
                                        </p>
                                    </div>
                                </div>

                                {/* Suggestions */}
                                {aiData.suggestions?.length > 0 && (
                                    <div className="px-6 py-5">
                                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 mb-3">
                                            Observaciones
                                        </p>
                                        <ul className="space-y-2">
                                            {aiData.suggestions.map((sug: string, i: number) => (
                                                <li key={i} className="flex items-start gap-3 text-sm text-white/60 font-medium">
                                                    <span className="shrink-0 text-[9px] font-black pt-0.5" style={{ color: "#FF3000" }}>
                                                        {String(i + 1).padStart(2, "0")}.
                                                    </span>
                                                    {sug}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="px-6 py-16 text-center swiss-dots-dark">
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/25">
                                    Análisis pendiente o no disponible.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── CV PDF ── */}
                <div className="border border-white/10 flex flex-col">
                    <div className="border-b border-white/10 px-6 py-4">
                        <h2 className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">
                            CV Original
                        </h2>
                    </div>
                    <div className="flex-1 p-0">
                        {candidate?.cv_pdf_url ? (
                            <iframe
                                src={`${candidate.cv_pdf_url}#view=FitH`}
                                className="w-full min-h-[500px] h-full bg-[#111]"
                                title="CV PDF"
                            />
                        ) : (
                            <div className="p-6 text-center py-12">
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/25">
                                    No se adjuntó PDF.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}