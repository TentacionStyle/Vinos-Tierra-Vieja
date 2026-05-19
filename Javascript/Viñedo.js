document.addEventListener('DOMContentLoaded', () => {
    // 1. Definimos los datos de los viñedos
    const viñedosProprios = [
        {
            title: "Viñedo 'El Pago': Cuna de nuestra Garnacha",
            ubicacion: "📍 Cariñena Alta",
            thumbnail: "./css/img/vinedo-pago.png", // Asegúrate de tener esta foto
            link: "viñedo-pago.html" // Página específica para este viñedo
        },
        {
            title: "Finca 'La Solana': Tradición y Cultivo Ecológico",
            ubicacion: "🌱 Cultivo Sostenible",
            thumbnail: "./css/img/vinedo-solana.png",
            link: "viñedo-solana.html"
        },
        {
            title: "Altos de Tierra Vieja: Viñas Centenarias",
            ubicacion: "🍇 Cepas de 100 años",
            thumbnail: "./css/img/vinedo-altos.png",
            link: "viñedo-altos.html"
        }
    ];

    const contenedor = document.getElementById('contenedor-noticias');
    
    // Limpiamos el contenedor por si hay algo escrito en el HTML
    contenedor.innerHTML = ''; 

    // 2. Generamos las tarjetas dinámicamente
    viñedosProprios.forEach(viñedo => {
        contenedor.innerHTML += `
            <article class="noticia-card">
                <img src="${viñedo.thumbnail}" class="noticia-img" alt="${viñedo.title}">
                <div class="noticia-info">
                    <span class="noticia-fecha">${viñedo.ubicacion}</span>
                    <h3 class="noticia-titulo">${viñedo.title}</h3>
                    <a href="${viñedo.link}" class="btn-leer-mas">Explorar Viñedo</a>
                </div>
            </article>
        `;
    });
});