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
