import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (pathname.startsWith("/dashboard")) {
        const token = request.cookies.get("sb-access-token")?.value;

        if (!token) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        // Verify token against Supabase Auth API
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            const response = NextResponse.redirect(new URL("/login", request.url));
            response.cookies.delete("sb-access-token");
            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"],
};
