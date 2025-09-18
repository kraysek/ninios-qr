// formulario.js - JavaScript para el formulario de registro

document.addEventListener('DOMContentLoaded', function() {
    initializeFormTheme();
    setupFormEventListeners();
});

function initializeFormTheme() {
    // Configurar tema desde localStorage
    const savedTheme = localStorage.getItem("theme") || "light";
    document.body.classList.add(savedTheme === "dark" ? "dark-mode" : "light-mode");
    updateThemeButtonText();
}

function setupFormEventListeners() {
    // Botón de cambio de tema
    const toggleButton = document.getElementById("toggleTheme");
    if (toggleButton) {
        toggleButton.addEventListener('click', toggleFormTheme);
    }

    // Manejar el formulario
    const form = document.getElementById('registroForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
}

function toggleFormTheme() {
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

function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());
    
    if (!validateForm(data)) {
        return;
    }

    generateTxtFile(data);
}

function validateForm(data) {
    const camposObligatorios = [
        'nombre', 'edad', 'diagnostico', 'tipo_de_sangre',
        'contacto1_nombre', 'contacto1_parentesco', 'contacto1_telefono'
    ];
    
    for (let campo of camposObligatorios) {
        if (!data[campo] || data[campo].trim() === '') {
            showAlert('❌ Por favor, completa todos los campos obligatorios marcados con *.', 'error');
            return false;
        }
    }
    return true;
}

function generateTxtFile(data) {
    const contenido = buildFileContent(data);
    const filename = `${data.nombre.toLowerCase().replace(/\s+/g, '_')}.txt`;
    
    try {
        const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        
        // Limpieza
        setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            showAlert(`✅ Archivo TXT generado: ${filename}\n\nAhora puedes usar el script Python para procesarlo y generar el QR.`);
        }, 100);
        
    } catch (error) {
        console.error('Error al generar el archivo:', error);
        showAlert('❌ Error al generar el archivo. Por favor, intenta nuevamente.', 'error');
    }
}

function buildFileContent(data) {
    let contenido = `# Ficha de registro - Proyecto QR - Niños Vulnerables\n\n`;
    contenido += `nombre: ${data.nombre}\n`;
    contenido += `edad: ${data.edad}\n`;
    contenido += `diagnostico: ${data.diagnostico}\n`;
    contenido += `tipo_de_sangre: ${data.tipo_de_sangre}\n`;
    contenido += `alergias: ${data.alergias || 'Ninguna'}\n\n`;
    contenido += `# Contacto 1 (obligatorio)\n`;
    contenido += `contacto1_nombre: ${data.contacto1_nombre}\n`;
    contenido += `contacto1_parentesco: ${data.contacto1_parentesco}\n`;
    contenido += `contacto1_telefono: ${data.contacto1_telefono}\n\n`;
    
    if (data.contacto2_nombre || data.contacto2_parentesco || data.contacto2_telefono) {
        contenido += `# Contacto 2 (opcional)\n`;
        contenido += `contacto2_nombre: ${data.contacto2_nombre || ''}\n`;
        contenido += `contacto2_parentesco: ${data.contacto2_parentesco || ''}\n`;
        contenido += `contacto2_telefono: ${data.contacto2_telefono || ''}\n\n`;
    }
    
    contenido += `# Notas importantes\n`;
    contenido += `notas: ${data.notas || 'Ninguna'}\n`;
    
    return contenido;
}

function showAlert(message, type = 'success') {
    const alertBox = document.getElementById('alertBox');
    if (!alertBox) return;
    
    alertBox.textContent = message;
    alertBox.className = type === 'success' ? 'alert alert-success' : 'alert alert-error';
    alertBox.style.display = 'block';
    
    setTimeout(() => {
        alertBox.style.display = 'none';
    }, 5000);
}