import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase admin/service client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
    try {
        const { applicationId } = await req.json();

        if (!applicationId) {
            return NextResponse.json(
                { error: "applicationId is required" },
                { status: 400 }
            );
        }

        // 1. Fetch application, candidate and job details
        const { data: app, error: appError } = await supabase
            .from("applications")
            .select(`
                id,
                stage,
                candidate:candidates(name, email, cv_pdf_url),
                job:jobs(title)
            `)
            .eq("id", applicationId)
            .single();

        if (appError || !app) {
            return NextResponse.json(
                { error: `Application not found: ${appError?.message || "Unknown error"}` },
                { status: 404 }
            );
        }

        const candidate = (Array.isArray(app.candidate) ? app.candidate[0] : app.candidate) as any;
        const job = (Array.isArray(app.job) ? app.job[0] : app.job) as any;

        if (!candidate?.cv_pdf_url) {
            return NextResponse.json(
                { error: "Candidate does not have a CV uploaded" },
                { status: 400 }
            );
        }

        // 2. Download the PDF file
        const pdfResponse = await fetch(candidate.cv_pdf_url);
        if (!pdfResponse.ok) {
            return NextResponse.json(
                { error: `Failed to download CV from ${candidate.cv_pdf_url}` },
                { status: 500 }
            );
        }

        const arrayBuffer = await pdfResponse.arrayBuffer();
        const base64Pdf = Buffer.from(arrayBuffer).toString("base64");

        // 3. Call the Gemini API
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: "GEMINI_API_KEY environment variable is not configured" },
                { status: 500 }
            );
        }

        const model = "gemini-2.5-flash";
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const promptText = `Analiza el CV del candidato para la vacante de: "${job?.title || "Posición General"}".
        Extrae un resumen profesional, determina su seniority/clasificación, el nivel de compatibilidad del perfil y sugerencias/observaciones.
        Calcula también un puntaje de coincidencia (score) del 0 al 100 en base a qué tan bien se alinea el CV con el rol.`;

        const geminiRequestBody = {
            contents: [
                {
                    parts: [
                        { text: promptText },
                        {
                            inlineData: {
                                mimeType: "application/pdf",
                                data: base64Pdf
                            }
                        }
                    ]
                }
            ],
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "OBJECT",
                    properties: {
                        summary: { type: "STRING", description: "Breve resumen profesional del candidato" },
                        classification: { type: "STRING", description: "Nivel de seniority/clasificación (ej. Junior, Mid, Senior)" },
                        riskLevel: {
                            type: "STRING",
                            enum: ["Low", "Medium", "High"],
                            description: "Nivel de riesgo de contratación (Low, Medium, High) según inestabilidad, lagunas u otros factores"
                        },
                        suggestions: {
                            type: "ARRAY",
                            items: { type: "STRING" },
                            description: "Lista de sugerencias u observaciones específicas basadas en el CV"
                        },
                        score: {
                            type: "INTEGER",
                            description: "Match score del candidato con el puesto (0-100)"
                        }
                    },
                    required: ["summary", "classification", "riskLevel", "suggestions", "score"]
                }
            }
        };

        const geminiResponse = await fetch(geminiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(geminiRequestBody)
        });

        if (!geminiResponse.ok) {
            const errText = await geminiResponse.text();
            return NextResponse.json(
                { error: `Gemini API returned error: ${errText}` },
                { status: 502 }
            );
        }

        const geminiData = await geminiResponse.json();
        const responseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!responseText) {
            return NextResponse.json(
                { error: "Invalid response structure from Gemini API" },
                { status: 502 }
            );
        }

        const parsedResult = JSON.parse(responseText);

        // 4. Save the evaluation result in ai_evaluations
        const { error: insertError } = await supabase
            .from("ai_evaluations")
            .insert({
                application_id: applicationId,
                raw_prompt: promptText,
                model_used: model,
                json_result: {
                    summary: parsedResult.summary,
                    classification: parsedResult.classification,
                    riskLevel: parsedResult.riskLevel,
                    suggestions: parsedResult.suggestions
                }
            });

        if (insertError) {
            return NextResponse.json(
                { error: `Failed to save evaluation to database: ${insertError.message}` },
                { status: 500 }
            );
        }

        // 5. Update the applications table (score and stage)
        const { error: updateError } = await supabase
            .from("applications")
            .update({
                score: parsedResult.score,
                stage: "human_review"
            })
            .eq("id", applicationId);

        if (updateError) {
            return NextResponse.json(
                { error: `Failed to update application status: ${updateError.message}` },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            data: parsedResult
        });

    } catch (err: any) {
        return NextResponse.json(
            { error: err.message || "An unexpected error occurred" },
            { status: 500 }
        );
    }
}
