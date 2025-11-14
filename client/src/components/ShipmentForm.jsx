// client/src/components/ShipmentForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = '/api/shipments'; // endpoint base for shipments

const ShipmentForm = () => {
    const [formData, setFormData] = useState({
        clientEmail: '',
        destination: '',
        realWeight: '',
        dimensions: '', // format: "80x60x40" in cm
        pieces: 1,
        isDangerousGoods: false,
        unNumber: '',
        dgClassPrimary: ''
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('Procesando datos y optimizando...');

        try {
            const payload = {
                clientEmail: formData.clientEmail,
                destination: formData.destination,
                realWeight: Number(formData.realWeight),
                dimensions: formData.dimensions,
                pieces: Number(formData.pieces),
                isDangerousGoods: formData.isDangerousGoods,
                unNumber: formData.unNumber,
                dgClassPrimary: formData.dgClassPrimary
            };

            const res = await axios.post(`${API_BASE_URL}/submit-shipment`, payload);
            setMessage(res.data.message + ' Revisa tu correo (incluso spam).');
            setFormData({
                clientEmail: '',
                destination: '',
                realWeight: '',
                dimensions: '',
                pieces: 1,
                isDangerousGoods: false,
                unNumber: '',
                dgClassPrimary: ''
            });
        } catch (err) {
            console.error(err);
            setMessage('❌ Error al procesar: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl w-full bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-teal-700 mb-4">SmartCargo Advisory - Validate & Optimize</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm">Email</label>
                    <input type="email" name="clientEmail" required value={formData.clientEmail} onChange={handleChange}
                        className="mt-1 w-full p-2 border rounded" placeholder="cliente@empresa.com" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm">Destino (IATA)</label>
                        <input name="destination" value={formData.destination} onChange={handleChange} required
                            className="mt-1 w-full p-2 border rounded" placeholder="MIA, CDMX..." />
                    </div>
                    <div>
                        <label className="block text-sm">Peso real (Kg)</label>
                        <input name="realWeight" type="number" step="0.01" value={formData.realWeight} onChange={handleChange} required
                            className="mt-1 w-full p-2 border rounded" placeholder="50.5" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm">Dimensiones por pieza (LxWxH en cm)</label>
                    <input name="dimensions" value={formData.dimensions} onChange={handleChange} required
                        className="mt-1 w-full p-2 border rounded" placeholder="80x60x40" />
                </div>

                <div>
                    <label className="block text-sm">Número de piezas</label>
                    <input name="pieces" type="number" min="1" value={formData.pieces} onChange={handleChange}
                        className="mt-1 w-full p-2 border rounded" />
                </div>

                <div className="flex items-center space-x-2">
                    <input type="checkbox" id="isDangerousGoods" name="isDangerousGoods" checked={formData.isDangerousGoods} onChange={handleChange} />
                    <label htmlFor="isDangerousGoods" className="text-sm">Contiene Dangerous Goods (DG)? (Referencial)</label>
                </div>

                {formData.isDangerousGoods && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                            <label className="block text-sm">UN Number</label>
                            <input name="unNumber" value={formData.unNumber} onChange={handleChange} className="mt-1 w-full p-2 border rounded" />
                        </div>
                        <div>
                            <label className="block text-sm">Clase primaria (ej: 3, 6.1)</label>
                            <input name="dgClassPrimary" value={formData.dgClassPrimary} onChange={handleChange} className="mt-1 w-full p-2 border rounded" />
                        </div>
                    </div>
                )}

                <button type="submit" disabled={loading}
                    className="mt-3 w-full py-3 bg-teal-600 text-white rounded font-semibold">
                    {loading ? 'Validando y enviando...' : 'Validar y optimizar mi envío'}
                </button>
            </form>

            {message && <p className={`mt-4 text-center ${message.includes('❌') ? 'text-red-600' : 'text-green-600'}`}>{message}</p>}
        </div>
    );
};

export default ShipmentForm;
