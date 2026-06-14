"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function JobsDashboard() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [seniority, setSeniority] = useState("Mid-Level");
    const [submitting, setSubmitting] = useState(false);

    const fetchJobs = async () => {
        const { data } = await supabase
            .from("jobs")
            .select("*")
            .order("created_at", { ascending: false });
        if (data) setJobs(data);
        setLoading(false);
    };

    useEffect(() => { fetchJobs(); }, []);

    const handleCreateJob = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        const { error } = await supabase
            .from("jobs")
            .insert({ title, description, seniority_required: seniority, status: "open" });

        if (!error) {
            toast.success("Vacante creada correctamente.");
            setTitle("");
            setDescription("");
            fetchJobs();
        } else {
            toast.error("Error al crear vacante: " + error.message);
        }
        setSubmitting(false);
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">

            {/* ── Page header ── */}
            <div className="border-b border-white/10 pb-6 mb-10">
                <span
                    className="text-[9px] font-black uppercase tracking-[0.25em] block mb-2"
                    style={{ color: "#FF3000" }}
                >
                    01. Gestión
                </span>
                <h1 className="text-4xl font-black uppercase tracking-tighter text-white leading-none">
                    Vacantes
                </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

                {/* ── Form column ── */}
                <div className="md:col-span-1">
                    <div className="border border-white/15 p-8 space-y-6 h-fit">
                        <h2 className="text-sm font-black uppercase tracking-[0.15em] text-white">
                            Nueva Vacante
                        </h2>

                        <form onSubmit={handleCreateJob} className="space-y-6">
                            <div>
                                <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-white/40 mb-2">
                                    Título del Puesto
                                </label>
                                <input
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Ej: Frontend Developer"
                                    className="w-full border-b border-white/20 bg-transparent py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#FF3000] transition-colors duration-150"
                                />
                            </div>

                            <div>
                                <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-white/40 mb-2">
                                    Seniority
                                </label>
                                <select
                                    value={seniority}
                                    onChange={(e) => setSeniority(e.target.value)}
                                    className="w-full border-b border-white/20 bg-transparent py-2.5 text-sm text-white focus:outline-none focus:border-[#FF3000] transition-colors duration-150 appearance-none cursor-pointer"
                                >
                                    <option value="Junior"    className="bg-[#0A0A0A] text-white">Junior</option>
                                    <option value="Mid-Level" className="bg-[#0A0A0A] text-white">Mid-Level</option>
                                    <option value="Senior"    className="bg-[#0A0A0A] text-white">Senior</option>
                                    <option value="Lead"      className="bg-[#0A0A0A] text-white">Lead</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-white/40 mb-2">
                                    Descripción y Requisitos
                                </label>
                                <textarea
                                    required
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={5}
                                    placeholder="Requisitos, tecnologías, responsabilidades..."
                                    className="w-full border border-white/15 bg-white/[0.03] py-3 px-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#FF3000] transition-colors duration-150 resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-3.5 bg-white text-black text-[9px] font-black uppercase tracking-[0.2em] hover:bg-[#FF3000] hover:text-white disabled:opacity-40 transition-colors duration-150"
                            >
                                {submitting ? "Creando..." : "Crear Vacante"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* ── Jobs list column ── */}
                <div className="md:col-span-2 space-y-0">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-0">
                        <h2 className="text-sm font-black uppercase tracking-[0.15em] text-white">
                            Vacantes Activas
                        </h2>
                        {!loading && (
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/25">
                                {jobs.length} total
                            </span>
                        )}
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <div
                                className="w-6 h-6 border-2 border-white/20 border-t-transparent animate-spin"
                                style={{ borderTopColor: "#FF3000" }}
                            />
                        </div>
                    ) : jobs.length === 0 ? (
                        <div className="py-16 text-center border border-white/10 swiss-dots-dark mt-0">
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/25">
                                No hay vacantes creadas aún.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-white/[0.06]">
                            {jobs.map((job) => (
                                <div
                                    key={job.id}
                                    className="py-5 hover:bg-white/[0.02] transition-colors group"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <h3 className="text-sm font-black uppercase tracking-tight text-white group-hover:text-white leading-snug">
                                            {job.title}
                                        </h3>
                                        <span className="shrink-0 text-[8px] font-black uppercase tracking-[0.15em] px-2 py-0.5 border border-white/20 text-white/45">
                                            {job.seniority_required}
                                        </span>
                                    </div>
                                    <p className="mt-2 text-xs text-white/35 font-medium line-clamp-2 leading-relaxed">
                                        {job.description}
                                    </p>
                                    <div className="mt-3 flex items-center gap-3">
                                        <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 border ${
                                            job.status === "open"
                                                ? "border-green-500/40 text-green-400"
                                                : "border-white/20 text-white/30"
                                        }`}>
                                            {job.status === "open" ? "Abierta" : "Cerrada"}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}