// Función principal de análisis
async function escanear() {
    const entidad = document.getElementById('entidad').value.trim();
    const resultadoDiv = document.getElementById('resultado');
    
    if (!entidad) {
        resultadoDiv.innerHTML = '<p class="error">⚠️ Por favor ingresa un nombre</p>';
        return;
    }
    
    resultadoDiv.innerHTML = '<div class="cargando">🔍 Analizando con IA ética...</div>';
    
    try {
        // Usar el backend REAL que acabo de crear
        const response = await fetch('https://veritas-backend.stirkar.workers.dev', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ entidad })
        });
        
        if (!response.ok) throw new Error('Error del backend');
        
        const resultado = await response.json();
        mostrarResultado(resultado);
        
    } catch (error) {
        console.error(error);
        resultadoDiv.innerHTML = `
            <div class="error">
                <p>😞 Error temporal en el análisis</p>
                <p>Pero aquí tienes un análisis de ejemplo:</p>
                ${generarEjemplo(entidad)}
            </div>
        `;
    }
}

function generarEjemplo(entidad) {
    return `
        <div class="seccion">
            <h3>✅ Aspectos positivos de ${entidad}</h3>
            <ul>
                <li>Compromiso con energías renovables</li>
                <li>Programas de apoyo a comunidades locales</li>
            </ul>
        </div>
        <div class="seccion">
            <h3>⚠️ Áreas de mejora</h3>
            <ul>
                <li>Huella de carbono elevada en transporte</li>
                <li>Falta de transparencia en cadena de suministro</li>
            </ul>
        </div>
        <div class="seccion">
            <h3>💡 Alternativas éticas</h3>
            <ul>
                <li>${entidad} Sostenible</li>
                <li>Eco-${entidad}</li>
            </ul>
        </div>
    `;
}

// Mostrar resultados en pantalla
function mostrarResultado(data) {
    let html = `
        <h2>Resultados para: ${document.getElementById('entidad').value}</h2>
        <div class="puntuacion">
            <span class="score">${data.score}</span>/10
        </div>
    `;
    
    if (data.pros && data.pros.length > 0) {
        html += `<div class="seccion">
                    <h3>✅ Aspectos positivos</h3>
                    <ul>${data.pros.map(p => `<li>${p}</li>`).join('')}</ul>
                </div>`;
    }
    
    if (data.cons && data.cons.length > 0) {
        html += `<div class="seccion">
                    <h3>⚠️ Áreas de mejora</h3>
                    <ul>${data.cons.map(c => `<li>${c}</li>`).join('')}</ul>
                </div>`;
    }
    
    if (data.alternativas && data.alternativas.length > 0) {
        html += `<div class="seccion">
                    <h3>💡 Alternativas éticas</h3>
                    <ul>${data.alternativas.map(a => `<li>${a}</li>`).join('')}</ul>
                </div>`;
    }
    
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
    try {
        const urlObj = new URL(url);
        return urlObj.hostname + (urlObj.pathname.length > 20 ? '[...]' : urlObj.pathname);
    } catch {
        return url.slice(0, 50) + (url.length > 50 ? '...' : '');
    }
}
