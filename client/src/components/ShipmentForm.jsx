import React, { useState } from 'react';
import axios from 'axios';
const API_BASE_URL = '/api';

const ShipmentForm = () => {
    const [formData,setFormData] = useState({ clientEmail:'', destination:'', realWeight:'', dimensions:'' });
    const [message,setMessage] = useState('');
    const [loading,setLoading] = useState(false);

    const handleChange = e => setFormData({...formData, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setMessage('Procesando datos y optimizando...');

        try{
            const response = await axios.post(`${API_BASE_URL}/submit-shipment`, formData);
            setMessage(response.data.message + ' Revisa correo y spam.');
            setFormData({ clientEmail:'', destination:'', realWeight:'', dimensions:'' });
        } catch(error){
            console.error(error);
            setMessage('❌ Error al procesar: '+ (error.response?.data.message || 'Error de conexión.'));
        } finally{
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-10 bg-white shadow-xl rounded-xl">
            <h2 className="text-3xl font-extrabold mb-6 text-indigo-700 text-center">SmartCargo Advisory ✈️</h2>
            <p className="text-gray-600 mb-8 text-center">Asegura tu envío. Optimización de peso, dimensiones y revisión documental.</p>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label>Email</label>
                    <input type="email" name="clientEmail" value={formData.clientEmail} onChange={handleChange} required placeholder="contacto@empresa.com"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3"/>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label>Destino</label>
                        <input type="text" name="destination" value={formData.destination} onChange={handleChange} required placeholder="MIA, CDMX..."
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3"/>
                    </div>
                    <div>
                        <label>Peso Real (Kg)</label>
                        <input type="number" name="realWeight" value={formData.realWeight} onChange={handleChange} required step="0.01" placeholder="Ej: 50.5"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3"/>
                    </div>
                </div>
                <div>
                    <label>Dimensiones (LxWxH en cm)</label>
                    <input type="text" name="dimensions" value={formData.dimensions} onChange={handleChange} required placeholder="Ej: 80x60x40"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3"/>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white p-4 rounded-md font-semibold hover:bg-indigo-700 disabled:bg-indigo-300">
                    {loading ? 'Validando y enviando...' : 'Validar y Optimizar mi Envío'}
                </button>
            </form>
            {message && <p className={`mt-6 text-center text-base ${message.includes('❌')?'text-red-600':'text-green-600'}`}>{message}</p>}
        </div>
    );
};

export default ShipmentForm;
