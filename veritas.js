// Configuración
const DEEPSEEK_API_KEY = 'sk-fc0f5a7667fc4de28981cc029fb70819'; // ¡Consíguela gratis en https://platform.deepseek.com/
const BACKUP_API_URL = 'https://veritas-backend.stirkar.workers.dev';

// Función principal de análisis
async function escanear() {
    const entidad = document.getElementById('entidad').value.trim();
    const resultadoDiv = document.getElementById('resultado');
    
    if (!entidad) {
        resultadoDiv.innerHTML = '<p class="error">⚠️ Por favor ingresa un nombre para analizar</p>';
        return;
    }
    
    // Mostrar estado de carga
    resultadoDiv.innerHTML = '<div class="cargando">🔍 Analizando con IA ética...</div>';
    
    try {
        // Primero intentamos con la API de DeepSeek
        const resultado = await escanearConDeepSeek(entidad);
        mostrarResultado(resultado);
        
    } catch (error) {
        console.error('Error con DeepSeek:', error);
        
        // Si falla, usamos el backend de respaldo GRATIS
        try {
            resultadoDiv.innerHTML = '<div class="cargando">🔍 Usando respaldo ético...</div>';
            const resultadoBackup = await escanearConRespaldo(entidad);
            mostrarResultado(resultadoBackup);
            
        } catch (backupError) {
            console.error('Error con respaldo:', backupError);
            resultadoDiv.innerHTML = `
                <p class="error">😞 Error temporal en el análisis</p>
                <p>Intenta de nuevo en unos minutos o prueba con otra entidad.</p>
            `;
        }
    }
}

// Escanear usando DeepSeek API
async function escanearConDeepSeek(entidad) {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: "deepseek-chat",
            messages: [
                {
                    role: "system",
                    content: `Eres el motor de análisis ético de VERITAS. Responde EXCLUSIVAMENTE en formato JSON válido con estas claves: 
                    {
                        "score": number (1-10),
                        "pros": [3 strings],
                        "cons": [3 strings],
                        "alternativas": [2 strings],
                        "fuentes": [3 URLs]
                    }`
                },
                {
                    role: "user",
                    content: `Analiza éticamente "${entidad}" usando fuentes actualizadas y verificables. 
                              Incluye aspectos positivos, negativos y alternativas éticas.`
                }
            ],
            temperature: 0.3,
            max_tokens: 1000
        })
    });
    
    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    const jsonResponse = data.choices[0].message.content;
    
    // Intentar parsear la respuesta JSON
    try {
        return JSON.parse(jsonResponse);
    } catch (e) {
        throw new Error('Respuesta no es JSON válido');
    }
}

// Escanear usando el backend de respaldo GRATIS
async function escanearConRespaldo(entidad) {
    const response = await fetch(`${BACKUP_API_URL}?entidad=${encodeURIComponent(entidad)}`);
    
    if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
    }
    
    return await response.json();
}

// Mostrar resultados en pantalla
function mostrarResultado(data) {
    let html = `
        <h2>Resultados para: ${document.getElementById('entidad').value}</h2>
        <div class="puntuacion">
            <span class="score">${data.score}</span>/10
        </div>
    `;
    
    html += `<div class="seccion">
                <h3>✅ Aspectos positivos</h3>
                <ul>${data.pros.map(p => `<li>${p}</li>`).join('')}</ul>
            </div>`;
    
    html += `<div class="seccion">
                <h3>⚠️ Áreas de mejora</h3>
                <ul>${data.cons.map(c => `<li>${c}</li>`).join('')}</ul>
            </div>`;
    
    html += `<div class="seccion">
                <h3>💡 Alternativas éticas</h3>
                <ul>${data.alternativas.map(a => `<li>${a}</li>`).join('')}</ul>
            </div>`;
    
    if (data.fuentes && data.fuentes.length > 0) {
        html += `<div class="seccion">
                    <h3>📚 Fuentes verificadas</h3>
                    <ul class="fuentes">${data.fuentes.map(f => `<li><a href="${f}" target="_blank">${acortarURL(f)}</a></li>`).join('')}</ul>
                </div>`;
    }
    
    document.getElementById('resultado').innerHTML = html;
}

// Función auxiliar para acortar URLs
function acortarURL(url) {
    const urlObj = new URL(url);
    return urlObj.hostname + (urlObj.pathname.length > 20 ? '[...]' : urlObj.pathname);
}
