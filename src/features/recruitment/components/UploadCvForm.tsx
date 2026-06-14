"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";

interface UploadCvFormProps {
    jobId: string; // ID de la vacante a la que aplica
}

export default function UploadCvForm({ jobId }: UploadCvFormProps) {
    const [file, setFile] = useState<File | null>(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [isDragActive, setIsDragActive] = useState(false);

    // Manejo de estados de la UI
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragActive(true);
        } else if (e.type === "dragleave") {
            setIsDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.type === "application/pdf") {
                setFile(droppedFile);
            } else {
                toast.error("Solo se aceptan archivos PDF.");
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Guardaespaldas: Detener si no hay jobId
        if (!jobId) {
            toast.error("Error: No se ha detectado la vacante (jobId es nulo).");
            return;
        }

        if (!file || !name || !email) return;

        setStatus("loading");
        setErrorMessage("");
        toast.loading("Enviando tu postulación...", { id: "upload-cv" });

        try {
            // 1. Generar un nombre único para evitar colisiones en Storage
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

            // 2. Subir el archivo al bucket "cv-uploads"
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from("cv-uploads")
                .upload(`public/${fileName}`, file, {
                    cacheControl: "3600",
                    upsert: false,
                });

            if (uploadError) {
                throw new Error(uploadError.message);
            }

            // 3. Obtener la URL pública del archivo
            const { data: { publicUrl } } = supabase.storage
                .from("cv-uploads")
                .getPublicUrl(`public/${fileName}`);

            // REEMPLAZA DESDE AQUÍ -----------------------------------------------------

            // 4. Buscar o crear el candidato (Find or Create)
            let candidateId;
            const { data: existingCandidate } = await supabase
                .from('candidates')
                .select('id')
                .eq('email', email)
                .maybeSingle();

            if (existingCandidate) {
                // Si el candidato ya existe, tomamos su ID y le actualizamos el CV
                candidateId = existingCandidate.id;

                const { error: updateError } = await supabase
                    .from('candidates')
                    .update({ name, cv_pdf_url: publicUrl })
                    .eq('id', candidateId);

                if (updateError) throw new Error("Error al actualizar el candidato existente.");
            } else {
                // Si es nuevo, lo insertamos
                const { data: newCandidate, error: candidateError } = await supabase
                    .from('candidates')
                    .insert([{ name, email, cv_pdf_url: publicUrl }])
                    .select()
                    .single();

                if (candidateError) throw new Error("Error al crear el nuevo candidato.");
                candidateId = newCandidate.id;
            }

            // 5. Vincular el candidato a la vacante (Postulación)
            // Nota: Ahora usamos "candidateId" que obtuvimos arriba
            const { error: applicationError } = await supabase
                .from("applications")
                .insert([{
                    job_id: jobId,
                    candidate_id: candidateId,
                    stage: "cv_received"
                }]);

            if (applicationError) {
                // Manejo de error si ya aplicó a ESTA vacante en específico
                if (applicationError.code === '23505') {
                    throw new Error("Ya te has postulado a esta vacante anteriormente.");
                }
                throw new Error(`Error en aplicaciones: ${applicationError.message}`);
            }

            // HASTA AQUÍ ---------------------------------------------------------------

            // Todo salió bien
            setStatus("success");
            toast.success("¡Postulación exitosa! Hemos recibido tu CV.", { id: "upload-cv" });

        } catch (error: any) {
            setStatus("error");
            const msg = error.message || "Ocurrió un error inesperado.";
            setErrorMessage(msg);
            toast.error(msg, { id: "upload-cv" });
        }
    };

    if (status === "success") {
        return (
            <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md text-center space-y-4 shadow-xl">
                <div className="text-4xl text-emerald-400">🎉</div>
                <h3 className="font-bold text-xl text-white">¡Postulación exitosa!</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                    Hemos recibido tus datos y tu CV. El equipo de reclutamiento revisará tu perfil y se comunicará contigo a la brevedad.
                </p>
                <div className="pt-4">
                    <Link 
                        href="/" 
                        className="inline-flex px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-lg text-sm font-semibold transition-colors"
                    >
                        Volver al inicio
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5 w-full max-w-md bg-zinc-900 p-8 rounded-2xl border border-zinc-805 shadow-2xl transition-all duration-300 hover:border-zinc-800">
            <div className="space-y-1">
                <h2 className="text-xl font-bold text-white">Completa tu postulación</h2>
                <p className="text-xs text-zinc-400">Por favor, rellena tus datos para vincular tu CV.</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Nombre completo</label>
                    <input
                        id="name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-3 rounded-lg border border-zinc-800 bg-zinc-800/50 text-white placeholder-zinc-500 shadow-inner focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all duration-200"
                        placeholder="Ej: Ana Pérez"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Correo electrónico</label>
                    <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 rounded-lg border border-zinc-800 bg-zinc-800/50 text-white placeholder-zinc-500 shadow-inner focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all duration-200"
                        placeholder="ana@ejemplo.com"
                    />
                </div>

                <div>
                    <label htmlFor="cv" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Curriculum (PDF)</label>
                    <div 
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        className={`mt-1 relative border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center transition-all duration-200 ${
                            isDragActive 
                                ? "border-blue-500 bg-blue-500/10 text-blue-400" 
                                : file 
                                    ? "border-emerald-500 bg-emerald-500/5 text-emerald-450" 
                                    : "border-zinc-800 bg-zinc-900/30 hover:border-zinc-750 text-zinc-400"
                        }`}
                    >
                        <input
                            id="cv"
                            type="file"
                            accept="application/pdf"
                            required
                            onChange={(e) => {
                                const selectedFile = e.target.files?.[0] || null;
                                if (selectedFile && selectedFile.type !== "application/pdf") {
                                    toast.error("Solo se aceptan archivos PDF.");
                                    setFile(null);
                                } else {
                                    setFile(selectedFile);
                                }
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        
                        {file ? (
                            <div className="text-center space-y-2">
                                <div className="text-3xl text-emerald-400">📄</div>
                                <p className="text-sm font-semibold text-zinc-200">{file.name}</p>
                                <p className="text-xs text-zinc-500">{(file.size / (1024 * 1024)).toFixed(2)} MB • Arrastra otro PDF para cambiarlo</p>
                            </div>
                        ) : (
                            <div className="text-center space-y-2">
                                <div className="text-3xl text-zinc-650 group-hover:text-blue-500 transition-colors">📤</div>
                                <p className="text-sm font-medium text-zinc-300">Arrastra tu CV aquí o haz clic para subir</p>
                                <p className="text-xs text-zinc-500">Solo archivos PDF (Máx 10MB)</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {status === "error" && (
                <div className="text-red-400 text-sm bg-red-950/30 p-3 rounded-md border border-red-900/50">
                    {errorMessage}
                </div>
            )}

            <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-blue-600 text-white p-3 rounded-lg font-medium hover:bg-blue-500 disabled:opacity-50 transition-all duration-200 shadow-lg shadow-blue-500/20 active:scale-[0.98] cursor-pointer"
            >
                {status === "loading" ? "Procesando..." : "Enviar Postulación"}
            </button>
        </form>
    );
}