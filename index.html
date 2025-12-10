<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SmartCargo-AIPA: Asesoría Preventiva</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body { background-color: #f8f9fa; }
        .header-section { background-color: #004c99; color: white; padding: 20px 0; }
        .alertaScore {
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            font-weight: bold;
            margin-bottom: 20px;
        }
        .score-low { background-color: #d4edda; color: #155724; border: 2px solid #155724; } /* Verde */
        .score-medium { background-color: #fff3cd; color: #856404; border: 2px solid #856404; } /* Amarillo */
        .score-high { background-color: #f0ad4e3b; color: #f0ad4e; border: 2px solid #f0ad4e; } /* Naranja */
        .score-critical { background-color: #f8d7da; color: #721c24; border: 2px solid #721c24; } /* Rojo */
        .score-value { font-size: 2.5em; display: block; }
        .score-label { font-size: 1em; display: block; }
        .border-left-danger { border-left: 5px solid #dc3545!important; }
    </style>
</head>
<body>

    <div class="header-section mb-5">
        <div class="container text-center">
            <h1>SmartCargo-AIPA 🚀</h1>
            <p class="lead">Asesor Preventivo de Inteligencia Artificial para la Carga Aérea (MIA/TPA/ORL).</p>
        </div>
    </div>

    <div class="container">
        <div id="valuePropositionContainer">
            </div>

        <div class="row">
            <div class="col-md-6">
                <div class="card shadow mb-4">
                    <div class="card-header bg-primary text-white">
                        <h5>Consola Operacional AIPA (Pre-Validación)</h5>
                        <p class="mb-0 small">Para Forwarders, Camioneros y Counter Agents. **Ahorre Dinero y Evite Retornos.**</p>
                    </div>
                    <div class="card-body">
                        <form id="cargoValidationForm">
                            <div class="mb-3"><label class="form-label">AWB (Guía Aérea)</label><input type="text" class="form-control" name="awb" value="AV-12345678" required></div>
                            <div class="mb-3"><label class="form-label">Contenido de la Carga</label><input type="text" class="form-control" name="content" value="Partes de Maquinaria" required></div>
                            <div class="row">
                                <div class="col-4 mb-3"><label class="form-label">Largo (cm)</label><input type="number" step="0.01" class="form-control" name="length_cm" value="120" required></div>
                                <div class="col-4 mb-3"><label class="form-label">Ancho (cm)</label><input type="number" step="0.01" class="form-control" name="width_cm" value="100" required></div>
                                <div class="col-4 mb-3"><label class="form-label">Alto (cm)</label><input type="number" step="0.01" class="form-control" name="height_cm" value="220" required></div>
                            </div>
                            <div class="row">
                                <div class="col-6 mb-3"><label class="form-label">Peso Declarado (kg)</label><input type="number" step="0.01" class="form-control" name="weight_declared" value="500" required></div>
                                <div class="col-6 mb-3"><label class="form-label">Unidad de Peso</label><select class="form-select" name="weight_unit"><option>kg</option><option>lbs</option></select></div>
                            </div>
                            
                            <h6 class="mt-3">Inspección Física (Puntos Críticos)</h6>
                            <div class="mb-3"><label class="form-label">Integridad del Embalaje</label>
                                <select class="form-select" name="packing_integrity"><option value="OK">OK</option><option value="MINOR">Menor Daño</option><option value="CRITICAL">CRÍTICO (Roto/Fuga)</option></select>
                            </div>
                            <div class="mb-3"><label class="form-label">¿Etiquetas/Documentos DG Completos?</label>
                                <select class="form-select" name="labeling_complete"><option value="YES">Sí</option><option value="NO">No (R004/R007)</option></select>
                            </div>
                            <div class="mb-3"><label class="form-label">¿Sello ISPM-15 visible?</label>
                                <select class="form-select" name="ispm15_seal"><option value="YES">Sí</option><option value="NO">No (R001)</option></select>
                            </div>
                            <div class="mb-3"><label class="form-label">Tipo de Mercancía Peligrosa (DG)</label>
                                <select class="form-select" name="dg_type"><option value="NO_DG">NO DG</option><option value="LITHIUM">Litio</option><option value="HAZMAT">Otro HAZMAT</option></select>
                            </div>
                            <div class="mb-3"><label class="form-label">¿Separación DG OK?</label>
                                <select class="form-select" name="dg_separation"><option value="OK">OK</option><option value="MIXED">Mezclada con Incompatibles (R005)</option></select>
                            </div>
                            <div class="mb-3"><label class="form-label">¿Peso/AWB Coincide?</label>
                                <select class="form-select" name="weight_match"><option value="YES">Sí</option><option value="NO">No (R006)</option></select>
                            </div>

                            <button type="submit" class="btn btn-success w-100 mt-3">Validar Carga AIPA</button>
                        </form>
                    </div>
                </div>
            </div>

            <div class="col-md-6">
                <div class="card shadow mb-4">
                    <div class="card-header bg-warning text-dark">
                        <h5>Resultado de la Auditoría Preventiva</h5>
                        <p class="mb-0 small">El objetivo es 0% de riesgo.</p>
                    </div>
                    <div class="card-body">
                        <div id="alertaScoreDisplay" class="alertaScore score-low">
                             <span class="score-value">0%</span>
                             <span class="score-label">RIESGO DE HOLD O RECHAZO</span>
                        </div>
                        <div id="alertsList">
                             <p class="text-secondary">Introduzca los datos y valide la carga para ver las alertas.</p>
                        </div>
                        <div id="nextSteps"></div>
                    </div>
                </div>

                <div class="card shadow">
                    <div class="card-header bg-secondary text-white">
                        <h5>SmartCargo Consulting (AI)</h5>
                        <p class="mb-0 small">Su Consultor IATA/TSA/Logístico. Respuestas **Concisas y Soluciones Inmediatas**.</p>
                    </div>
                    <div class="card-body">
                        <form id="advisoryForm">
                            <div class="mb-3">
                                <label for="advisoryPrompt" class="form-label">Pregunte al Asesor (Ej: "¿Cómo corrijo la Alerta R001?")</label>
                                <input type="text" class="form-control" id="advisoryPrompt" placeholder="Escriba su duda aquí...">
                            </div>
                            <button type="submit" class="btn btn-secondary w-100">Consultar al Asesor AI</button>
                        </form>
                        <div class="mt-3" id="advisory_response">
                            <p class="text-muted small">El Asesor siempre le dará la solución más rápida para evitar el Hold.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    
    <script type="module" src="./standards.js"></script>
    <script type="module" src="./app.js"></script>

</body>
</html>
