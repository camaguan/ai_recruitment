import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

// Idealmente, este cliente servidor debería estar en un archivo de utilidades
// usando @supabase/ssr, pero para este ejemplo usaremos el estándar.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Usar Service Role en el servidor
const supabase = createClient(supabaseUrl, supabaseKey);

// Utilidad para darle color a los badges según la etapa
const getStageBadge = (stage: string) => {
    const stages: Record<string, string> = {
        cv_received: "bg-zinc-800 text-zinc-300 border border-zinc-700",
        ai_parsing: "bg-blue-950/30 text-blue-300 animate-pulse border border-blue-900/30",
        human_review: "bg-yellow-950/30 text-yellow-300 border border-yellow-900/30",
        interview: "bg-green-950/30 text-green-300 border border-green-900/30",
        rejected: "bg-red-950/30 text-red-300 border border-red-900/30",
        hired: "bg-emerald-950/30 text-emerald-300 border border-emerald-900/30",
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
        <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${stages[stage] || "bg-zinc-800 text-zinc-300"}`}>
            {labels[stage] || stage}
        </span>
    );
};

export default async function CandidatesDashboard() {
    // Fetch a Supabase: Traemos la postulación + datos del candidato + título del trabajo
    const { data: applications, error } = await supabase
        .from("applications")
        .select(`
      id,
      stage,
      score,
      created_at,
      candidate:candidates(name, email),
      job:jobs(title)
    `)
        .order("created_at", { ascending: false });

    if (error) {
        return <div className="p-6 text-red-400">Error cargando candidatos: {error.message}</div>;
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="sm:flex sm:items-center sm:justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-50">Candidatos Postulados</h1>
                    <p className="mt-2 text-sm text-zinc-300">
                        Lista en tiempo real de todos los perfiles recibidos y su estado en el proceso.
                    </p>
                </div>
            </div>

            <div className="bg-zinc-900 shadow-xl ring-1 ring-zinc-800 rounded-lg overflow-hidden border border-zinc-800/80 transition-colors">
                <table className="min-w-full divide-y divide-zinc-800">
                    <thead className="bg-zinc-800/40">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Candidato</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Vacante</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Estado</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Score IA</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Acciones</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-zinc-900 divide-y divide-zinc-850">
                        {applications?.map((app: any) => (
                            <tr key={app.id} className="hover:bg-zinc-800/30 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-zinc-100">{app.candidate.name}</span>
                                        <span className="text-sm text-zinc-400">{app.candidate.email}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                                    {app.job.title}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {getStageBadge(app.stage)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                                    {app.score !== null ? (
                                        <span className="font-semibold">{app.score}/100</span>
                                    ) : (
                                        <span className="text-zinc-500 italic">Pendiente</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link
                                        href={`/dashboard/candidates/${app.id}`}
                                        className="text-blue-400 hover:text-blue-300"
                                    >
                                        Ver detalle
                                    </Link>
                                </td>
                            </tr>
                        ))}

                        {(!applications || applications.length === 0) && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-zinc-400">
                                    No hay candidatos postulados aún.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}