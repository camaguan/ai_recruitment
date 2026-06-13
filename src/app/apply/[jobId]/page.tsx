import UploadCvForm from "@/features/recruitment/components/UploadCvForm";

export default function ApplyPage({ params }: { params: { jobId: string } }) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-slate-900">Postulación</h1>
                <p className="text-gray-500 mt-2">Sube tu CV en PDF para comenzar el proceso</p>
            </div>
            {/* Aquí inyectamos el componente que ya habías creado */}
            <UploadCvForm jobId={params.jobId} />
        </div>
    );
}