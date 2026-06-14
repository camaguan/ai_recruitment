"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";

interface UploadCvFormProps {
    jobId: string;
}

export default function UploadCvForm({ jobId }: UploadCvFormProps) {
    const [file, setFile] = useState<File | null>(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [isDragActive, setIsDragActive] = useState(false);
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") setIsDragActive(true);
        else if (e.type === "dragleave") setIsDragActive(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
        const dropped = e.dataTransfer.files?.[0];
        if (dropped?.type === "application/pdf") setFile(dropped);
        else toast.error("Solo se aceptan archivos PDF.");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!jobId) { toast.error("Error: No se detectó la vacante."); return; }
        if (!file || !name || !email) return;

        setStatus("loading");
        setErrorMessage("");
        toast.loading("Enviando tu postulación...", { id: "upload-cv" });

        try {
            const fileExt = file.name.split(".").pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from("cv-uploads")
                .upload(`public/${fileName}`, file, { cacheControl: "3600", upsert: false });
            if (uploadError) throw new Error(uploadError.message);

            const { data: { publicUrl } } = supabase.storage
                .from("cv-uploads")
                .getPublicUrl(`public/${fileName}`);

            let candidateId: string;
            const { data: existingCandidate } = await supabase
                .from("candidates")
                .select("id")
                .eq("email", email)
                .maybeSingle();

            if (existingCandidate) {
                candidateId = existingCandidate.id;
                const { error: updateError } = await supabase
                    .from("candidates")
                    .update({ name, cv_pdf_url: publicUrl })
                    .eq("id", candidateId);
                if (updateError) throw new Error("Error al actualizar el candidato existente.");
            } else {
                const { data: newCandidate, error: candidateError } = await supabase
                    .from("candidates")
                    .insert([{ name, email, cv_pdf_url: publicUrl }])
                    .select()
                    .single();
                if (candidateError) throw new Error("Error al crear el nuevo candidato.");
                candidateId = newCandidate.id;
            }

            const { error: applicationError } = await supabase
                .from("applications")
                .insert([{ job_id: jobId, candidate_id: candidateId, stage: "cv_received" }]);

            if (applicationError) {
                if (applicationError.code === "23505") throw new Error("Ya te has postulado a esta vacante anteriormente.");
                throw new Error(`Error en aplicaciones: ${applicationError.message}`);
            }

            setStatus("success");
            toast.success("¡Postulación exitosa! Hemos recibido tu CV.", { id: "upload-cv" });
        } catch (error: any) {
            setStatus("error");
            const msg = error.message || "Ocurrió un error inesperado.";
            setErrorMessage(msg);
            toast.error(msg, { id: "upload-cv" });
        }
    };

    /* ── Success state ── */
    if (status === "success") {
        return (
            <div className="border-2 border-black p-10 space-y-6 max-w-md w-full">
                <div className="border-l-4 pl-4" style={{ borderColor: "#FF3000" }}>
                    <p
                        className="text-[9px] font-black uppercase tracking-[0.2em]"
                        style={{ color: "#FF3000" }}
                    >
                        Postulación Recibida
                    </p>
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tighter text-black leading-none">
                    ¡Todo en Orden!
                </h3>
                <p className="text-sm text-black/55 leading-relaxed font-medium">
                    Hemos recibido tus datos y tu CV. El equipo de reclutamiento revisará tu perfil y se comunicará contigo a la brevedad.
                </p>
                <div className="border-t-2 border-black pt-6">
                    <Link
                        href="/"
                        className="inline-flex px-6 py-3 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#FF3000] transition-colors duration-150"
                    >
                        Volver al inicio
                    </Link>
                </div>
            </div>
        );
    }

    /* ── Form ── */
    return (
        <form onSubmit={handleSubmit} className="space-y-8 w-full max-w-md">
            <div>
                <p
                    className="text-[9px] font-black uppercase tracking-[0.2em] mb-4"
                    style={{ color: "#FF3000" }}
                >
                    Completa tu Postulación
                </p>
                <h2 className="text-2xl font-black uppercase tracking-tighter text-black leading-none">
                    Tus Datos
                </h2>
            </div>

            {/* Fields */}
            <div className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-[9px] font-black uppercase tracking-[0.2em] text-black mb-2">
                        Nombre Completo
                    </label>
                    <input
                        id="name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ana Pérez"
                        className="w-full border-b-2 border-black bg-transparent py-3 text-sm text-black placeholder-black/25 focus:outline-none focus:border-[#FF3000] transition-colors duration-150"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-[9px] font-black uppercase tracking-[0.2em] text-black mb-2">
                        Correo Electrónico
                    </label>
                    <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ana@ejemplo.com"
                        className="w-full border-b-2 border-black bg-transparent py-3 text-sm text-black placeholder-black/25 focus:outline-none focus:border-[#FF3000] transition-colors duration-150"
                    />
                </div>

                {/* Drop zone */}
                <div>
                    <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-black mb-2">
                        Curriculum Vitae (PDF)
                    </label>
                    <div
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        className={`relative border-2 border-dashed p-8 flex flex-col items-center justify-center transition-colors duration-150 ${
                            isDragActive
                                ? "border-[#FF3000] bg-red-50"
                                : file
                                    ? "border-black bg-[#F2F2F2]"
                                    : "border-black/30 hover:border-black bg-[#F2F2F2]"
                        }`}
                    >
                        <input
                            id="cv"
                            type="file"
                            accept="application/pdf"
                            required
                            onChange={(e) => {
                                const selected = e.target.files?.[0] || null;
                                if (selected && selected.type !== "application/pdf") {
                                    toast.error("Solo se aceptan archivos PDF.");
                                    setFile(null);
                                } else {
                                    setFile(selected);
                                }
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        {file ? (
                            <div className="text-center space-y-1.5">
                                <p className="text-xs font-black uppercase tracking-wider text-black">
                                    {file.name}
                                </p>
                                <p className="text-[9px] text-black/40 font-medium uppercase tracking-wider">
                                    {(file.size / (1024 * 1024)).toFixed(2)} MB — Arrastra otro PDF para cambiar
                                </p>
                            </div>
                        ) : (
                            <div className="text-center space-y-2">
                                <p className="text-xs font-black uppercase tracking-wider text-black/50">
                                    Arrastra tu CV aquí
                                </p>
                                <p className="text-[9px] text-black/30 uppercase tracking-wider font-medium">
                                    o haz clic para seleccionar — Solo PDF, máx 10 MB
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Inline error */}
            {status === "error" && (
                <div className="border-l-4 pl-4 py-2" style={{ borderColor: "#FF3000" }}>
                    <p className="text-xs font-medium text-black">{errorMessage}</p>
                </div>
            )}

            <button
                type="submit"
                id="submit-application"
                disabled={status === "loading"}
                className="w-full py-4 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#FF3000] disabled:opacity-50 transition-colors duration-150"
            >
                {status === "loading" ? (
                    <span className="flex items-center justify-center gap-3">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Procesando...
                    </span>
                ) : "Enviar Postulación"}
            </button>
        </form>
    );
}