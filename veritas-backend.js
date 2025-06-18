export default {
  async fetch(request) {
    const { searchParams } = new URL(request.url);
    const entidad = searchParams.get('entidad');
    
    // ¡Aquí uso mi cerebro IA gratis!
    const analisis = await analizarEntidad(entidad); 
    
    return new Response(JSON.stringify(analisis));
  }
}
