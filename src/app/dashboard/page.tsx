import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function DashboardOverview() {
    // 1. Fetch de estadísticas
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

    const avgScore = scoredApps && scoredApps.length > 0
        ? Math.round(scoredApps.reduce((acc, app) => acc + (app.score || 0), 0) / scoredApps.length)
        : 0;

    // 2. Fetch de postulaciones recientes
    const { data: recentApplications } = await supabase
        .from("applications")
        .select(`
            id,
            stage,
            score,
            created_at,
            candidate:candidates(name, email),
            job:jobs(title)
        `)
        .order("created_at", { ascending: false })
        .limit(5);

    const getStageBadge = (stage: string) => {
        const stages: Record<string, string> = {
            cv_received: "bg-zinc-800 text-zinc-300 border border-zinc-700",
            ai_parsing: "bg-blue-955/30 text-blue-300 animate-pulse border border-blue-900/30",
            human_review: "bg-yellow-955/30 text-yellow-300 border border-yellow-900/30",
            interview: "bg-green-955/30 text-green-300 border border-green-900/30",
            rejected: "bg-red-955/30 text-red-300 border border-red-900/30",
            hired: "bg-emerald-955/30 text-emerald-300 border border-emerald-900/30",
        };

        const labels: Record<string, string> = {
            cv_received: "Recibido",
            ai_parsing: "IA Analizando...",
            human_review: "Revisión Manual",
            interview: "Entrevista",
            rejected: "Descartado",
            hired: "Contratado",
        };

        return (
            <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${stages[stage] || "bg-zinc-805 text-zinc-300"}`}>
                {labels[stage] || stage}
            </span>
        );
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            {/* Cabecera */}
            <div>
                <h1 className="text-3xl font-bold text-zinc-50">Resumen de Reclutamiento</h1>
                <p className="text-zinc-400 mt-2">Bienvenido de nuevo al panel de administración de AIRecruit.</p>
            </div>

            {/* Tarjetas de estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl shadow-xl">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-zinc-400">Vacantes Publicadas</span>
                        <span className="text-2xl">🏢</span>
                    </div>
                    <div className="mt-4">
                        <span className="text-4xl font-bold text-zinc-50">{totalJobs || 0}</span>
                    </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl shadow-xl">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-zinc-400">Total Candidatos</span>
                        <span className="text-2xl">👥</span>
                    </div>
                    <div className="mt-4">
                        <span className="text-4xl font-bold text-zinc-50">{totalCandidates || 0}</span>
                    </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl shadow-xl">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-zinc-400 font-sans">Match Promedio (IA)</span>
                        <span className="text-2xl">🧠</span>
                    </div>
                    <div className="mt-4">
                        <span className="text-4xl font-bold text-blue-400">{avgScore}/100</span>
                    </div>
                </div>
            </div>

            {/* Listado de postulaciones recientes */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-zinc-55">Postulaciones Recientes</h2>
                    <Link href="/dashboard/candidates" className="text-sm font-semibold text-blue-400 hover:text-blue-300">
                        Ver todos los candidatos &rarr;
                    </Link>
                </div>

                <div className="space-y-4">
                    {recentApplications && recentApplications.length > 0 ? (
                        recentApplications.map((app: any) => (
                            <div key={app.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-zinc-950 border border-zinc-800/80 rounded-lg hover:border-zinc-700 transition-colors">
                                <div className="flex flex-col mb-2 md:mb-0">
                                    <span className="text-sm font-semibold text-zinc-100">{app.candidate.name}</span>
                                    <span className="text-xs text-zinc-400">{app.candidate.email}</span>
                                </div>
                                <div className="flex flex-wrap items-center gap-4">
                                    <span className="text-sm text-zinc-300 bg-zinc-900 px-3 py-1 rounded-md border border-zinc-800">
                                        {app.job.title}
                                    </span>
                                    {getStageBadge(app.stage)}
                                    {app.score !== null ? (
                                        <span className="text-sm font-bold text-blue-400">{app.score}/100</span>
                                    ) : (
                                        <span className="text-sm italic text-zinc-500">Pendiente</span>
                                    )}
                                    <Link href={`/dashboard/candidates/${app.id}`} className="text-sm text-zinc-400 hover:text-zinc-100 font-medium">
                                        Detalle
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center py-8 text-zinc-500">No hay postulaciones registradas aún.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
