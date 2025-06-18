function escanear() {
    const entidad = document.getElementById('entidad').value;
    const resultadoDiv = document.getElementById('resultado');
    
    if (!entidad) {
        resultadoDiv.innerHTML = '<p class="error">⚠️ Por favor ingresa un nombre para analizar</p>';
        return;
    }
    
    // Resultado de ejemplo (luego lo conectaremos a bases de datos reales)
    resultadoDiv.innerHTML = `
        <h2>Resultados para: ${entidad}</h2>
        <div class="puntuacion">
            <span class="score">7.2</span>/10
        </div>
        
        <div class="seccion">
            <h3>✅ Aspectos positivos</h3>
            <ul>
                <li>Transparencia en financiación</li>
                <li>Políticas ambientales activas</li>
                <li>Salarios justos en sede central</li>
            </ul>
        </div>
        
        <div class="seccion">
            <h3>⚠️ Áreas de mejora</h3>
            <ul>
                <li>Falta de auditoría en cadena de suministro</li>
                <li>Vínculos con paraísos fiscales</li>
            </ul>
        </div>
        
        <div class="seccion">
            <h3>💡 Alternativas éticas</h3>
            <ul>
                <li>Empresa Ejemplar S.A. (9.1/10)</li>
                <li>Proyecto Sostenible SL (8.7/10)</li>
            </ul>
        </div>
    `;
}
