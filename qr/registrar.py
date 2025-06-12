import qrcode
import json
import os

# Carpeta donde se guardarán los perfiles y la lista
DATA_DIR = "../data"
QR_DIR = "."

def limpiar_nombre(nombre):
    return nombre.replace(" ", "_").lower()

def guardar_json(datos, nombre_archivo):
    with open(os.path.join(DATA_DIR, f"{nombre_archivo}.json"), 'w', encoding='utf-8') as f:
        json.dump(datos, f, indent=4, ensure_ascii=False)

def actualizar_lista(nombre_real, nombre_archivo):
    lista_path = os.path.join(DATA_DIR, "lista.json")

    if os.path.exists(lista_path):
        with open(lista_path, "r", encoding="utf-8") as f:
            try:
                lista = json.load(f)
            except json.JSONDecodeError:
                lista = []
    else:
        lista = []

    # Evita duplicados
    if not any(item["archivo"] == nombre_archivo for item in lista):
        lista.append({
            "nombre": nombre_real,
            "archivo": nombre_archivo
        })

    with open(lista_path, "w", encoding="utf-8") as f:
        json.dump(lista, f, indent=4, ensure_ascii=False)

def generar_qr(nombre_nino):
    url_perfil = f"https://kraysek.github.io/ninios-qr/perfil.html?nino={limpiar_nombre(nombre_nino)}"
    qr = qrcode.make(url_perfil)
    nombre_archivo_qr = f"qr_{limpiar_nombre(nombre_nino)}.png"
    qr.save(os.path.join(QR_DIR, nombre_archivo_qr))
    print(f"\n✅ QR generado correctamente como '{nombre_archivo_qr}'")
    print(f"🔗 Este QR lleva a: {url_perfil}")

def main():
    print("\n👶 Registro de Niño - Proyecto QR - Niños Vulnerables\n")

    # Datos personales del niño 
    nombre = input("Nombre completo del niño/a: ").strip()
    edad = input("Edad: ").strip()
    diagnostico = input("Diagnóstico o condición especial: ").strip()
    
    # Datos del contacto
    contacto_nombre = input("Nombre del contacto: ").strip()
    contacto_parentesco = input("Parentesco (ej. Padre, Madre, Tutor): ").strip()
    contacto_telefono = input("Teléfono de contacto: ").strip()

    # Notas importantes
    notas = input("Notas importantes (ej. comportamiento, alergias): ").strip()

    # Limpieza del nombre para usarlo en URLs y archivos
    nombre_guardado = limpiar_nombre(nombre)

    # Estructura del perfil
    datos = {
        "nombre": nombre,
        "edad": edad,
        "diagnostico": diagnostico,
        "contacto": {
            "nombre": contacto_nombre,
            "parentesco": contacto_parentesco,
            "telefono": contacto_telefono
        },
        "notas": notas
    }

    # Guardar el perfil del niño/a
    guardar_json(datos, nombre_guardado)

    # Actualizar lista.json
    actualizar_lista(nombre, nombre_guardado)

    # Generar el QR
    generar_qr(nombre)

    print("\n✅ El niño/a ha sido registrado exitosamente.")
    print(f"📁 Datos guardados en: {DATA_DIR}/{nombre_guardado}.json")
    print(f"📌 Ahora aparecerá en la lista del sitio web.")

if __name__ == "__main__":
    main()