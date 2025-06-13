import qrcode
import json
import os

DATA_DIR = "../data"
QR_DIR = "."
LISTA_JSON = os.path.join(DATA_DIR, "lista.json")

def limpiar_nombre(nombre):
    return nombre.replace(" ", "_").lower()

def guardar_json(datos, nombre_archivo):
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR)
    with open(os.path.join(DATA_DIR, f"{nombre_archivo}.json"), 'w', encoding='utf-8') as f:
        json.dump(datos, f, indent=4, ensure_ascii=False)

def actualizar_lista(nombre_real, nombre_archivo):
    if not os.path.exists(LISTA_JSON):
        with open(LISTA_JSON, 'w', encoding='utf-8') as f:
            json.dump([], f)

    with open(LISTA_JSON, "r", encoding="utf-8") as f:
        try:
            lista = json.load(f)
        except json.JSONDecodeError:
            lista = []

    if not any(item["archivo"] == nombre_archivo for item in lista):
        lista.append({
            "nombre": nombre_real,
            "archivo": nombre_archivo
        })

    with open(LISTA_JSON, "w", encoding="utf-8") as f:
        json.dump(lista, f, indent=4, ensure_ascii=False)

def generar_qr(nombre_nino):
    url_perfil = f"https://kraysek.github.io/ninios-qr/perfil.html?nino={limpiar_nombre(nombre_nino)}"
    qr = qrcode.make(url_perfil)
    nombre_archivo_qr = f"qr_{limpiar_nombre(nombre_nino)}.png"
    qr.save(os.path.join(QR_DIR, nombre_archivo_qr))
    print(f"\n✅ QR generado como '{nombre_archivo_qr}'")
    print(f"🔗 Este QR lleva a: {url_perfil}")

def leer_datos_desde_txt(archivo_txt):
    datos = {}
    with open(archivo_txt, "r", encoding='utf-8') as f:
        for linea in f:
            linea = linea.strip()
            if ":" in linea and len(linea.split(":", 1)) == 2:
                clave, valor = linea.split(":", 1)
                clave = clave.strip()
                valor = valor.strip()
                datos[clave] = valor
    return datos

def main():
    print("\n📄 Registro desde TXT - Proyecto QR - Niños Vulnerables\n")
    archivo_txt = input("Nombre del archivo TXT (sin extensión): ").strip() + ".txt"

    if not os.path.exists(archivo_txt):
        print(f"❌ Error: El archivo '{archivo_txt}' no existe.")
        return

    datos = leer_datos_desde_txt(archivo_txt)

    # Leer todos los campos necesarios 
    nombre = datos.get("nombre", "")
    edad = datos.get("edad", "")
    diagnostico = datos.get("diagnostico", "")
    tipo_de_sangre = datos.get("tipo_de_sangre", "")
    alergias = datos.get("alergias", "")
    notas = datos.get("notas", "")

    contacto1_nombre = datos.get("contacto1_nombre", "")
    contacto1_parentesco = datos.get("contacto1_parentesco", "")
    contacto1_telefono = datos.get("contacto1_telefono", "")

    contacto2_nombre = datos.get("contacto2_nombre", "")
    contacto2_parentesco = datos.get("contacto2_parentesco", "")
    contacto2_telefono = datos.get("contacto2_telefono", "")

    if not nombre:
        print("❌ Error: El archivo no tiene un nombre válido.")
        return

    contacto1 = {
        "nombre": contacto1_nombre or "",
        "parentesco": contacto1_parentesco or "",
        "telefono": contacto1_telefono or ""
    }

    contacto2 = {}
    if contacto2_nombre or contacto2_parentesco or contacto2_telefono:
        contacto2 = {
            "nombre": contacto2_nombre or "",
            "parentesco": contacto2_parentesco or "",
            "telefono": contacto2_telefono or ""
        }

    datos_completos = {
        "nombre": nombre,
        "edad": edad or "",
        "diagnostico": diagnostico or "",
        "tipo_de_sangre": tipo_de_sangre or "",
        "alergias": alergias or "",
        "notas": notas or "",
        "contacto1": contacto1,
        "contacto2": contacto2
    }

    nombre_guardado = limpiar_nombre(nombre.split(" ")[0])  # Usa el primer nombre como identificador
    guardar_json(datos_completos, nombre_guardado)
    generar_qr(nombre_guardado)
    actualizar_lista(nombre, nombre_guardado)

    print("\n✅ El niño/a ha sido registrado exitosamente.")
    print(f"📁 Datos guardados en: ../data/{nombre_guardado}.json")
    print(f"📌 Ahora aparecerá en el índice del sitio.")

if __name__ == "__main__":
    main()