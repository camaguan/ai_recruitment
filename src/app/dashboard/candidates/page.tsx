import { createClient } from "@supabase/supabase-js";
import CandidatesView from "./CandidatesView";

export const dynamic = "force-dynamic";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function CandidatesPage() {
    const { data: applications } = await supabase
        .from("applications")
        .select(`
            id, stage, score, created_at,
            candidate:candidates(name, email),
            job:jobs(id, title)
        `)
        .order("created_at", { ascending: false });

    const { data: jobs } = await supabase
        .from("jobs")
        .select("id, title")
        .order("title", { ascending: true });

    return (
        <CandidatesView
            applications={applications || []}
            jobs={jobs || []}
        />
    );
}