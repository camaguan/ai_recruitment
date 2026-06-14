
import Link from "next/link";
import UploadCvForm from "@/features/recruitment/components/UploadCvForm";
import { supabase } from "@/lib/supabase/client";
import Logo from "@/components/ui/Logo";

export default async function ApplyPage({ params }: { params: Promise<{ jobId: string }> }) {
    const resolvedParams = await params;
    const { jobId } = resolvedParams;

    // Fetch vacancy details on server
    const { data: job } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", jobId)
        .single();

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans select-none">
            {/* Header */}
            <header className="border-b border-zinc-900 bg-zinc-950 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href="/">
                        <Logo iconSize={28} textSize="text-xl" />
                    </Link>
                    <Link 
                        href="/" 
                        className="text-xs text-zinc-400 hover:text-white transition-colors"
                    >
                        ← Volver a Inicio
                    </Link>
                </div>
            </header>

            {/* Split Layout Container */}
            <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 flex flex-col lg:flex-row gap-12 items-start justify-center">
                {job ? (
                    <>
                        {/* Left Column: Job Details */}
                        <div className="w-full lg:w-1/2 space-y-6 lg:sticky lg:top-24">
                            <div className="space-y-4">
                                <span className="inline-block px-3 py-1 bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-semibold rounded-md uppercase tracking-wider">
                                    Vacante Disponible
                                </span>
                                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
                                    {job.title}
                                </h1>
                                <div className="flex items-center gap-3">
                                    <span className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-xs font-semibold rounded-md text-zinc-300">
                                        Nivel: {job.seniority_required}
                                    </span>
                                    <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold rounded-md text-emerald-400">
                                        Postulación Abierta
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Descripción del Puesto</h3>
                                <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line bg-zinc-900/20 p-5 rounded-xl border border-zinc-900">
                                    {job.description}
                                </p>
                            </div>

                            <div className="p-5 bg-zinc-900/40 rounded-xl border border-zinc-900 space-y-2">
                                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Proceso con IA</h4>
                                <p className="text-xs text-zinc-400 leading-relaxed">
                                    Al postularte, nuestro motor extraerá automáticamente tus capacidades. Un reclutador revisará el reporte generado en su panel operativo para agilizar el contacto contigo.
                                </p>
                            </div>
                        </div>

                        {/* Right Column: Form */}
                        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
                            <UploadCvForm jobId={jobId} />
                        </div>
                    </>
                ) : (
                    <div className="w-full text-center py-20 bg-zinc-900/20 rounded-2xl border border-zinc-900/80 p-8 space-y-4">
                        <p className="text-zinc-400 italic">No se pudo encontrar la vacante solicitada o ha sido cerrada.</p>
                        <Link 
                            href="/" 
                            className="inline-flex px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition-colors"
                        >
                            Ver otras vacantes
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
}