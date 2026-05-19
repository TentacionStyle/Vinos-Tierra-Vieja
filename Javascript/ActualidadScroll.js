/**
 * ActualidadScroll.js
 * Maneja el scroll horizontal de la sección "Más Noticias" con las flechas de navegación.
 */

document.addEventListener('DOMContentLoaded', () => {
    const scrollGrid = document.getElementById('contenedor-noticias');
    const btnPrev = document.getElementById('btn-prev-bottom');
    const btnNext = document.getElementById('btn-next-bottom');

    if (!scrollGrid || !btnPrev || !btnNext) return;

    // Cantidad a desplazar (ancho de una tarjeta + gap)
    const getScrollAmount = () => {
        const firstCard = scrollGrid.querySelector('.act-card');
        if (firstCard) {
            return firstCard.clientWidth + 30; // 30 es el gap que dejó el usuario
        }
        return 350; 
    };

    // Ajustar el scrollLeft inicial si hay padding
    // El scrollGrid.scrollLeft por defecto es 0, pero con padding 40px, queremos que la primera tarjeta esté alineada.
    // En este caso, el padding está en el WRAPPER, no en el GRID, así que no afecta al scrollLeft.


    btnNext.addEventListener('click', () => {
        scrollGrid.scrollBy({
            left: getScrollAmount(),
            behavior: 'smooth'
        });
    });

    btnPrev.addEventListener('click', () => {
        scrollGrid.scrollBy({
            left: -getScrollAmount(),
            behavior: 'smooth'
        });
    });

    // Opcional: Desactivar flechas si llegamos al inicio o final
    const toggleArrows = () => {
        const scrollLeft = scrollGrid.scrollLeft;
        const maxScroll = scrollGrid.scrollWidth - scrollGrid.clientWidth;

        // Mostrar u ocultar flechas según posición
        // Usamos un pequeño margen de error (10px) para el scroll
        btnPrev.style.opacity = scrollLeft <= 10 ? '0' : '1';
        btnPrev.style.pointerEvents = scrollLeft <= 10 ? 'none' : 'auto';

        btnNext.style.opacity = (scrollLeft >= maxScroll - 10 || maxScroll <= 0) ? '0' : '1';
        btnNext.style.pointerEvents = (scrollLeft >= maxScroll - 10 || maxScroll <= 0) ? 'none' : 'auto';
    };

    scrollGrid.addEventListener('scroll', toggleArrows);
    window.addEventListener('resize', toggleArrows);
    
    // Escuchar cambios en los filtros de categoría para actualizar las flechas
    document.querySelectorAll('.act-cat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Un pequeño delay para permitir que el DOM se actualice (display: none/flex)
            setTimeout(toggleArrows, 50);
        });
    });

    // Inicializar estado de flechas
    setTimeout(toggleArrows, 100);
});
