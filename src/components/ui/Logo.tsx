import React from "react";

interface LogoProps {
    className?: string;
    iconSize?: number;
    textSize?: string;
}

export default function Logo({ className = "", iconSize = 28, textSize = "text-xl" }: LogoProps) {
    return (
        <div className={`flex items-center gap-2.5 font-sans select-none ${className}`}>
            <div className="relative flex items-center justify-center" style={{ width: iconSize, height: iconSize }}>
                <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-blue-500 animate-pulse"
                >
                    {/* Glowing outer nodes */}
                    <circle cx="16" cy="6" r="2.5" className="fill-blue-400" />
                    <circle cx="8" cy="22" r="2.5" className="fill-blue-400" />
                    <circle cx="24" cy="22" r="2.5" className="fill-blue-400" />
                    
                    {/* Inner core node */}
                    <circle cx="16" cy="17" r="4" className="fill-blue-600" />
                    
                    {/* Futuristic connection lines */}
                    <line x1="16" y1="6" x2="16" y2="13" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" />
                    <line x1="8" y1="22" x2="13.5" y2="19.5" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" />
                    <line x1="24" y1="22" x2="18.5" y2="19.5" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" />
                    
                    {/* Tech orbit paths */}
                    <circle cx="16" cy="17" r="9" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.3" />
                </svg>
                <div className="absolute inset-0 bg-blue-500/20 blur-md rounded-full -z-10 animate-ping opacity-30"></div>
            </div>
            <span className={`font-bold tracking-tight text-white ${textSize}`}>
                e-<span className="text-blue-500">Selector</span>
            </span>
        </div>
    );
}
