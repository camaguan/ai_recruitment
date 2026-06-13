"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

export default function JobsDashboard() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Estados del formulario
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [seniority, setSeniority] = useState("Mid-Level");

    const fetchJobs = async () => {
        const { data } = await supabase.from("jobs").select("*").order("created_at", { ascending: false });
        if (data) setJobs(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleCreateJob = async (e: React.FormEvent) => {
        e.preventDefault();
        const { error } = await supabase
            .from("jobs")
            .insert({ title, description, seniority_required: seniority, status: 'open' });

        if (!error) {
            setTitle("");
            setDescription("");
            fetchJobs(); // Recargar la lista
        } else {
            alert("Error al crear vacante: " + error.message);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Columna Izquierda: Formulario */}
            <div className="md:col-span-1 bg-zinc-900 p-6 rounded-xl border border-zinc-800 shadow-xl h-fit transition-colors">
                <h2 className="text-xl font-bold mb-4 text-zinc-50">Nueva Vacante</h2>
                <form onSubmit={handleCreateJob} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-300">Título</label>
                        <input required value={title} onChange={e => setTitle(e.target.value)} className="mt-1 w-full p-2 border border-zinc-700 rounded-md bg-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" placeholder="Ej: Frontend Developer" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-300">Seniority</label>
                        <select value={seniority} onChange={e => setSeniority(e.target.value)} className="mt-1 w-full p-2 border border-zinc-700 rounded-md bg-zinc-800 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors">
                            <option className="bg-zinc-800 text-zinc-100">Junior</option>
                            <option className="bg-zinc-800 text-zinc-100">Mid-Level</option>
                            <option className="bg-zinc-800 text-zinc-100">Senior</option>
                            <option className="bg-zinc-800 text-zinc-100">Lead</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-300">Descripción requerida</label>
                        <textarea required value={description} onChange={e => setDescription(e.target.value)} rows={4} className="mt-1 w-full p-2 border border-zinc-700 rounded-md bg-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" placeholder="Requisitos, tecnologías..." />
                    </div>
                    <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors">
                        Crear Vacante
                    </button>
                </form>
            </div>

            {/* Columna Derecha: Lista de Vacantes */}
            <div className="md:col-span-2">
                <h2 className="text-xl font-bold mb-4 text-zinc-55">Vacantes Activas</h2>
                {loading ? <p className="text-zinc-500">Cargando...</p> : (
                    <div className="space-y-4">
                        {jobs.map(job => (
                            <div key={job.id} className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 shadow-xl transition-colors">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-bold text-blue-400">{job.title}</h3>
                                        <span className="inline-block mt-1 px-2 py-1 bg-zinc-805 text-xs rounded-md text-zinc-300 border border-zinc-700">
                                            {job.seniority_required}
                                        </span>
                                    </div>
                                    <span className="text-xs text-zinc-500">ID: {job.id.split('-')[0]}...</span>
                                </div>
                                <p className="mt-3 text-sm text-zinc-300 line-clamp-2">{job.description}</p>
                                {/* Nota para testeo: Necesitas este ID para pasarle al componente UploadCvForm */}
                                <div className="mt-4 pt-3 border-t border-zinc-800 text-xs font-mono text-zinc-400">
                                    jobId para el form: {job.id}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}