"use client";

import { useState } from "react";

export default function SettingsPage() {
    const [minScore, setMinScore] = useState(70);
    const [selectedModel, setSelectedModel] = useState("gemini-1.5-pro");
    const [notifyOnApply, setNotifyOnApply] = useState(true);
    const [saved, setSaved] = useState(false);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-10">

            {/* ── Header ── */}
            <div className="border-b border-white/10 pb-6">
                <span
                    className="text-[9px] font-black uppercase tracking-[0.25em] block mb-2"
                    style={{ color: "#FF3000" }}
                >
                    01. Sistema
                </span>
                <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-white leading-none">
                    Configuración
                </h1>
                <p className="text-xs text-white/35 mt-3 font-medium">
                    Ajusta los parámetros del motor de evaluación y preferencias del sistema.
                </p>
            </div>

            <form onSubmit={handleSave} className="space-y-8">

                {/* ── Evaluation engine block ── */}
                <div className="border border-white/10">
                    <div className="border-b border-white/10 px-6 py-4">
                        <h2 className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">
                            Motor de Evaluación
                        </h2>
                    </div>

                    <div className="divide-y divide-white/[0.06]">
                        {/* Model select */}
                        <div className="px-6 py-5 space-y-2">
                            <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-white/35">
                                Modelo de Lenguaje Utilizado
                            </label>
                            <select
                                value={selectedModel}
                                onChange={(e) => setSelectedModel(e.target.value)}
                                className="w-full border-b border-white/20 bg-transparent py-2.5 text-sm text-white focus:outline-none focus:border-[#FF3000] transition-colors duration-150 appearance-none cursor-pointer"
                            >
                                <option value="gemini-1.5-pro"   className="bg-[#0A0A0A] text-white">Gemini 1.5 Pro (Recomendado)</option>
                                <option value="gemini-1.5-flash" className="bg-[#0A0A0A] text-white">Gemini 1.5 Flash (Más rápido)</option>
                                <option value="claude-3-5-sonnet" className="bg-[#0A0A0A] text-white">Claude 3.5 Sonnet</option>
                            </select>
                            <p className="text-[9px] text-white/25 font-medium leading-relaxed">
                                Afecta la calidad del análisis de CV y el cálculo del Match Score.
                            </p>
                        </div>

                        {/* Score range */}
                        <div className="px-6 py-5 space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/35">
                                    Score Mínimo Recomendado
                                </label>
                                <span
                                    className="text-2xl font-black tabular-nums leading-none"
                                    style={{ color: "#FF3000" }}
                                >
                                    {minScore}
                                    <span className="text-sm text-white/25 ml-0.5">/100</span>
                                </span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={minScore}
                                onChange={(e) => setMinScore(Number(e.target.value))}
                                className="w-full h-0.5 bg-white/15 appearance-none cursor-pointer accent-[#FF3000]"
                            />
                            <div className="flex justify-between text-[9px] font-black uppercase tracking-[0.15em] text-white/20">
                                <span>Filtrado suave (0)</span>
                                <span>Filtrado estricto (100)</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Notifications block ── */}
                <div className="border border-white/10">
                    <div className="border-b border-white/10 px-6 py-4">
                        <h2 className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">
                            Alertas y Notificaciones
                        </h2>
                    </div>

                    <div className="px-6 py-5 flex items-center justify-between gap-8">
                        <div className="space-y-1">
                            <p className="text-sm font-bold text-white">Notificaciones de nuevos candidatos</p>
                            <p className="text-[10px] text-white/30 font-medium">
                                Enviar un correo con el resumen diario de CVs recibidos.
                            </p>
                        </div>

                        {/* Swiss toggle — checkbox style */}
                        <button
                            type="button"
                            id="toggle-notifications"
                            onClick={() => setNotifyOnApply(!notifyOnApply)}
                            aria-pressed={notifyOnApply}
                            className={`shrink-0 w-12 h-6 border-2 relative transition-colors duration-150 ${
                                notifyOnApply ? "border-[#FF3000] bg-[#FF3000]" : "border-white/20 bg-transparent"
                            }`}
                        >
                            <span
                                className={`absolute top-0 bottom-0 w-5 h-full flex items-center justify-center transition-all duration-150 ${
                                    notifyOnApply ? "left-[calc(100%-20px)]" : "left-0"
                                }`}
                            >
                                <span className={`w-3 h-3 ${notifyOnApply ? "bg-white" : "bg-white/30"}`} />
                            </span>
                        </button>
                    </div>
                </div>

                {/* ── Save ── */}
                <div className="flex items-center justify-end gap-6 pt-2">
                    {saved && (
                        <span
                            className="text-[9px] font-black uppercase tracking-[0.2em]"
                            style={{ color: "#FF3000" }}
                        >
                            Cambios guardados correctamente.
                        </span>
                    )}
                    <button
                        type="submit"
                        className="px-8 py-3.5 bg-white text-black text-[9px] font-black uppercase tracking-[0.2em] hover:bg-[#FF3000] hover:text-white transition-colors duration-150"
                    >
                        Guardar Cambios
                    </button>
                </div>
            </form>
        </div>
    );
}
