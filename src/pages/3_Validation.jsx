// src/pages/3_Validation.jsx
import React, { useState, useEffect } from 'react';
import apiClient from '../api/api_client';
import { AWB_MANDATORY_FIELDS } from '../requirements/awb_fields';
import { CORE_LEGAL_DISCLAIMER } from '../requirements/legal_warning';

// Componente padre que exporta secciones de validación
const PalletValidationComponent = ({ shipmentId }) => {
  const [isWood, setIsWood] = useState(false);
  const [hasMark, setHasMark] = useState(false);
  const [criticalWarning, setCriticalWarning] = useState(null);
  const [validating, setValidating] = useState(false);

  useEffect(() => {
    // Ejecutar validación cuando haya shipmentId
    if (!shipmentId) return;
    const timer = setTimeout(() => validatePallet(), 400);
    return () => clearTimeout(timer);
  }, [isWood, hasMark, shipmentId]);

  const validatePallet = async () => {
    if (!shipmentId) return;
    setValidating(true);
    try {
      // Intentamos extraer una estructura de marcas ISPM desde AWB_MANDATORY_FIELDS
      const ispmObj = AWB_MANDATORY_FIELDS.find(f => f.key === "ISPM_15");
      const marks = (ispmObj && ispmObj.SELLOS_OBLIGATORIOS) ? ispmObj.SELLOS_OBLIGATORIOS : [];

      const response = await apiClient.post('/cargo/validate/pallet', {
        shipment_id: shipmentId,
        is_wood_pallet: isWood,
        pallet_marks: isWood && hasMark ? marks : []
      });

      if (response.data.risk_level === 5) {
        setCriticalWarning(response.data.warning);
      } else {
        setCriticalWarning(null);
      }
    } catch (err) {
      console.error("Error validating pallet:", err);
      setCriticalWarning("Error de comunicación. Intente validar de nuevo.");
    } finally {
      setValidating(false);
    }
  };

  return (
    <div className="validation-pallet-section">
      <h3>🪵 ISPM-15 / Pallet Validation</h3>
      <label>
        ¿Su pallet es de madera?
        <input type="checkbox" checked={isWood} onChange={(e) => setIsWood(e.target.checked)} />
      </label>

      {isWood && (
        <label>
          ¿Tiene sello HT/ISPM-15 visible?
          <input type="checkbox" checked={hasMark} onChange={(e) => setHasMark(e.target.checked)} />
        </label>
      )}

      {validating && <p>Validando pallet...</p>}

      {criticalWarning && (
        <div className="warning-box-critical" role="alert">
          <strong>ADVERTENCIA CRÍTICA:</strong>
          <p>{criticalWarning}</p>
          <p>✔ Pallets alternativos sugeridos: Plástico reforzado, Pallet prensado, EPAL.</p>
        </div>
      )}
    </div>
  );
};

const PhotoValidationSection = ({ shipmentId, commodityDescription }) => {
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [iaAdvice, setIaAdvice] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePhotoUploadAndAnalyze = async () => {
    if (!selectedImageFile) {
      alert('Seleccione una imagen para análisis.');
      return;
    }

    const formData = new FormData();
    formData.append('shipment_id', shipmentId);
    formData.append('commodity_description', commodityDescription);
    formData.append('image', selectedImageFile);

    setLoading(true);
    try {
      const response = await apiClient.post('/cargo/validate/photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setIaAdvice(response.data.ia_advice || response.data.ia_response);
      if (response.data.dg_risk === "ALTO") {
        alert("⚠️ " + response.data.warning);
      }
    } catch (err) {
      console.error(err);
      alert('Error en el análisis de la foto. Intente de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="photo-validation">
      <h3>📸 Validación Fotográfica por IA</h3>
      <input type="file" accept="image/*" onChange={(e) => setSelectedImageFile(e.target.files[0])} />
      <button onClick={handlePhotoUploadAndAnalyze} disabled={!selectedImageFile || loading}>
        {loading ? 'Analizando...' : 'Analizar Foto y Riesgos'}
      </button>

      {iaAdvice && (
        <div className="advice-box">
          <strong>Sugerencia IA:</strong>
          <p>{iaAdvice}</p>
        </div>
      )}
    </div>
  );
};

const TemperatureValidationComponent = ({ shipmentId, commodity }) => {
  const [duration, setDuration] = useState(48);
  const [tempSuggestions, setTempSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTempValidation = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post('/cargo/validate/temperature', {
        shipment_id: shipmentId,
        commodity,
        required_temp_range: [2.0, 8.0],
        duration_hours: duration
      });
      setTempSuggestions(response.data.recommendations || []);
    } catch (err) {
      console.error("Temp validation error:", err);
      alert('Error al validar temperatura.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="validation-temp-section">
      <h3>🌡 Validación de Temperatura</h3>
      <label>
        Tiempo de tránsito (horas):
        <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} />
      </label>
      <button onClick={handleTempValidation} disabled={loading}>
        {loading ? 'Consultando...' : 'Obtener Sugerencias Térmicas'}
      </button>

      {tempSuggestions && (
        <div className="suggestions-box">
          <strong>Recomendaciones:</strong>
          <ul>
            {tempSuggestions.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
};

const ValidationPage = ({ shipmentId, commodityDescription }) => {
  return (
    <div className="validation-page">
      <h2>Validaciones SmartCargo (SC-PAM™)</h2>
      <p>SmartCargo revisa documentos y fotos. Somos asesores; no certificamos ni manipulamos carga.</p>

      <PalletValidationComponent shipmentId={shipmentId} />
      <PhotoValidationSection shipmentId={shipmentId} commodityDescription={commodityDescription} />
      <TemperatureValidationComponent shipmentId={shipmentId} commodity={commodityDescription} />

      <footer style={{ marginTop: 20 }}>
        <small>{CORE_LEGAL_DISCLAIMER}</small>
      </footer>
    </div>
  );
};

export default ValidationPage;
