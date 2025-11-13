import React, { useState } from 'react';
import axios from 'axios';

// URL base de tu backend, Render se encargará de resolver '/api'
const API_BASE_URL = '/api'; 

const ShipmentForm = () => {
    const [formData, setFormData] = useState({
        clientEmail: '',
        destination: '',
        realWeight: '',
        dimensions: '' // Formato esperado: "LxWxH"
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('Procesando datos y optimizando... por favor, espera y revisa tu correo en breve.');

        try {
            // Llama a la ruta POST /api/submit-shipment
            const response = await axios.post(`${API_BASE_URL}/submit-shipment`, formData);
            setMessage(response.data.message + ' Revisa la bandeja de entrada y spam.');
            
            // Limpia el formulario
            setFormData({ clientEmail: '', destination: '', realWeight: '', dimensions: '' });

        } catch (error) {
            console.error('Error:', error.response?.data || error.message);
            setMessage('❌ Error al procesar: ' + (error.response?.data.message || 'Error de conexión.'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-10 bg-white shadow-xl rounded-xl">
            <h2 className="text-3xl font-extrabold mb-6 text-indigo-700 text-center">
                SmartCargo Advisory ✈️
            </h2>
            <p className="text-gray-600 mb-8 text-center">
                Asegura tu envío. Optimización de peso, dimensiones y revisión documental.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-700">Email (Recibirás el informe)</label>
                    <input type="email" name="clientEmail" value={formData.clientEmail} onChange={handleChange} required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="contacto@empresa.com"
                    />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="destination" className="block text-sm font-medium text-gray-700">Destino (País/Aeropuerto)</label>
                        <input type="text" name="destination" value={formData.destination} onChange={handleChange} required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3"
                                placeholder="MIA, CDMX, MAD..."
                        />
                    </div>
                    <div>
                        <label htmlFor="realWeight" className="block text-sm font-medium text-gray-700">Peso Real (Kg)</label>
                        <input type="number" name="realWeight" value={formData.realWeight} onChange={handleChange} required step="0.01"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3"
                                placeholder="Ej: 50.5"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="dimensions" className="block text-sm font-medium text-gray-700">Dimensiones (Largo x Ancho x Alto, en cm)</label>
                    <input type="text" name="dimensions" value={formData.dimensions} onChange={handleChange} required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3"
                            placeholder="Ej: 80x60x40"
                    />
                </div>
                
                <button type="submit" disabled={loading}
                        className="w-full bg-indigo-600 text-white p-4 rounded-md font-semibold hover:bg-indigo-700 disabled:bg-indigo-300 transition duration-150 shadow-md">
                    {loading ? 'Validando y enviando informe...' : 'Validar y Optimizar mi Envío por Asesoría'}
                </button>
            </form>
            
            {message && <p className={`mt-6 text-center text-base ${message.includes('❌') ? 'text-red-600' : 'text-green-600'}`}>{message}</p>}
        </div>
    );
};

export default ShipmentForm
