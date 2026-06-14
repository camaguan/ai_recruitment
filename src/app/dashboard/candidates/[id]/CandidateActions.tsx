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
    confirmClass: string;
} | null;

export default function CandidateActions({ applicationId, currentStage }: CandidateActionsProps) {
    const [loading, setLoading] = useState(false);
    const [pendingAction, setPendingAction] = useState<PendingAction>(null);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    if (currentStage === "rejected" || currentStage === "hired") {
        return null;
    }

    const requestAction = (stage: string) => {
        if (stage === "rejected") {
            setPendingAction({
                stage,
                label: "Descartar candidato",
                description: "Esta acción moverá al candidato al estado de descartado. No podrás revertirlo desde esta pantalla.",
                confirmLabel: "Sí, descartar",
                confirmClass: "bg-red-600 hover:bg-red-500 shadow-red-500/20",
            });
        } else if (stage === "interview") {
            setPendingAction({
                stage,
                label: "Aprobar para entrevista",
                description: "Se notificará al equipo que este candidato avanza a la etapa de entrevista.",
                confirmLabel: "Sí, aprobar",
                confirmClass: "bg-green-600 hover:bg-green-500 shadow-green-500/20",
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
            setError("Error al actualizar el estado: " + dbError.message);
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
        <>
            {/* Botones de acción */}
            <div className="flex gap-3">
                <button
                    onClick={() => requestAction("rejected")}
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-red-400 bg-red-950/30 border border-red-900/50 rounded-lg hover:bg-red-950/60 hover:border-red-800 disabled:opacity-50 transition-all duration-200"
                >
                    Descartar
                </button>

                <button
                    onClick={() => requestAction("interview")}
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-500 disabled:opacity-50 transition-all duration-200 shadow-sm shadow-green-500/20"
                >
                    Aprobar para Entrevista
                </button>
            </div>

            {/* Modal de confirmación */}
            {pendingAction && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="confirm-modal-title"
                >
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
                        onClick={handleCancel}
                    />

                    {/* Panel */}
                    <div className="relative w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
                        {/* Icono + Título */}
                        <div className="flex items-start gap-4">
                            <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                                pendingAction.stage === "rejected"
                                    ? "bg-red-950/50 border border-red-900/60 text-red-400"
                                    : "bg-green-950/50 border border-green-900/60 text-green-400"
                            }`}>
                                {pendingAction.stage === "rejected" ? "✕" : "✓"}
                            </div>
                            <div>
                                <h3
                                    id="confirm-modal-title"
                                    className="text-base font-semibold text-white"
                                >
                                    {pendingAction.label}
                                </h3>
                                <p className="mt-1 text-sm text-zinc-400 leading-relaxed">
                                    {pendingAction.description}
                                </p>
                            </div>
                        </div>

                        {/* Error inline */}
                        {error && (
                            <p className="text-xs text-red-400 bg-red-950/30 border border-red-900/40 rounded-lg px-3 py-2">
                                {error}
                            </p>
                        )}

                        {/* Acciones */}
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={handleCancel}
                                disabled={loading}
                                className="px-4 py-2 text-sm font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={loading}
                                className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-all duration-200 shadow-lg disabled:opacity-50 ${pendingAction.confirmClass}`}
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
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
        </>
    );
}