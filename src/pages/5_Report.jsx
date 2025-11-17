// Smartcargo-Advisory/src/pages/5_Report.jsx

import apiClient from '../api/api_client';
import { CORE_LEGAL_DISCLAIMER } from '../requirements/legal_warning';

const ReportPage = ({ shipmentId }) => {
    const [reportUrl, setReportUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    
    // Función que se ejecuta tras la confirmación del pago
    const handleGenerateReport = async () => {
        setLoading(true);
        try {
            // Llamada al Endpoint Fijo de generación de reporte
            const response = await apiClient.post('/report/generate', { shipment_id: shipmentId });
            setReportUrl(response.data.report_url);
            
        } catch (error) {
            console.error("Error al generar reporte:", error);
            alert("No se pudo generar el informe. Verifique que el pago haya sido procesado.");
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        // En un escenario real, esto se dispararía al cargar la página de éxito de Stripe
        handleGenerateReport();
    }, [shipmentId]);


    return (
        <div className="report-container">
            <h2>✅ Reporte de Revisión Esencial Generado</h2>
            {loading && <p>Generando diagnóstico legal y PDF...</p>}
            
            {reportUrl && (
                <>
                    <p>¡Su informe está listo! Haga clic para descargarlo y presentarlo con su carga.</p>
                    <a href={reportUrl} target="_blank" rel="noopener noreferrer" className="btn-download">
                        Descargar PDF (Diagnóstico Simple)
                    </a>
                </>
            )}

            {/* Mensaje Legal Fijo OBLIGATORIO (3.3) */}
            <footer className="footer-legal">{CORE_LEGAL_DISCLAIMER}</footer>
        </div>
    );
};
