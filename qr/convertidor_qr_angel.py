import os
from datetime import datetime

def convertir_formato_original_a_qr_angel(archivo_entrada, archivo_salida=None):
    """
    Convierte un archivo de formato plano (con líneas separadas) al formato estructurado de QR Angel
    """
    
    try:
        with open(archivo_entrada, 'r', encoding='utf-8') as f:
            lineas = f.readlines()
    except FileNotFoundError:
        return f"❌ Error: El archivo '{archivo_entrada}' no existe."
    except Exception as e:
        return f"❌ Error al leer el archivo: {str(e)}"
    
    # Procesar las líneas - FORMATO CON LÍNEAS SEPARADAS
    datos = {}
    claves_esperadas = [
        'nombre', 'edad', 'tipo_persona', 'diagnostico', 
        'tipo_de_sangre', 'alergias', 'contacto1_nombre', 
        'contacto1_parentesco', 'contacto1_telefono', 
        'contacto2_nombre', 'contacto2_parentesco', 'contacto2_telefono', 'notas'
    ]
    
    clave_actual = None
    valor_acumulado = ""
    
    for i, linea in enumerate(lineas):
        linea = linea.strip()
        
        # Saltar líneas vacías
        if not linea:
            continue
        
        # Verificar si es una clave conocida
        es_clave = False
        for clave in claves_esperadas:
            if linea.lower() == clave:
                if clave_actual and valor_acumulado:
                    datos[clave_actual] = valor_acumulado.strip()
                clave_actual = clave
                valor_acumulado = ""
                es_clave = True
                break
        
        # Si no es clave, es valor de la clave actual
        if not es_clave and clave_actual:
            if valor_acumulado:
                valor_acumulado += " " + linea
            else:
                valor_acumulado = linea
    
    # Guardar el último valor
    if clave_actual and valor_acumulado:
        datos[clave_actual] = valor_acumulado.strip()
    
    # Mapear nombres de campos al formato QR Angel
    mapeo_campos = {
        'tipo_persona': 'tipo_atencion',
        'diagnostico': 'condicion'
    }
    
    datos_formateados = {}
    for clave, valor in datos.items():
        nueva_clave = mapeo_campos.get(clave, clave)
        datos_formateados[nueva_clave] = valor
    
    # Generar el contenido formateado
    contenido = generar_contenido_qr_angel(datos_formateados)
    
    # Guardar el archivo de salida
    if archivo_salida:
        try:
            with open(archivo_salida, 'w', encoding='utf-8') as f:
                f.write(contenido)
            print(f"✅ Archivo convertido y guardado como: {archivo_salida}")
        except Exception as e:
            return f"❌ Error al guardar el archivo: {str(e)}"
    
    return contenido

def generar_contenido_qr_angel(datos):
    """Genera el contenido formateado en estilo QR Angel"""
    
    fecha_actual = datetime.now()
    
    contenido = [
        "# QR Angel - Protección Digital",
        "",
        "# DATOS DE LA PERSONA",
        f"nombre: {datos.get('nombre', 'No especificado')}",
        f"edad: {datos.get('edad', 'No especificado')}",
        f"tipo_atencion: {datos.get('tipo_atencion', 'No especificado')}",
        f"condicion: {datos.get('condicion', 'No especificado')}",
        f"tipo_de_sangre: {datos.get('tipo_de_sangre', 'No especificado')}",
        f"alergias: {datos.get('alergias', 'Ninguna')}",
        "",
        "# CONTACTO DE EMERGENCIA 1",
        f"contacto1_nombre: {datos.get('contacto1_nombre', 'No especificado')}",
        f"contacto1_parentesco: {datos.get('contacto1_parentesco', 'No especificado')}",
        f"contacto1_telefono: {datos.get('contacto1_telefono', 'No especificado')}",
        ""
    ]
    
    # Agregar contacto 2 solo si existe
    if any(key in datos for key in ['contacto2_nombre', 'contacto2_parentesco', 'contacto2_telefono']):
        contenido.extend([
            "# CONTACTO DE EMERGENCIA 2",
            f"contacto2_nombre: {datos.get('contacto2_nombre', '')}",
            f"contacto2_parentesco: {datos.get('contacto2_parentesco', '')}",
            f"contacto2_telefono: {datos.get('contacto2_telefono', '')}",
            ""
        ])
    
    contenido.extend([
        "# INFORMACIÓN ADICIONAL",
        f"notas: {datos.get('notas', 'Ninguna')}",
        "",
        "# METADATOS",
        f"fecha_registro: {fecha_actual.strftime('%d/%-m/%Y')}",
        f"hora_registro: {fecha_actual.strftime('%-I:%M:%S %p').lower()}",
        "proyecto: QR Angel - Protección Digital"
    ])
    
    return '\n'.join(contenido)

def procesar_archivo_ejemplo():
    """Función para probar con el ejemplo específico"""
    
    # Datos de ejemplo basados en tu descripción
    datos_ejemplo = {
        'nombre': 'ana garcia',
        'edad': '15',
        'tipo_atencion': 'otro', 
        'condicion': 'autismo',
        'tipo_de_sangre': 'A positivo',
        'alergias': 'penisilina',
        'contacto1_nombre': 'juan',
        'contacto1_parentesco': 'papa',
        'contacto1_telefono': '4562128745',
        'contacto2_nombre': 'maria',
        'contacto2_parentesco': 'tia', 
        'contacto2_telefono': '5484215687',
        'notas': 'nas datos importantes'
    }
    
    contenido = generar_contenido_qr_angel(datos_ejemplo)
    return contenido

def main():
    """Función principal"""
    
    print("👼 CONVERSOR QR ANGEL (Formato Líneas Separadas)")
    print("=" * 50)
    
    # Probar con el ejemplo que me mostraste
    print("\n🎯 GENERANDO EJEMPLO CON TUS DATOS:")
    print("=" * 50)
    
    contenido = procesar_archivo_ejemplo()
    print(contenido)
    
    # Preguntar si quiere guardar en archivo
    guardar = input("\n¿Quieres guardar este ejemplo en un archivo? (s/n): ").lower().strip()
    
    if guardar == 's':
        nombre_archivo = input("Nombre del archivo de salida (ej: ana_garcia_qr.txt): ").strip()
        if not nombre_archivo:
            nombre_archivo = "ejemplo_qr_angel.txt"
        
        try:
            with open(nombre_archivo, 'w', encoding='utf-8') as f:
                f.write(contenido)
            print(f"✅ Ejemplo guardado como: {nombre_archivo}")
        except Exception as e:
            print(f"❌ Error al guardar: {e}")

if __name__ == "__main__":
    main()