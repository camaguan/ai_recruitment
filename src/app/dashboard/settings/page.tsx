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
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            {/* Cabecera */}
            <div>
                <h1 className="text-3xl font-bold text-zinc-50">Configuración</h1>
                <p className="text-zinc-400 mt-2">Ajusta los parámetros del motor de evaluación IA y preferencias del sistema.</p>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                {/* Bloque Evaluación IA */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl space-y-5">
                    <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                        🧠 Motor de Evaluación IA
                    </h2>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-300">
                                Modelo de Lenguaje Utilizado
                            </label>
                            <select 
                                value={selectedModel} 
                                onChange={(e) => setSelectedModel(e.target.value)}
                                className="mt-2 block w-full rounded-md border border-zinc-700 bg-zinc-800 text-zinc-100 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="gemini-1.5-pro">Gemini 1.5 Pro (Recomendado)</option>
                                <option value="gemini-1.5-flash">Gemini 1.5 Flash (Más rápido)</option>
                                <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
                            </select>
                            <p className="text-xs text-zinc-500 mt-1.5">
                                Afecta directamente la calidad del análisis de CV y el cálculo del Match Score.
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-305">
                                Score Mínimo Recomendado ({minScore}/100)
                            </label>
                            <input 
                                type="range" 
                                min="0" 
                                max="100" 
                                value={minScore} 
                                onChange={(e) => setMinScore(Number(e.target.value))}
                                className="w-full mt-3 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                            <div className="flex justify-between text-xs text-zinc-500 mt-1">
                                <span>Filtrado blando (0)</span>
                                <span>Filtrado estricto (100)</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bloque Notificaciones */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl space-y-5">
                    <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                        ✉️ Alertas y Notificaciones
                    </h2>

                    <div className="flex items-center justify-between">
                        <div>
                            <span className="block text-sm font-medium text-zinc-200">Notificaciones de nuevos candidatos</span>
                            <span className="block text-xs text-zinc-500 mt-0.5">Enviar un correo electrónico diario con el resumen de CVs recibidos.</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setNotifyOnApply(!notifyOnApply)}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                notifyOnApply ? "bg-blue-600" : "bg-zinc-700"
                            }`}
                        >
                            <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                    notifyOnApply ? "translate-x-5" : "translate-x-0"
                                }`}
                            />
                        </button>
                    </div>
                </div>

                {/* Acciones */}
                <div className="flex items-center justify-end gap-4">
                    {saved && (
                        <span className="text-sm text-green-400 animate-fade-in">
                            ✓ Configuración guardada correctamente
                        </span>
                    )}
                    <button
                        type="submit"
                        className="py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-md transition-colors"
                    >
                        Guardar Cambios
                    </button>
                </div>
            </form>
        </div>
    );
}
