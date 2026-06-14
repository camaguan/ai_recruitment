"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Logo from "@/components/ui/Logo";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        toast.loading("Iniciando sesión...", { id: "login-toast" });

        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            toast.error(error.message || "Credenciales inválidas.", { id: "login-toast" });
        } else {
            if (data.session) {
                document.cookie = `sb-access-token=${data.session.access_token}; path=/; max-age=${data.session.expires_in}; SameSite=Lax; Secure`;
            }
            toast.success("¡Sesión iniciada con éxito!", { id: "login-toast" });
            router.push("/dashboard/jobs");
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#F2F2F2] flex flex-col swiss-grid-pattern">

            {/* Top bar */}
            <div className="border-b-2 border-black bg-white px-8 py-4">
                <Link href="/">
                    <Logo iconSize={28} textSize="text-xl" variant="light" />
                </Link>
            </div>

            {/* Content */}
            <div className="flex-1 flex items-center justify-center px-4 py-16">
                <div className="w-full max-w-sm">

                    {/* Label */}
                    <p
                        className="text-[9px] font-black uppercase tracking-[0.25em] mb-5"
                        style={{ color: "#FF3000" }}
                    >
                        Acceso Restringido — Solo Personal Autorizado
                    </p>

                    {/* Card */}
                    <div className="bg-white border-2 border-black p-10">
                        <h1 className="text-3xl font-black uppercase tracking-tighter text-black mb-8 leading-[0.95]">
                            Panel de<br />Reclutadores
                        </h1>

                        <form onSubmit={handleLogin} className="space-y-7">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-[9px] font-black uppercase tracking-[0.2em] text-black mb-2"
                                >
                                    Correo Electrónico
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="reclutador@ejemplo.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full border-b-2 border-black bg-transparent py-3 text-sm text-black placeholder-black/25 focus:outline-none focus:border-[#FF3000] transition-colors duration-150"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-[9px] font-black uppercase tracking-[0.2em] text-black mb-2"
                                >
                                    Contraseña
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full border-b-2 border-black bg-transparent py-3 text-sm text-black placeholder-black/25 focus:outline-none focus:border-[#FF3000] transition-colors duration-150"
                                />
                            </div>

                            <button
                                type="submit"
                                id="login-submit"
                                disabled={isLoading}
                                className="w-full mt-2 py-4 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#FF3000] disabled:opacity-50 transition-colors duration-150"
                            >
                                {isLoading ? "Validando..." : "Ingresar al Panel"}
                            </button>
                        </form>

                        <p className="mt-8 text-[9px] text-black/35 uppercase tracking-wider leading-relaxed font-medium">
                            Si no tienes acceso, solicita credenciales al administrador del sistema.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}