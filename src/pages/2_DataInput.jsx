// Smartcargo-Advisory/src/pages/2_DataInput.jsx (Fragmento de la función de envío)

import { CORE_LEGAL_DISCLAIMER } from '../requirements/legal_warning';
import apiClient from '../api/api_client'; // Para consumir el endpoint fijo

// ... (Lógica de estado y validación de formularios)

const handleSubmit = async () => {
    // 1. Recolectar datos del formulario de Medición y AWB
    const payload = {
        user_id: currentUser.id,
        length: form.length, 
        width: form.width,
        // ... (otros datos de AWB)
        commodity_type: form.commodity_type,
        // Nota: El mensaje legal se muestra en la UI, no se envía.
    };

    try {
        // 2. Llamada al Endpoint Fijo
        const response = await apiClient.post('/cargo/measurements', payload);
        
        // 3. Mostrar resultados de facturación y Navegar
        alert(`Peso Facturable Determinado: ${response.data.billing_weight} KG.`);
        navigate(`/pricing/${response.data.shipment_id}`); // Redirige a la selección de servicio
    
    } catch (error) {
        // Manejar el error de Guardarraíl DG (403)
        if (error.response && error.response.status === 403) {
            alert(error.response.data.message);
        } else {
            alert("Error al procesar la medición. Intente nuevamente.");
        }
    }
};

// ... (El componente JSX incluye el CORE_LEGAL_DISCLAIMER en el pie de página de la forma)
