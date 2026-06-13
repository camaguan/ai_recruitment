
import UploadCvForm from "@/features/recruitment/components/UploadCvForm";

export default async function ApplyPage({ params }: { params: Promise<{ jobId: string }> }) {
    // 1. Await a los params (Indispensable en versiones recientes)
    const resolvedParams = await params;
    const { jobId } = resolvedParams;

    console.log("DEBUG - jobId en la página:", jobId); // Verifica si aquí sí sale el ID

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            {/* 2. Pasamos el jobId al componente */}
            <UploadCvForm jobId={jobId} />
        </div>
    );
}