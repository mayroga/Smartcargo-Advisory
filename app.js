import os
import stripe
import httpx
import base64
from fastapi import FastAPI, Form, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

app = FastAPI()

# Configuración de CORS para permitir conexión desde tu index.html
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# VARIABLES DE ENTORNO (Configúralas en Render)
STRIPE_KEY = os.getenv("STRIPE_SECRET_KEY")
GEMINI_KEY = os.getenv("GEMINI_API_KEY")
ADMIN_USER = os.getenv("ADMIN_USERNAME")
ADMIN_PASS = os.getenv("ADMIN_PASSWORD")

stripe.api_key = STRIPE_KEY

class CargoAudit(BaseModel):
    awb: str
    length: float
    width: float
    height: float
    weight: float
    ispm15_seal: str
    unit_system: str

# 1. MOTOR DE AUDITORÍA
@app.post("/cargas")
async def process_audit(cargo: CargoAudit):
    alerts = []
    score = 0
    is_in = cargo.unit_system == "in"
    
    L_cm = cargo.length * 2.54 if is_in else cargo.length
    H_cm = cargo.height * 2.54 if is_in else cargo.height
    W_cm = cargo.width * 2.54 if is_in else cargo.width
    
    vol_m3 = (L_cm * W_cm * H_cm) / 1_000_000
    factor_v = 166 if is_in else 6000
    peso_v = (cargo.length * cargo.width * cargo.height) / factor_v

    if H_cm > 158:
        alerts.append("ALTURA CRÍTICA: Supera 158cm. No apto para cabina estrecha (Narrow Body).")
        score += 35
    if cargo.ispm15_seal == "NO":
        alerts.append("RIESGO FITOSANITARIO: Madera sin sello ISPM-15 detectada.")
        score += 40
    
    return {
        "score": min(score, 100),
        "alerts": alerts,
        "details": f"{vol_m3:.3f} m³ | Vol-Weight: {peso_v:.2f}"
    }

# 2. ASESOR IA HÍBRIDO
@app.post("/advisory")
async def advisory_vision(prompt: str = Form(...), image: Optional[UploadFile] = File(None)):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_KEY}"
    
    parts = [{"text": f"Eres SMARTCARGO CONSULTING. Experto en IATA. Responde breve y técnico: {prompt}"}]
    
    if image:
        img_bytes = await image.read()
        parts.append({
            "inline_data": {
                "mime_type": image.content_type,
                "data": base64.b64encode(img_bytes).decode("utf-8")
            }
        })
    
    payload = {"contents": [{"parts": parts}]}
    async with httpx.AsyncClient() as client:
        try:
            r = await client.post(url, json=payload, timeout=30.0)
            return {"data": r.json()["candidates"][0]["content"]["parts"][0]["text"]}
        except:
            return {"data": "Error: Verifica tu Gemini Key o conexión."}

# 3. PAGOS Y BYPASS ADMIN
@app.post("/create-payment")
async def payment(amount: float = Form(...), awb: str = Form(...), 
                  user: Optional[str] = Form(None), 
                  password: Optional[str] = Form(None)):
    
    # Bypass para el dueño (Tú)
    if user == ADMIN_USER and password == ADMIN_PASS:
        return {"url": f"https://smartcargo-aipa.onrender.com/index.html?access=granted&awb={awb}"}
    
    # Cobro para clientes
    session = stripe.checkout.Session.create(
        payment_method_types=["card"],
        line_items=[{"price_data": {"currency": "usd", "product_data": {"name": f"Audit {awb}"}, "unit_amount": int(amount * 100)}, "quantity": 1}],
        mode="payment",
        success_url=f"https://smartcargo-aipa.onrender.com/index.html?access=granted&awb={awb}",
        cancel_url="https://smartcargo-aipa.onrender.com/index.html"
    )
    return {"url": session.url}
