"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface CandidateActionsProps {
    applicationId: string;
    currentStage: string;
}

export default function CandidateActions({ applicationId, currentStage }: CandidateActionsProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Si ya fue rechazado o contratado, ocultamos los botones para evitar cambios accidentales
    if (currentStage === "rejected" || currentStage === "hired") {
        return null;
    }

    const handleUpdateStage = async (newStage: string) => {
        if (!confirm(`¿Estás seguro de mover este candidato a: ${newStage}?`)) return;

        setLoading(true);

        const { error } = await supabase
            .from("applications")
            .update({ stage: newStage })
            .eq("id", applicationId);

        if (error) {
            alert("Error al actualizar el estado: " + error.message);
            setLoading(false);
            return;
        }

        // Refrescamos la ruta para que Next.js vuelva a hacer el fetch en el servidor
        router.refresh();
        setLoading(false);
    };

    return (
        <div className="flex gap-3">
            <button
                onClick={() => handleUpdateStage("rejected")}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 disabled:opacity-50 transition-colors"
            >
                Descartar
            </button>

            <button
                onClick={() => handleUpdateStage("interview")}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors shadow-sm"
            >
                Aprobar para Entrevista
            </button>
        </div>
    );
}