// Smartcargo-Advisory/src/pages/3_Validation.jsx (Fragmento de manejo de Pallets)

import apiClient from '../api/api_client';
import { AWB_MANDATORY_FIELDS } from '../requirements/awb_fields';

const PalletValidationComponent = ({ shipmentId }) => {
    // Estado para la entrada del usuario
    const [isWood, setIsWood] = useState(false);
    const [hasMark, setHasMark] = useState(false);
    const [criticalWarning, setCriticalWarning] = useState(null);

    const handlePalletValidation = async () => {
        const marks = hasMark ? AWB_MANDATORY_FIELDS.find(f => f.key === "ISPM_15").SELLOS_OBLIGATORIOS : ["No Mark"];
        
        try {
            const response = await apiClient.post('/cargo/validate/pallet', {
                shipment_id: shipmentId,
                is_wood_pallet: isWood,
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
                    <input type="checkbox" checked={hasMark} onChange={(e) => {setHasMark(e.target.checked); handlePalletValidation();}} />
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
// Smartcargo-Advisory/src/pages/3_Validation.jsx (Fragmento de la función de envío de fotos)

// ... (Importaciones existentes)

const PhotoValidationSection = ({ shipmentId, commodityDescription }) => {
    // ... (Estados para manejo de archivos y resultados)

    const handlePhotoUploadAndAnalyze = async () => {
        const formData = new FormData();
        formData.append('shipment_id', shipmentId);
        formData.append('commodity_description', commodityDescription);
        // formData.append('image', selectedImageFile); // El archivo de la imagen
        
        try {
            // Llamada al nuevo Endpoint Fijo
            const response = await apiClient.post('/cargo/validate/photo', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            // Mostrar la sugerencia suave de la IA (6.4)
            setIaAdvice(response.data.ia_advice); 
            
            // Mostrar la advertencia DG crítica si aplica (6.5)
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
            {/* Componente de subida de archivos */}
            <button onClick={handlePhotoUploadAndAnalyze}>Analizar Foto y Riesgos</button>
            {iaAdvice && (
                <div className="advice-box">
                    <strong>Sugerencia de la IA:</strong>
                    <p>{iaAdvice}</p>
                </div>
            )}
        </div>
    );
};
// Smartcargo-Advisory/src/pages/3_Validation.jsx (Fragmento de integración de temperatura)

// ... (Importaciones existentes)

const TemperatureValidationComponent = ({ shipmentId, commodity }) => {
    const [duration, setDuration] = useState(48);
    const [tempSuggestions, setTempSuggestions] = useState(null);

    const handleTempValidation = async () => {
        try {
            // 1. Llamada al nuevo Endpoint Fijo
            const response = await apiClient.post('/cargo/validate/temperature', {
                shipment_id: shipmentId,
                commodity: commodity, 
                required_temp_range: [2.0, 8.0], // Asumiendo un rango común de ejemplo
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
                    {/* Recordatorio de DRY ICE DECLARADO si se sugiere */}
                </div>
            )}
        </div>
    );
};
