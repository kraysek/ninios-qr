// script.js - Todo el JavaScript integrado en un solo archivo

// Manejo del tema oscuro/claro
document.addEventListener("DOMContentLoaded", () => {
    initializeTheme();
    loadListaNinos();
    setupEventListeners();
});

function initializeTheme() {
    const savedTheme = localStorage.getItem("theme") || "light";
    const body = document.body;
    body.classList.add(savedTheme === "dark" ? "dark-mode" : "light-mode");
    
    // Actualizar texto del botón según el tema
    updateThemeButtonText();
}

function setupEventListeners() {
    // Botón de cambio de tema
    const toggleButton = document.getElementById("toggleTheme");
    if (toggleButton) {
        toggleButton.addEventListener("click", toggleTheme);
    }

    // Geolocalización (si existe en la página)
    const ubicacionButton = document.getElementById("obtenerUbicacion");
    if (ubicacionButton) {
        ubicacionButton.addEventListener("click", handleGeolocation);
    }
}

function toggleTheme() {
    const body = document.body;
    const currentTheme = body.classList.contains("dark-mode") ? "dark" : "light";

    // Remover clase actual y aplicar la opuesta
    body.classList.remove(currentTheme === "dark" ? "dark-mode" : "light-mode");
    body.classList.add(currentTheme === "dark" ? "light-mode" : "dark-mode");

    // Guardar preferencia
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", newTheme);
    
    // Actualizar texto del botón
    updateThemeButtonText();
}

function updateThemeButtonText() {
    const toggleButton = document.getElementById("toggleTheme");
    if (toggleButton) {
        const isDarkMode = document.body.classList.contains("dark-mode");
        toggleButton.textContent = isDarkMode ? "☀️" : "🌙";
    }
}

// Cargar lista de niños desde data/lista.json
function loadListaNinos() {
    const listaEl = document.getElementById("listaNinos");
    if (!listaEl) return;

    fetch('data/lista.json')
        .then(res => {
            if (!res.ok) {
                throw new Error('No se pudo cargar la lista');
            }
            return res.json();
        })
        .then(lista => {
            if (Array.isArray(lista)) {
                lista.forEach(nino => {
                    const li = document.createElement("li");
                    li.innerHTML = `<a href="perfil.html?nino=${nino.archivo}">${nino.nombre}</a>`;
                    listaEl.appendChild(li);
                });
                
                if (lista.length === 0) {
                    listaEl.innerHTML = "<li>No hay niños registrados todavía.</li>";
                }
            }
        })
        .catch(err => {
            console.error("Error al cargar la lista:", err);
            listaEl.innerHTML = "<li>No hay niños registrados todavía.</li>";
        });
}

// Geolocalización - Solo si el elemento existe (en perfil.html)
function handleGeolocation() {
    const resultadoDiv = document.getElementById("resultado");
    if (!resultadoDiv) return;

    resultadoDiv.innerHTML = "";

    if (!navigator.geolocation) {
        const errorP = document.createElement("p");
        errorP.textContent = "❌ Tu navegador no soporta geolocalización.";
        resultadoDiv.appendChild(errorP);
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude.toFixed(6);
            const lon = position.coords.longitude.toFixed(6);

            const pUbicacion = document.createElement("p");
            pUbicacion.textContent = "📍 Ubicación obtenida:";
            resultadoDiv.appendChild(pUbicacion);

            const pLat = document.createElement("p");
            pLat.textContent = `Latitud: ${lat}`;
            resultadoDiv.appendChild(pLat);

            const pLon = document.createElement("p");
            pLon.textContent = `Longitud: ${lon}`;
            resultadoDiv.appendChild(pLon);

            const link = document.createElement("a");
            link.href = `https://maps.google.com/?q=${lat},${lon}`;
            link.target = "_blank";
            link.textContent = "Ver en Google Maps";
            resultadoDiv.appendChild(link);
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

            const errorP = document.createElement("p");
            errorP.textContent = `❌ Error: ${mensaje}`;
            resultadoDiv.appendChild(errorP);
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}