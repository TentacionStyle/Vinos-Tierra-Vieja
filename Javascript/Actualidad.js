document.addEventListener('DOMContentLoaded', () => {
        const noticiasIntegadas = [
            {
                title: "La vendimia de este año destaca por la excelente calidad de la uva Garnacha",
                pubDate: "2026-02-25",
                thumbnail: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                link: "#"
            },
            {
                title: "El auge de los vinos ecológicos: Cómo la sostenibilidad cambia el sabor en la copa",
                pubDate: "2026-02-20",
                thumbnail: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                link: "#"
            },
            {
                title: "Tierra Vieja anuncia nuevas rutas de enoturismo para esta primavera",
                pubDate: "2026-02-15",
                thumbnail: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                link: "#"
            },
            //{
               // title: "El cambio climático obliga a los bodegueros a adaptar sus técnicas de recolección",
                //pubDate: "2026-02-10",
                // ¡SOLUCIÓN FINAL! Usamos tu propia foto local de los viñedos.
                // Al estar en tu ordenador, no hay bloqueos de internet posibles.
                //thumbnail: "./css/img/Viñedos.png",
                //link: "#"
            //}
        ];

        const contenedor = document.getElementById('contenedor-noticias');
        contenedor.innerHTML = ''; 

        noticiasIntegadas.forEach(noticia => {
            contenedor.innerHTML += `
                <article class="noticia-card">
                    <img src="${noticia.thumbnail}" class="noticia-img" alt="Imagen de la noticia">
                    <div class="noticia-info">
                        <span class="noticia-fecha">📅 ${noticia.pubDate}</span>
                        <h3 class="noticia-titulo">${noticia.title}</h3>
                        <a href="${noticia.link}" class="btn-leer-mas">Leer artículo completo</a>
                    </div>
                </article>
            `;
        });
    });