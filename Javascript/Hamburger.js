// Hamburger.js — menú móvil
// Se ejecuta en DOMContentLoaded para que el HTML ya esté listo

document.addEventListener('DOMContentLoaded', () => {

    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    const navUl = navbar.querySelector('ul');

    // Crear botón hamburguesa si no existe ya
    let hamburger = navbar.querySelector('.hamburger');
    if (!hamburger) {
        hamburger = document.createElement('button');
        hamburger.classList.add('hamburger');
        hamburger.setAttribute('aria-label', 'Abrir menú');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;
        navbar.appendChild(hamburger);
    }

    // Toggle menú
    hamburger.addEventListener('click', () => {
        const isOpen = navUl.classList.toggle('open');
        hamburger.classList.toggle('active', isOpen);
        hamburger.setAttribute('aria-expanded', isOpen);
        // Evitar scroll del body cuando el menú está abierto
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Cerrar al hacer clic en un enlace
    navUl.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navUl.classList.remove('open');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navUl.classList.contains('open')) {
            navUl.classList.remove('open');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
});