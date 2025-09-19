// script.js - JavaScript para todas las páginas

// ===== FUNCIONES GLOBALES =====
function initializeTheme() {
    const savedTheme = localStorage.getItem("theme") || "light";
    const body = document.body;
    body.classList.add(savedTheme === "dark" ? "dark-mode" : "light-mode");
    updateThemeButtonText();
}

function toggleTheme() {
    const body = document.body;
    const currentTheme = body.classList.contains("dark-mode") ? "dark" : "light";
    
    body.classList.remove(currentTheme === "dark" ? "dark-mode" : "light-mode");
    body.classList.add(currentTheme === "dark" ? "light-mode" : "dark-mode");
    
    localStorage.setItem("theme", currentTheme === "dark" ? "light" : "dark");
    updateThemeButtonText();
}

function updateThemeButtonText() {
    const toggleButton = document.getElementById("toggleTheme");
    if (toggleButton) {
        const isDarkMode = document.body.classList.contains("dark-mode");
        toggleButton.textContent = isDarkMode ? "☀️" : "🌙";
    }
}

// ===== FUNCIONES PARA INDEX.HTML =====
function loadListaPersonas() {
    const listaEl = document.getElementById("listaPersonas");
    if (!listaEl) return;

    fetch('data/lista.json')
        .then(res => {
            if (!res.ok) throw new Error('No se pudo cargar la lista');
            return res.json();
        })
        .then(lista => {
            if (Array.isArray(lista) && lista.length > 0) {
                listaEl.innerHTML = '';
                lista.forEach(persona => {
                    const li = document.createElement("li");
                    li.innerHTML = `<a href="perfil.html?persona=${persona.archivo}" style="color: var(--accent-color);">${persona.nombre}</a>`;
                    listaEl.appendChild(li);
                });
            } else {
                listaEl.innerHTML = "<li>No hay personas registradas todavía.</li>";
            }
        })
        .catch(err => {
            console.error("Error al cargar la lista:", err);
            listaEl.innerHTML = "<li>Error al cargar la lista de personas.</li>";
        });
}

// ===== FUNCIONES PARA PERFIL.HTML =====
function cargarPerfil() {
    const urlParams = new URLSearchParams(window.location.search);
    const nombrePersona = urlParams.get("persona");
    
    if (!nombrePersona) {
        mostrarErrorPerfil("No se especificó una persona. Escanea un código QR válido.");
        return;
    }

    const emojis = {
        'niño': '👶', 'adulto_mayor': '👵', 'alzheimer': '🧠', 
        'discapacidad': '♿', 'otro': '👤'
    };

    fetch(`data/${nombrePersona}.json`)
        .then(res => {
            if (!res.ok) throw new Error("Archivo no encontrado");
            return res.json();
        })
        .then(datos => {
            mostrarPerfil(datos, emojis);
        })
        .catch(err => {
            console.error("Error:", err);
            mostrarErrorPerfil(`No se encontró el perfil de "${nombrePersona}".`);
        });
}

function mostrarPerfil(datos, emojis) {
    const tipo = datos.tipo_persona || "otro";
    const emoji = emojis[tipo] || '👼';
    
    let notasHTML = '';
    if (datos.notas && datos.notas !== "Ninguna") {
        const parrafosNotas = datos.notas.split(". ").map(p => p.trim()).filter(p => p.length > 0);
        notasHTML = `
            <div class="info-section">
                <h3>📝 Información Importante</h3>
                ${parrafosNotas.map(parrafo => `<p>${parrafo}.</p>`).join('')}
            </div>
        `;
    }

    const html = `
        <div style="text-align: center; margin-bottom: 20px;">
            <span style="font-size: 3rem;">${emoji}</span>
            <h2>${emoji} ${datos.nombre}</h2>
            <p style="color: #666; font-style: italic;">${obtenerTipoTexto(tipo)}</p>
        </div>
        
        <div class="info-section">
            <h3>📋 Información Personal</h3>
            <p><strong>Edad:</strong> ${datos.edad || "No especificado"}</p>
            <p><strong>Condición:</strong> ${datos.diagnostico || "No especificado"}</p>
            <p><strong>Tipo de Sangre:</strong> ${datos.tipo_de_sangre || "No especificado"}</p>
            <p><strong>Alergias:</strong> ${!datos.alergias || datos.alergias === "" ? "Ninguna" : datos.alergias}</p>
        </div>

        <div class="info-section">
            <h3>📞 Contacto de Emergencia 1</h3>
            <ul>
                <li><strong>Nombre:</strong> ${datos.contacto1?.nombre || "No especificado"}</li>
                <li><strong>Parentesco:</strong> ${datos.contacto1?.parentesco || "No especificado"}</li>
                <li><strong>Teléfono:</strong> ${datos.contacto1?.telefono || "No especificado"}</li>
            </ul>
        </div>

        ${datos.contacto2 && (datos.contacto2.nombre || datos.contacto2.telefono) ? `
        <div class="info-section">
            <h3>📞 Contacto de Emergencia 2</h3>
            <ul>
                <li><strong>Nombre:</strong> ${datos.contacto2.nombre || "No especificado"}</li>
                <li><strong>Parentesco:</strong> ${datos.contacto2.parentesco || "No especificado"}</li>
                <li><strong>Teléfono:</strong> ${datos.contacto2.telefono || "No especificado"}</li>
            </ul>
        </div>
        ` : ''}

        ${notasHTML}

        <div class="info-section" style="text-align: center; margin-top: 30px; padding: 15px; background: #f8f9fa; border-radius: 10px;">
            <p style="margin: 0; color: #666;">👼 Este perfil fue creado con <strong>QR Angel</strong> - Protección Digital</p>
        </div>
    `;

    document.getElementById("datos").innerHTML = html;
}

function mostrarErrorPerfil(mensaje) {
    document.getElementById("datos").innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <span style="font-size: 4rem;">😢</span>
            <h2>Error al cargar el perfil</h2>
            <p>${mensaje}</p>
            <div style="margin-top: 20px;">
                <a href="index.html" style="display: inline-block; padding: 10px 20px; background: var(--accent-color); color: white; text-decoration: none; border-radius: 5px; margin: 5px;">
                    Volver al inicio
                </a>
                <a href="formulario.html" style="display: inline-block; padding: 10px 20px; background: #38a169; color: white; text-decoration: none; border-radius: 5px; margin: 5px;">
                    Crear nuevo perfil
                </a>
            </div>
        </div>
    `;
}

function obtenerTipoTexto(tipo) {
    const tipos = {
        'niño': 'Niño/Niña bajo protección QR Angel',
        'adulto_mayor': 'Adulto Mayor bajo protección QR Angel', 
        'alzheimer': 'Persona con Alzheimer - Protección QR Angel',
        'discapacidad': 'Persona con Discapacidad - Protección QR Angel',
        'otro': 'Persona bajo protección QR Angel'
    };
    return tipos[tipo] || 'Protegido por QR Angel';
}

// ===== GEOLOCALIZACIÓN =====
function setupGeolocation() {
    const ubicacionButton = document.getElementById("obtenerUbicacion");
    if (!ubicacionButton) return;

    ubicacionButton.addEventListener("click", function() {
        const resultadoDiv = document.getElementById("resultado");
        if (!resultadoDiv) return;

        resultadoDiv.innerHTML = "";

        if (!navigator.geolocation) {
            resultadoDiv.innerHTML = "<p>❌ Tu navegador no soporta geolocalización.</p>";
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude.toFixed(6);
                const lon = position.coords.longitude.toFixed(6);

                resultadoDiv.innerHTML = `
                    <p>📍 <strong>Ubicación obtenida:</strong></p>
                    <p>Latitud: ${lat}</p>
                    <p>Longitud: ${lon}</p>
                    <a href="https://maps.google.com/?q=${lat},${lon}" target="_blank" style="color: var(--accent-color);">
                        Ver en Google Maps
                    </a>
                `;
            },
            (error) => {
                let mensaje = "";
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        mensaje = "El usuario denegó el acceso a la ubicación.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        mensaje = "La información de ubicación no está disponible.";
                        break;
                    case error.TIMEOUT:
                        mensaje = "Se agotó el tiempo para obtener la ubicación.";
                        break;
                    default:
                        mensaje = "Error desconocido.";
                }
                resultadoDiv.innerHTML = `<p>❌ Error: ${mensaje}</p>`;
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    });
}

// ===== INICIALIZACIÓN =====
document.addEventListener("DOMContentLoaded", function() {
    initializeTheme();
    
    // Configurar botón de tema
    const toggleButton = document.getElementById("toggleTheme");
    if (toggleButton) {
        toggleButton.addEventListener("click", toggleTheme);
    }

    // Cargar contenido específico de cada página
    if (document.getElementById("listaPersonas")) {
        loadListaPersonas(); // Para index.html
    }

    if (document.getElementById("datos")) {
        cargarPerfil(); // Para perfil.html
        setupGeolocation(); // Para perfil.html
    }
});