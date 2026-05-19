/**
 * Verificación de edad – Normativa española (Ley 28/2005)
 * Muestra el modal UNA sola vez por navegador (cookie de 365 días).
 * Incluir este script en TODOS los HTML del sitio.
 */

(function () {
  const COOKIE_NAME = "tvMayorEdad";
  const COOKIE_DAYS = 365;

  /* ── Leer cookie ─────────────────────────────────────────────── */
  function getCookie(name) {
    const match = document.cookie.match(
      new RegExp("(?:^|; )" + name + "=([^;]*)")
    );
    return match ? decodeURIComponent(match[1]) : null;
  }

  /* ── Escribir cookie ─────────────────────────────────────────── */
  function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie =
      name + "=" + encodeURIComponent(value) +
      "; expires=" + expires +
      "; path=/; SameSite=Lax";
  }

  /* ── Si ya verificó, no hacer nada ──────────────────────────── */
  if (getCookie(COOKIE_NAME) === "1") return;

  /* ── Inyectar HTML del modal ─────────────────────────────────── */
  const overlay = document.createElement("div");
  overlay.id = "tvAgeOverlay";
  overlay.innerHTML = `
    <div id="tvAgeModal" role="dialog" aria-modal="true" aria-labelledby="tvAgeTitle">
      <div class="tvAge-logo">
        <img src="/css/img/logotipo.png" alt="Tierra Vieja" onerror="this.style.display='none'">
      </div>
      <h2 id="tvAgeTitle">Acceso restringido</h2>
      <p>Este sitio web contiene información sobre <strong>bebidas alcohólicas</strong>.<br>
         Para continuar, confirma que tienes <strong>18 años o más</strong>.</p>
      <div class="tvAge-actions">
        <button id="tvAgeSi" class="tvAge-btn tvAge-btn--yes">Soy mayor de edad</button>
        <button id="tvAgeNo" class="tvAge-btn tvAge-btn--no">Soy menor de edad</button>
      </div>
      <p class="tvAge-legal">
        Al acceder, declaras tener la edad legal para consumir alcohol en tu país.<br>
        El consumo de alcohol está prohibido a menores de 18 años (Ley 28/2005).
      </p>
    </div>
  `;
  document.body.appendChild(overlay);
  document.body.style.overflow = "hidden"; // bloquear scroll

  /* ── Inyectar CSS ────────────────────────────────────────────── */
  const style = document.createElement("style");
  style.textContent = `
    #tvAgeOverlay {
      position: fixed; inset: 0; z-index: 99999;
      background: rgba(10, 5, 2, 0.92);
      display: flex; align-items: center; justify-content: center;
      font-family: 'Montserrat', sans-serif;
      backdrop-filter: blur(4px);
    }
    #tvAgeModal {
      background: #1a0e06;
      border: 1px solid rgba(180,140,80,0.4);
      border-radius: 12px;
      padding: 40px 36px 32px;
      max-width: 460px;
      width: calc(100% - 32px);
      text-align: center;
      color: #e8dcc8;
      box-shadow: 0 24px 64px rgba(0,0,0,0.7);
    }
    .tvAge-logo { margin-bottom: 20px; }
    .tvAge-logo img { height: 64px; object-fit: contain; }
    #tvAgeModal h2 {
      font-family: 'Cinzel', serif;
      font-size: 1.5rem;
      color: #c9a84c;
      margin: 0 0 14px;
      letter-spacing: 0.05em;
    }
    #tvAgeModal p {
      font-size: 0.92rem;
      line-height: 1.65;
      color: #c8b89a;
      margin: 0 0 24px;
    }
    #tvAgeModal strong { color: #e8dcc8; }
    .tvAge-actions {
      display: flex; gap: 12px; justify-content: center;
      flex-wrap: wrap; margin-bottom: 20px;
    }
    .tvAge-btn {
      cursor: pointer; border: none; border-radius: 6px;
      padding: 12px 28px; font-family: 'Montserrat', sans-serif;
      font-size: 0.88rem; font-weight: 600; letter-spacing: 0.04em;
      transition: transform 0.15s, opacity 0.15s;
    }
    .tvAge-btn:hover { transform: translateY(-2px); opacity: 0.9; }
    .tvAge-btn--yes {
      background: #8b1a1a; color: #f5ede0;
      border: 1px solid rgba(180,80,80,0.5);
    }
    .tvAge-btn--no {
      background: transparent; color: #8a7a65;
      border: 1px solid #4a3a2a;
    }
    .tvAge-legal {
      font-size: 0.72rem !important;
      color: #6a5a45 !important;
      margin: 0 !important;
    }
  `;
  document.head.appendChild(style);

  /* ── Eventos de los botones ──────────────────────────────────── */
  document.getElementById("tvAgeSi").addEventListener("click", function () {
    setCookie(COOKIE_NAME, "1", COOKIE_DAYS);
    overlay.remove();
    style.remove();
    document.body.style.overflow = "";
  });

  document.getElementById("tvAgeNo").addEventListener("click", function () {
    // Redirigir a una página neutra fuera del sitio
    window.location.href = "https://www.who.int/es/news-room/fact-sheets/detail/alcohol";
  });
})();
