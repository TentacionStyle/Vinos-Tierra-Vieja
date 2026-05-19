/**
 * Scroll.js
 * Maneja la visibilidad de la barra de navegación y el carrito de compras
 * Basado en el desplazamiento del usuario.
 */

window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    const cart = document.querySelector('.container-carrito');
    
    // Umbral de scroll (70% de la altura de la página de inicio o hero)
    const threshold = window.innerHeight * 0.7;

    if (window.scrollY > threshold) {
        if (navbar) navbar.classList.add('scrolled');
        if (cart) cart.classList.add('scrolled');
    } else {
        if (navbar) navbar.classList.remove('scrolled');
        if (cart) cart.classList.remove('scrolled');
    }
});

// También ejecutar al cargar por si la página ya está desplazada
window.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    const cart = document.querySelector('.container-carrito');
    const threshold = window.innerHeight * 0.7;
    
    if (window.scrollY > threshold) {
        if (navbar) navbar.classList.add('scrolled');
        if (cart) cart.classList.add('scrolled');
    }
});
