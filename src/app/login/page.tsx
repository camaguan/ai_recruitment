"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        toast.loading("Iniciando sesión...", { id: "login-toast" });

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            toast.error(error.message || "Credenciales inválidas.", { id: "login-toast" });
        } else {
            if (data.session) {
                // Guardar la cookie de sesión con una expiración adecuada
                document.cookie = `sb-access-token=${data.session.access_token}; path=/; max-age=${data.session.expires_in}; SameSite=Lax; Secure`;
            }
            toast.success("¡Sesión iniciada con éxito!", { id: "login-toast" });
            router.push("/dashboard/jobs");
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
            <div className="w-full max-w-md bg-zinc-900 p-8 rounded-2xl border border-zinc-800 shadow-2xl space-y-6 transition-all duration-300 hover:border-zinc-700">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-extrabold tracking-tight text-white">
                        e-<span className="text-blue-500">Selector</span>
                    </h2>
                    <p className="text-sm text-zinc-400">Portal de Reclutadores y Analistas</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                            Correo Electrónico
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="reclutador@ejemplo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 rounded-lg border border-zinc-800 bg-zinc-800/50 text-white placeholder-zinc-500 shadow-inner focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all duration-200"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                            Contraseña
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 rounded-lg border border-zinc-800 bg-zinc-800/50 text-white placeholder-zinc-500 shadow-inner focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all duration-200"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white p-3 rounded-lg font-medium hover:bg-blue-500 disabled:opacity-50 transition-all duration-200 shadow-lg shadow-blue-500/20 active:scale-[0.98] cursor-pointer"
                    >
                        {isLoading ? "Validando..." : "Ingresar al Panel"}
                    </button>
                </form>

                <div className="text-center">
                    <p className="text-xs text-zinc-500">
                        Solo personal autorizado. Si no tienes cuenta, solicita acceso al Administrador.
                    </p>
                </div>
            </div>
        </div>
    );
}