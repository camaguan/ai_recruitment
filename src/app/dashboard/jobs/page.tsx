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
            <div className="md:col-span-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
                <h2 className="text-xl font-bold mb-4">Nueva Vacante</h2>
                <form onSubmit={handleCreateJob} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Título</label>
                        <input required value={title} onChange={e => setTitle(e.target.value)} className="mt-1 w-full p-2 border rounded-md" placeholder="Ej: Frontend Developer" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Seniority</label>
                        <select value={seniority} onChange={e => setSeniority(e.target.value)} className="mt-1 w-full p-2 border rounded-md">
                            <option>Junior</option>
                            <option>Mid-Level</option>
                            <option>Senior</option>
                            <option>Lead</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Descripción requerida</label>
                        <textarea required value={description} onChange={e => setDescription(e.target.value)} rows={4} className="mt-1 w-full p-2 border rounded-md" placeholder="Requisitos, tecnologías..." />
                    </div>
                    <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium">
                        Crear Vacante
                    </button>
                </form>
            </div>

            {/* Columna Derecha: Lista de Vacantes */}
            <div className="md:col-span-2">
                <h2 className="text-xl font-bold mb-4">Vacantes Activas</h2>
                {loading ? <p>Cargando...</p> : (
                    <div className="space-y-4">
                        {jobs.map(job => (
                            <div key={job.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-bold text-blue-600">{job.title}</h3>
                                        <span className="inline-block mt-1 px-2 py-1 bg-gray-100 text-xs rounded-md text-gray-600 border">
                                            {job.seniority_required}
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-400">ID: {job.id.split('-')[0]}...</span>
                                </div>
                                <p className="mt-3 text-sm text-gray-600 line-clamp-2">{job.description}</p>
                                {/* Nota para testeo: Necesitas este ID para pasarle al componente UploadCvForm */}
                                <div className="mt-4 pt-3 border-t text-xs font-mono text-gray-500">
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