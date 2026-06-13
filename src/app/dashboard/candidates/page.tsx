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
        cv_received: "bg-gray-100 text-gray-800",
        ai_parsing: "bg-blue-100 text-blue-800 animate-pulse",
        human_review: "bg-yellow-100 text-yellow-800",
        interview: "bg-green-100 text-green-800",
        rejected: "bg-red-100 text-red-800",
        hired: "bg-emerald-100 text-emerald-800",
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
        <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${stages[stage] || "bg-gray-100 text-gray-800"}`}>
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
        return <div className="p-6 text-red-600">Error cargando candidatos: {error.message}</div>;
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="sm:flex sm:items-center sm:justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Candidatos Postulados</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Lista en tiempo real de todos los perfiles recibidos y su estado en el proceso.
                    </p>
                </div>
            </div>

            <div className="bg-white shadow-sm ring-1 ring-gray-300 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidato</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vacante</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score IA</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Acciones</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {applications?.map((app: any) => (
                            <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-900">{app.candidate.name}</span>
                                        <span className="text-sm text-gray-500">{app.candidate.email}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {app.job.title}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {getStageBadge(app.stage)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {app.score !== null ? (
                                        <span className="font-semibold">{app.score}/100</span>
                                    ) : (
                                        <span className="text-gray-400 italic">Pendiente</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link
                                        href={`/dashboard/candidates/${app.id}`}
                                        className="text-blue-600 hover:text-blue-900"
                                    >
                                        Ver detalle
                                    </Link>
                                </td>
                            </tr>
                        ))}

                        {(!applications || applications.length === 0) && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
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