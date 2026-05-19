import time
import json
import os

# --- Configuración y Datos ---

ARCHIVO_DATOS = "ranking_vino.json"

preguntas = [
    {"texto": "¿De qué país es originario el Malbec?", "opciones": ["Francia", "Argentina", "Italia"], "correcta": 1},
    {"texto": "¿Qué tipo de vino es el Cabernet Sauvignon?", "opciones": ["Blanco", "Tinto", "Espumoso"], "correcta": 1},
    {"texto": "¿Qué significa que un vino sea reserva?", "opciones": ["Más tiempo de crianza", "Más azúcar", "Más gas"], "correcta": 0},
    {"texto": "¿Qué color tiene un vino rosado?", "opciones": ["Rosa", "Verde", "Amarillo"], "correcta": 0},
    {"texto": "¿Cuál es la bebida alcohólica que se hace de uvas?", "opciones": ["Cerveza", "Vino", "Whisky"], "correcta": 1},
    {"texto": "¿El champán es un tipo de vino...", "opciones": ["Espumoso", "Tinto", "Dulce"], "correcta": 0},
    {"texto": "¿Qué fruta se usa para hacer vino?", "opciones": ["Manzana", "Uva", "Cereza"], "correcta": 1},
    {"texto": "¿Qué país es famoso por el vino Chianti?", "opciones": ["Italia", "España", "Chile"], "correcta": 0},
    {"texto": "¿Qué tipo de vino suele servirse frío?", "opciones": ["Blanco", "Tinto", "Ambar"], "correcta": 0},
    {"texto": "¿Qué instrumento se usa para descorchar una botella de vino?", "opciones": ["Sacacorchos", "Cuchillo", "Martillo"], "correcta": 0}
]

# --- Funciones de Persistencia (Reemplazo de localStorage) ---

def cargar_datos():
    if not os.path.exists(ARCHIVO_DATOS):
        return {"record": 0, "ranking": []}
    try:
        with open(ARCHIVO_DATOS, "r", encoding="utf-8") as f:
            return json.load(f)
    except:
        return {"record": 0, "ranking": []}

def guardar_datos(datos):
    with open(ARCHIVO_DATOS, "w", encoding="utf-8") as f:
        json.dump(datos, f, indent=4)

# --- Lógica del Juego ---

def jugar():
    datos = cargar_datos()
    record_actual = datos["record"]
    ranking = datos["ranking"]

    print(f"\n--- TRIVIA DE VINOS ---")
    print(f"Récord actual: {record_actual}")
    
    # Nombre del jugador
    jugador = input("Ingresa tu nombre (Default: Jugador): ").strip()
    if not jugador:
        jugador = "Jugador"

    puntos = 0
    racha = 0
    tiempo_maximo = 10  # Segundos por pregunta
