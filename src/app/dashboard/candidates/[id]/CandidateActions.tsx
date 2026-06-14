"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface CandidateActionsProps {
    applicationId: string;
    currentStage: string;
}

type PendingAction = {
    stage: string;
    label: string;
    description: string;
    confirmLabel: string;
    confirmStyle: string;
} | null;

export default function CandidateActions({ applicationId, currentStage }: CandidateActionsProps) {
    const [loading, setLoading] = useState(false);
    const [pendingAction, setPendingAction] = useState<PendingAction>(null);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    if (currentStage === "rejected" || currentStage === "hired") return null;

    const handleAiAnalysis = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/evaluate-cv", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ applicationId }),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Ocurrió un error al analizar con la IA.");
            }
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Error al realizar la evaluación.");
        } finally {
            setLoading(false);
        }
    };

    const requestAction = (stage: string) => {
        if (stage === "rejected") {
            setPendingAction({
                stage,
                label: "Descartar Candidato",
                description: "Esta acción moverá al candidato al estado de descartado. El cambio es definitivo desde esta vista.",
                confirmLabel: "Confirmar Descarte",
                confirmStyle: "bg-[#FF3000] text-white hover:bg-red-700",
            });
        } else if (stage === "interview") {
            setPendingAction({
                stage,
                label: "Aprobar para Entrevista",
                description: "El candidato avanzará a la etapa de entrevista. El equipo será notificado.",
                confirmLabel: "Confirmar Aprobación",
                confirmStyle: "bg-white text-black hover:bg-[#FF3000] hover:text-white",
            });
        }
    };

    const handleConfirm = async () => {
        if (!pendingAction) return;
        setLoading(true);
        setError(null);

        const { error: dbError } = await supabase
            .from("applications")
            .update({ stage: pendingAction.stage })
            .eq("id", applicationId);

        if (dbError) {
            setError("Error al actualizar: " + dbError.message);
            setLoading(false);
            return;
        }

        setPendingAction(null);
        setLoading(false);
        router.refresh();
    };

    const handleCancel = () => {
        setPendingAction(null);
        setError(null);
    };

    return (
        <div className="space-y-4">
            {error && !pendingAction && (
                <div className="border-l-4 pl-3 py-1" style={{ borderColor: "#FF3000" }}>
                    <p className="text-[10px] font-medium text-white/70">{error}</p>
                </div>
            )}
            {/* ── Action buttons ── */}
            <div className="flex gap-3 flex-wrap">
                <button
                    id="btn-evaluate-ai"
                    onClick={handleAiAnalysis}
                    disabled={loading}
                    className="px-5 py-2.5 text-[9px] font-black uppercase tracking-[0.2em] bg-[#FF3000] text-white hover:bg-red-700 disabled:opacity-40 transition-colors duration-150"
                >
                    {loading ? "Analizando..." : "Analizar con IA"}
                </button>
                <button
                    id="btn-discard"
                    onClick={() => requestAction("rejected")}
                    disabled={loading}
                    className="px-5 py-2.5 text-[9px] font-black uppercase tracking-[0.2em] border border-white/20 text-white/50 hover:border-[#FF3000] hover:text-[#FF3000] disabled:opacity-40 transition-colors duration-150"
                >
                    Descartar
                </button>
                <button
                    id="btn-approve-interview"
                    onClick={() => requestAction("interview")}
                    disabled={loading}
                    className="px-5 py-2.5 text-[9px] font-black uppercase tracking-[0.2em] bg-white text-black hover:bg-[#FF3000] hover:text-white disabled:opacity-40 transition-colors duration-150"
                >
                    Aprobar para Entrevista
                </button>
            </div>

            {/* ── Confirmation modal ── */}
            {pendingAction && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="confirm-title"
                >
                    {/* Backdrop — solid dark, no blur (Swiss flatness) */}
                    <div
                        className="absolute inset-0 bg-black/75"
                        onClick={handleCancel}
                    />

                    {/* Panel */}
                    <div className="relative w-full max-w-sm bg-[#0A0A0A] border-2 border-white/15 p-0">

                        {/* Header */}
                        <div className="border-b border-white/10 px-8 py-5 flex items-center justify-between">
                            <span
                                className="text-[9px] font-black uppercase tracking-[0.2em]"
                                style={{ color: "#FF3000" }}
                            >
                                Confirmar Acción
                            </span>
                            <button
                                onClick={handleCancel}
                                className="text-white/30 hover:text-white transition-colors text-lg leading-none font-black"
                                aria-label="Cancelar"
                            >
                                ×
                            </button>
                        </div>

                        {/* Body */}
                        <div className="px-8 py-6 space-y-4">
                            <h3
                                id="confirm-title"
                                className="text-lg font-black uppercase tracking-tighter text-white leading-none"
                            >
                                {pendingAction.label}
                            </h3>
                            <p className="text-xs text-white/50 leading-relaxed font-medium">
                                {pendingAction.description}
                            </p>

                            {error && (
                                <div className="border-l-4 pl-3 py-1" style={{ borderColor: "#FF3000" }}>
                                    <p className="text-[10px] font-medium text-white/70">{error}</p>
                                </div>
                            )}
                        </div>

                        {/* Footer actions */}
                        <div className="border-t border-white/10 px-8 py-5 flex items-center justify-end gap-3">
                            <button
                                onClick={handleCancel}
                                disabled={loading}
                                className="px-5 py-2.5 text-[9px] font-black uppercase tracking-[0.2em] border border-white/15 text-white/40 hover:text-white hover:border-white/30 disabled:opacity-40 transition-colors duration-150"
                            >
                                Cancelar
                            </button>
                            <button
                                id="confirm-action-btn"
                                onClick={handleConfirm}
                                disabled={loading}
                                className={`px-5 py-2.5 text-[9px] font-black uppercase tracking-[0.2em] disabled:opacity-40 transition-colors duration-150 ${pendingAction.confirmStyle}`}
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                        </svg>
                                        Procesando...
                                    </span>
                                ) : pendingAction.confirmLabel}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}