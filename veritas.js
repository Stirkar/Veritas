async function escanear() {
    const entidad = document.getElementById('entidad').value;
    const resultadoDiv = document.getElementById('resultado');
    
    resultadoDiv.innerHTML = '<div class="cargando">🔍 Analizando con IA ética...</div>';
    
    try {
        const respuesta = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer sk-tu-api-key' // OBTÉN TU KEY GRATIS
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [
                    {
                        role: "system",
                        content: "Eres el motor ético de VERITAS. Analiza esta entidad y devuelve SOLO JSON con: {score: number, pros: [string], cons: [string], alternativas: [string], fuentes: [url]}"
                    },
                    {
                        role: "user",
                        content: `Analiza éticamente a ${entidad} usando fuentes actualizadas.`
                    }
                ],
                temperature: 0.3
            })
        });
        
        const data = await respuesta.json();
        const resultado = JSON.parse(data.choices[0].message.content);
        mostrarResultado(resultado);
        
    } catch (error) {
        resultadoDiv.innerHTML = `<p class="error'>Error: ${error.message}</p>`;
    }
}
