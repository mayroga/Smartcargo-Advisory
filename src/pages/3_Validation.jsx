// Smartcargo-Advisory/src/pages/3_Validation.jsx

import React, { useState, useEffect } from 'react';
import apiClient from '../api/api_client';
// Se asume que este archivo existe y tiene la estructura fija de AWB_MANDATORY_FIELDS
import { AWB_MANDATORY_FIELDS } from '../requirements/awb_fields'; 

// ==============================================================================
// 1. PalletValidationComponent (Lógica Corregida 🛠️)
// ==============================================================================
const PalletValidationComponent = ({ shipmentId }) => {
    const [isWood, setIsWood] = useState(false);
    const [hasMark, setHasMark] = useState(false);
    const [criticalWarning, setCriticalWarning] = useState(null);

    // FUNCIÓN CENTRAL DE VALIDACIÓN
    const handlePalletValidation = async () => {
        // Ejecutar solo si el shipmentId existe para evitar llamadas vacías
        if (!shipmentId) return;

        // Determinar las marcas a enviar. Se usa el estado ACTUAL.
        const marks = hasMark 
            ? AWB_MANDATORY_FIELDS.find(f => f.key === "ISPM_15").SELLOS_OBLIGATORIOS 
            : ["No Mark"];
        
        try {
            const response = await apiClient.post('/cargo/validate/pallet', {
                shipment_id: shipmentId,
                is_wood_pallet: isWood,
                // Si es madera Y tiene marca, envía las marcas; si no, envía vacío o ["No Mark"]
                pallet_marks: isWood && hasMark ? marks : [] 
            });

            if (response.data.risk_level === 5) {
                // Mostrar advertencia crítica (Fija 6.7)
                setCriticalWarning(response.data.warning); 
            } else {
                setCriticalWarning(null);
            }
        } catch (error) {
            console.error("Error al validar pallet:", error);
            setCriticalWarning("Error de comunicación. Intente validar de nuevo.");
        }
    };
    
    // CRÍTICO: Disparar la validación CADA VEZ que el estado cambia
    useEffect(() => {
        // Dispara la validación cuando isWood o hasMark cambian
        handlePalletValidation();
    }, [isWood, hasMark, shipmentId]);


    return (
        <div className="validation-pallet-section">
            <h3>🪵 {AWB_MANDATORY_FIELDS.find(f => f.key === "ISPM_15").NORMA} (Obligatorio)</h3>
            <label>
                ¿Su pallet es de madera?
                <input type="checkbox" checked={isWood} onChange={(e) => setIsWood(e.target.checked)} />
            </label>

            {isWood && (
                <label>
                    ¿Tiene sello HT/ISPM-15 visible?
                    <input type="checkbox" checked={hasMark} onChange={(e) => setHasMark(e.target.checked)} />
                    {/* Eliminamos handlePalletValidation() de onChange para usar useEffect */}
                </label>
            )}
            
            {criticalWarning && (
                <div className="warning-box-critical">
                    {criticalWarning}
                    <p>✔ Pallets alternativos sugeridos: Plástico reforzado, Pallet prensado, EPAL.</p>
                </div>
            )}
        </div>
    );
};


// ==============================================================================
// 2. PhotoValidationSection (Señalización de Incompletitud)
// ==============================================================================
const PhotoValidationSection = ({ shipmentId, commodityDescription }) => {
    // Es necesario declarar los estados aquí (ej: iaAdvice, selectedImageFile)
    const [iaAdvice, setIaAdvice] = useState(null);
    const [selectedImageFile, setSelectedImageFile] = useState(null); 
    
    const handlePhotoUploadAndAnalyze = async () => {
        if (!selectedImageFile) {
            alert("Por favor, seleccione una imagen para el análisis.");
            return;
        }

        const formData = new FormData();
        formData.append('shipment_id', shipmentId);
        formData.append('commodity_description', commodityDescription);
        formData.append('image', selectedImageFile); // Usamos el estado declarado arriba
        
        try {
            const response = await apiClient.post('/cargo/validate/photo', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            setIaAdvice(response.data.ia_advice); 
            
            // Blindaje DG (6.5)
            if (response.data.dg_risk === "ALTO") {
                alert(response.data.warning); 
            }
        } catch (error) {
            alert("Error en el análisis de la foto. Intente de nuevo.");
        }
    };
    
    return (
        <div className="photo-validation">
            <h3>📸 Validación Fotográfica por IA (6.4)</h3>
            <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => setSelectedImageFile(e.target.files[0])} 
            />
            
            <button 
                onClick={handlePhotoUploadAndAnalyze} 
                disabled={!selectedImageFile}
            >
                Analizar Foto y Riesgos
            </button>
            
            {iaAdvice && (
                <div className="advice-box">
                    <strong>Sugerencia de la IA:</strong>
                    <p>{iaAdvice}</p>
                </div>
            )}
        </div>
    );
};


// ==============================================================================
// 3. TemperatureValidationComponent (Integración de Temperatura)
// ==============================================================================
const TemperatureValidationComponent = ({ shipmentId, commodity }) => {
    const [duration, setDuration] = useState(48);
    const [tempSuggestions, setTempSuggestions] = useState(null);

    const handleTempValidation = async () => {
        try {
            const response = await apiClient.post('/cargo/validate/temperature', {
                shipment_id: shipmentId,
                commodity: commodity, 
                // Se envía un rango fijo de ejemplo, idealmente derivado de la commodity
                required_temp_range: [2.0, 8.0], 
                duration_hours: duration
            });

            setTempSuggestions(response.data.recommendations);
        } catch (error) {
            console.error("Error al validar temperatura:", error);
        }
    };

    return (
        <div className="validation-temp-section">
            <h3>🌡 Validación de Temperatura (6.6)</h3>
            <label>
                Tiempo de tránsito (horas):
                <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} />
            </label>
            <button onClick={handleTempValidation}>Obtener Sugerencias Térmicas</button>
            
            {tempSuggestions && (
                <div className="suggestions-box">
                    <strong>SmartCargo Recomienda:</strong>
                    <ul>
                        {tempSuggestions.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                    {/* Recordatorio de DRY ICE DECLARADO (Contenido en la recomendación del backend) */}
                </div>
            )}
        </div>
    );
};

// Exporta todos los componentes necesarios
export { PalletValidationComponent, PhotoValidationSection, TemperatureValidationComponent };
