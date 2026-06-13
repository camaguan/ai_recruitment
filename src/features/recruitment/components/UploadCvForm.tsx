"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

interface UploadCvFormProps {
    jobId: string; // ID de la vacante a la que aplica
}

export default function UploadCvForm({ jobId }: UploadCvFormProps) {
    const [file, setFile] = useState<File | null>(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    // Manejo de estados de la UI
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // AÑADE ESTO para ver qué está pasando
        console.log("DEBUG - Valores antes del insert:");
        console.log("jobId:", jobId);
        console.log("file:", file);
        console.log("name:", name);
        console.log("email:", email);

        // Guardaespaldas: Detener si no hay jobId
        if (!jobId) {
            alert("Error: No se ha detectado la vacante (jobId es nulo).");
            return;
        }

        if (!file || !name || !email) return;

        setStatus("loading");
        setErrorMessage("");

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
                console.error("Error completo de Supabase:", uploadError);
                throw new Error(uploadError.message);
            }

            // 3. Obtener la URL pública del archivo
            const { data: { publicUrl } } = supabase.storage
                .from("cv-uploads")
                .getPublicUrl(`public/${fileName}`);

            // 4. Crear el candidato en la base de datos
            const { data: candidateData, error: candidateError } = await supabase
                .from("candidates")
                .insert([{ name, email, cv_pdf_url: publicUrl }])
                .select("id")
                .single();

            if (candidateError) {
                // Manejo básico si el email ya existe (violación de UNIQUE)
                if (candidateError.code === '23505') {
                    throw new Error("Este correo ya está registrado.");
                }
                throw new Error("Error al registrar los datos del candidato.");
            }

            // 5. Vincular el candidato a la vacante (Postulación)
            const { error: applicationError } = await supabase
                .from("applications")
                .insert([{
                    job_id: jobId,
                    candidate_id: candidateData.id,
                    stage: "cv_received"
                }]);

            if (applicationError) {
                console.error("Error técnico de Supabase en aplicaciones:", applicationError);
                throw new Error(`Error en aplicaciones: ${applicationError.message}`);
            }

            // Todo salió bien
            setStatus("success");

        } catch (error: any) {
            console.error(error);
            setStatus("error");
            setErrorMessage(error.message || "Ocurrió un error inesperado.");
        }
    };

    if (status === "success") {
        return (
            <div className="p-6 bg-green-950/30 text-green-300 rounded-lg border border-green-900/50 transition-colors">
                <h3 className="font-semibold text-lg">¡Postulación exitosa!</h3>
                <p className="mt-2 text-sm text-green-400/90">Hemos recibido tu CV. Te notificaremos por correo los siguientes pasos.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5 w-full max-w-md bg-zinc-900 p-6 rounded-xl border border-zinc-800 shadow-xl transition-colors">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-zinc-300">Nombre completo</label>
                <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-zinc-700 bg-zinc-800 text-zinc-100 placeholder-zinc-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border focus:outline-none"
                    placeholder="Ej: Ana Pérez"
                />
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-zinc-300">Correo electrónico</label>
                <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full rounded-md border-zinc-700 bg-zinc-800 text-zinc-100 placeholder-zinc-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border focus:outline-none"
                    placeholder="ana@ejemplo.com"
                />
            </div>

            <div>
                <label htmlFor="cv" className="block text-sm font-medium text-zinc-300">Curriculum (PDF)</label>
                <input
                    id="cv"
                    type="file"
                    accept="application/pdf"
                    required
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="mt-1 block w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-900/30 file:text-blue-400 hover:file:bg-blue-900/50 cursor-pointer focus:outline-none"
                />
            </div>

            {status === "error" && (
                <div className="text-red-400 text-sm bg-red-950/30 p-3 rounded-md border border-red-900/50">
                    {errorMessage}
                </div>
            )}

            <button
                type="submit"
                disabled={status === "loading"}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {status === "loading" ? "Procesando..." : "Enviar Postulación"}
            </button>
        </form>
    );
}