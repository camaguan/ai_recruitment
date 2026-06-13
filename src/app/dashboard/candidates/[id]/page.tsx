import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import CandidateActions from "./CandidateActions";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function CandidateDetail({ params }: { params: { id: string } }) {
    // Fetch del candidato, la vacante y la evaluación de IA más reciente
    const { data: app, error } = await supabase
        .from("applications")
        .select(`
      id, stage, score, created_at,
      candidate:candidates(name, email, cv_pdf_url),
      job:jobs(title),
      evaluations:ai_evaluations(json_result)
    `)
        .eq("id", params.id)
        .single();

    if (error || !app) {
        return <div className="p-8 text-red-600">Error cargando el perfil.</div>;
    }

    // Extraemos el JSON de la IA (tomamos la primera evaluación si existe)
    const aiData = app.evaluations?.[0]?.json_result;

    // Resolve many-to-one relations which are returned as objects at runtime but inferred as arrays by TypeScript
    const candidate = (Array.isArray(app.candidate) ? app.candidate[0] : app.candidate) as any;
    const job = (Array.isArray(app.job) ? app.job[0] : app.job) as any;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            {/* Cabecera */}
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-gray-900">{candidate?.name}</h1>
                        <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium border">
                            Etapa actual: {app.stage}
                        </span>
                    </div>
                    <p className="text-gray-500 mt-1">
                        Postulante para <span className="font-semibold">{job?.title}</span> • {candidate?.email}
                    </p>
                </div>

                {/* Componente Cliente para los botones de acción */}
                <CandidateActions applicationId={app.id} currentStage={app.stage} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Columna Izquierda: Análisis de IA */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Análisis de IA</h2>
                            {app.score && (
                                <div className="text-center">
                                    <span className="block text-3xl font-bold text-blue-600">{app.score}</span>
                                    <span className="text-xs text-gray-500 uppercase">Match Score</span>
                                </div>
                            )}
                        </div>

                        {aiData ? (
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-400 uppercase">Resumen Profesional</h3>
                                    <p className="mt-1 text-gray-700">{aiData.summary}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-gray-50 rounded-lg border">
                                        <h3 className="text-sm font-semibold text-gray-500">Clasificación / Seniority</h3>
                                        <p className="mt-1 font-medium">{aiData.classification}</p>
                                    </div>
                                    <div className={`p-4 rounded-lg border ${aiData.riskLevel === 'High' ? 'bg-red-50 border-red-200 text-red-800' :
                                            aiData.riskLevel === 'Medium' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
                                                'bg-green-50 border-green-200 text-green-800'
                                        }`}>
                                        <h3 className="text-sm font-semibold opacity-80">Nivel de Riesgo</h3>
                                        <p className="mt-1 font-bold">{aiData.riskLevel}</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-gray-400 uppercase">Sugerencias de IA</h3>
                                    <ul className="mt-2 list-disc list-inside text-gray-700 space-y-1">
                                        {aiData.suggestions?.map((sug: string, i: number) => (
                                            <li key={i}>{sug}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <div className="py-8 text-center text-gray-500">
                                La IA aún está analizando este perfil o no se encontraron datos.
                            </div>
                        )}
                    </div>
                </div>

                {/* Columna Derecha: CV Original */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
                    <h2 className="text-xl font-semibold mb-4">CV Original</h2>
                    {candidate?.cv_pdf_url ? (
                        <iframe
                            src={`${candidate.cv_pdf_url}#view=FitH`}
                            className="w-full flex-1 min-h-[500px] border rounded-lg"
                            title="CV PDF"
                        />
                    ) : (
                        <p className="text-gray-500 italic">No se adjuntó PDF.</p>
                    )}
                </div>
            </div>
        </div>
    );
}