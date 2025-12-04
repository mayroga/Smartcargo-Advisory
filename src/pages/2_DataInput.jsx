// src/pages/2_DataInput.jsx
import React, { useState, useEffect, useContext } from 'react';
import apiClient from '../api/api_client';
import { CORE_LEGAL_DISCLAIMER } from '../requirements/legal_warning';
import { AWB_MANDATORY_FIELDS } from '../requirements/awb_fields';

// Simple context para idioma (puedes integrar con i18n después)
const LanguageContext = React.createContext({ lang: 'en', setLang: () => {} });

const DataInputPage = ({ navigate, currentUser }) => {
  const [form, setForm] = useState({
    length: 0, width: 0, height: 0, unit: 'CM',
    real_weight: 0, commodity_type: '', shipper_name: '', consignee_name: '', airport_code: ''
  });
  const [loading, setLoading] = useState(false);
  const { lang, setLang } = useContext(LanguageContext);

  useEffect(() => {
    // Priorizar idioma español para tu audiencia hispana (visible botón)
    if (!lang) setLang('es');
    // Mostrar advertencia legal cuando se monta
    console.log("SmartCargo: recuerde que somos asesores, no certificadores.");
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    // Validaciones básicas UI
    if (!form.length || !form.width || !form.height || !form.real_weight) {
      alert(lang === 'es' ? 'Complete las medidas y peso reales.' : 'Please complete length/width/height and real weight.');
      return;
    }

    const payload = {
      user_id: currentUser?.id,
      length: parseFloat(form.length),
      width: parseFloat(form.width),
      height: parseFloat(form.height),
      real_weight: parseFloat(form.real_weight),
      unit: form.unit,
      commodity_type: form.commodity_type,
      shipper_name: form.shipper_name,
      consignee_name: form.consignee_name,
      airport_code: form.airport_code
      // Nota: no enviamos disclaimers al backend - se guardan en el servidor automáticamente
    };

    setLoading(true);
    try {
      const response = await apiClient.post('/cargo/measurements', payload);
      alert((lang === 'es' ? 'Peso Facturable:' : 'Billing weight:') + ` ${response.data.billing_weight} KG.`);
      // navegar a pricing
      navigate(`/pricing/${response.data.shipment_id}`);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        alert(error.response.data.message);
      } else {
        console.error(error);
        alert(lang === 'es' ? 'Error al procesar la medición. Intente nuevamente.' : 'Error processing measurement. Try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      <div className="data-input-page">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>{lang === 'es' ? 'SmartCargo - Ingreso de Datos' : 'SmartCargo - Data Input'}</h1>
          <div>
            {/* Botón de cambio de idioma, visible y obligatorio */}
            <button onClick={() => setLang(lang === 'es' ? 'en' : 'es')}>
              {lang === 'es' ? 'EN' : 'ES'}
            </button>
          </div>
        </header>

        <section>
          <p style={{ color: '#444' }}>
            {lang === 'es'
              ? 'Recuerde: SmartCargo es asesoría preventiva. No sustituye a su forwarder ni certifica DG.'
              : 'Reminder: SmartCargo provides advisory checks. We do not replace your forwarder nor certify DG.'}
          </p>

          <div className="form-grid">
            <label>Length ({form.unit})
              <input name="length" type="number" value={form.length} onChange={handleChange} />
            </label>
            <label>Width ({form.unit})
              <input name="width" type="number" value={form.width} onChange={handleChange} />
            </label>
            <label>Height ({form.unit})
              <input name="height" type="number" value={form.height} onChange={handleChange} />
            </label>
            <label>Real Weight (KG)
              <input name="real_weight" type="number" value={form.real_weight} onChange={handleChange} />
            </label>

            <label>Commodity Type
              <input name="commodity_type" type="text" value={form.commodity_type} onChange={handleChange} placeholder="e.g. baterías, flores, textil..." />
            </label>
            <label>Shipper Name
              <input name="shipper_name" type="text" value={form.shipper_name} onChange={handleChange} />
            </label>
            <label>Consignee Name
              <input name="consignee_name" type="text" value={form.consignee_name} onChange={handleChange} />
            </label>
            <label>Airport Code
              <input name="airport_code" type="text" value={form.airport_code} onChange={handleChange} placeholder="MIA" />
            </label>
          </div>

          <div style={{ marginTop: 12 }}>
            <small style={{ color: '#666' }}>
              {CORE_LEGAL_DISCLAIMER}
            </small>
          </div>

          <div style={{ marginTop: 18 }}>
            <button onClick={handleSubmit} disabled={loading}>
              {loading ? (lang === 'es' ? 'Procesando...' : 'Processing...') : (lang === 'es' ? 'Calcular y Continuar' : 'Calculate & Continue')}
            </button>
          </div>
        </section>

        <footer style={{ marginTop: 24 }}>
          <small>{lang === 'es' ? 'Aviso legal:' : 'Legal notice:'} {CORE_LEGAL_DISCLAIMER}</small>
        </footer>
      </div>
    </LanguageContext.Provider>
  );
};

export default DataInputPage;
