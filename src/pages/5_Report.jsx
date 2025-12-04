// src/pages/5_Report.jsx
import React, { useState, useEffect } from 'react';
import apiClient from '../api/api_client';
import { CORE_LEGAL_DISCLAIMER } from '../requirements/legal_warning';

const ReportPage = ({ shipmentId }) => {
  const [reportUrl, setReportUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post('/report/generate', { shipment_id: shipmentId });
      setReportUrl(response.data.report_url || response.data.report_url);
    } catch (err) {
      console.error('Error al generar reporte:', err);
      alert('No se pudo generar el informe. Verifique que el pago haya sido procesado.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!shipmentId) return;
    handleGenerateReport();
  }, [shipmentId]);

  return (
    <div className="report-container">
      <h2>Reporte Ready-To-Counter™</h2>
      {loading && <p>Generando diagnóstico y PDF...</p>}

      {reportUrl ? (
        <>
          <p>Informe generado. Descárguelo y preséntelo con su carga.</p>
          <a href={reportUrl} target="_blank" rel="noopener noreferrer" className="btn-download">
            Descargar PDF (Ready-To-Counter™)
          </a>
        </>
      ) : (
        !loading && <p>No hay informe disponible. Asegúrese de que el pago esté completado.</p>
      )}

      <footer style={{ marginTop: 24 }}>
        <small>{CORE_LEGAL_DISCLAIMER}</small>
      </footer>
    </div>
  );
};

export default ReportPage;
