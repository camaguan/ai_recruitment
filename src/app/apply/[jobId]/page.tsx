
import Link from "next/link";
import UploadCvForm from "@/features/recruitment/components/UploadCvForm";
import { supabase } from "@/lib/supabase/client";
import Logo from "@/components/ui/Logo";

export default async function ApplyPage({ params }: { params: Promise<{ jobId: string }> }) {
    const { jobId } = await params;

    const { data: job } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", jobId)
        .single();

    return (
        <div className="min-h-screen bg-white text-black flex flex-col">

            {/* Header */}
            <header className="border-b-2 border-black px-6 py-4 bg-white">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href="/">
                        <Logo iconSize={28} textSize="text-xl" variant="light" />
                    </Link>
                    <Link
                        href="/"
                        className="text-[9px] font-black uppercase tracking-widest text-black/40 hover:text-black transition-colors"
                    >
                        ← Volver al inicio
                    </Link>
                </div>
            </header>

            <main className="flex-1 max-w-7xl mx-auto w-full">
                {job ? (
                    <div className="flex flex-col lg:flex-row min-h-full">

                        {/* ── Left: Job Details ── */}
                        <div className="w-full lg:w-[55%] border-b-2 lg:border-b-0 lg:border-r-2 border-black p-10 lg:p-16 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto space-y-10 swiss-grid-pattern bg-[#F2F2F2]">

                            {/* Section label */}
                            <div>
                                <span
                                    className="text-[9px] font-black uppercase tracking-[0.25em] block mb-4"
                                    style={{ color: "#FF3000" }}
                                >
                                    Postulación Activa
                                </span>
                                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-black leading-[0.9]">
                                    {job.title}
                                </h1>
                                <div className="flex items-center gap-3 mt-5">
                                    <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 border-2 border-black text-black">
                                        Nivel: {job.seniority_required}
                                    </span>
                                    <span
                                        className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 border-2 text-white"
                                        style={{ backgroundColor: "#FF3000", borderColor: "#FF3000" }}
                                    >
                                        Postulación Abierta
                                    </span>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="border-t-2 border-black" />

                            {/* Description */}
                            <div className="space-y-3">
                                <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-black/40">
                                    Descripción del Puesto
                                </h3>
                                <p className="text-sm text-black/70 leading-relaxed font-medium whitespace-pre-line">
                                    {job.description}
                                </p>
                            </div>

                            {/* Process note */}
                            <div className="border-l-4 border-black pl-5 space-y-1" style={{ borderColor: "#FF3000" }}>
                                <h4 className="text-[9px] font-black uppercase tracking-widest text-black">
                                    Sobre el Proceso
                                </h4>
                                <p className="text-xs text-black/50 leading-relaxed font-medium">
                                    Al postularte, tu CV se procesará para extraer tus capacidades. Un reclutador revisará el reporte generado para agilizar el contacto contigo.
                                </p>
                            </div>
                        </div>

                        {/* ── Right: Form ── */}
                        <div className="w-full lg:w-[45%] p-10 lg:p-16 flex flex-col justify-center bg-white">
                            <UploadCvForm jobId={jobId} />
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 px-6 space-y-8 swiss-dots bg-[#F2F2F2]">
                        <div className="border-2 border-black p-12 text-center max-w-md">
                            <span
                                className="text-[9px] font-black uppercase tracking-[0.2em] block mb-4"
                                style={{ color: "#FF3000" }}
                            >
                                Error — Vacante No Encontrada
                            </span>
                            <p className="text-sm text-black/50 font-medium mb-8">
                                La vacante solicitada no existe o ha sido cerrada.
                            </p>
                            <Link
                                href="/"
                                className="inline-flex px-8 py-3 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#FF3000] transition-colors duration-150"
                            >
                                Ver otras vacantes
                            </Link>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}