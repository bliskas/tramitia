# Skill: create-blog-post

Genera contenido de blog optimizado para SEO/AEO como archivo Markdown local.

## REGLA FUNDAMENTAL: IDIOMA

**TODO el contenido DEBE estar escrito en español de España, ortográficamente correcto.**
- Todas las tildes y acentos son OBLIGATORIOS (á, é, í, ó, ú, ñ, ü)
- Usar vocabulario de España, no de Latinoamérica (coste, no costo; móvil, no celular)
- Antes de guardar el archivo, revisar CADA palabra para verificar tildes correctas
- Si hay duda sobre una tilde, incluirla (es peor omitirla que incluirla)
- Esto aplica a TODO: título, description, keywords, contenido, FAQs

## Uso

```
/create-blog-post <tipo> <pais> <documento>
```

**Ejemplos:**
- `/create-blog-post guia venezuela partida-nacimiento`
- `/create-blog-post proceso argentina antecedentes-penales`
- `/create-blog-post informativo colombia titulo-universitario`

## Parámetros

| Parámetro | Valores | Descripción |
|-----------|---------|-------------|
| tipo | `guia`, `proceso`, `informativo`, `comparativo` | Tipo de artículo |
| pais | `venezuela`, `argentina`, `colombia`, `general` | País del documento |
| documento | `partida-nacimiento`, `antecedentes-penales`, `titulo-universitario`, `acta-matrimonio`, `partida-defuncion`, `general` | Tipo de documento |

---

## ESTRUCTURA DE CARPETAS

```
src/
├── content/
│   └── blog/           # Posts APROBADOS (se publican automáticamente)
│       └── *.md
│
└── drafts/
    └── blog/           # BORRADORES (no se publican)
        └── *.md
```

**Workflow:**
1. Claude crea post en `src/drafts/blog/` y revisa que ha hecho backlinking a otros blogposts o el main
2. Usuario revisa contenido, SEO, datos
3. Usuario mueve archivo a `src/content/blog/` cuando aprueba
4. `git push` → Deploy automático en Cloudflare Pages

---

## PROCESO DE CREACIÓN

### Paso 1: Verificar que no exista
```
Revisar archivos en:
- src/content/blog/[slug].md (posts publicados)
- src/drafts/blog/[slug].md (borradores)
```

### Paso 2: Generar contenido
```
Generar el artículo siguiendo todas las reglas de este documento
```

### Paso 3: Crear archivo Markdown
```
Escribir archivo en: src/drafts/blog/[slug].md
```

### Paso 4: Confirmar al usuario
```
Mostrar:
- Archivo creado: src/drafts/blog/[slug].md
- Estado: BORRADOR (pendiente de revisión)
- Instrucciones: "Revisa el contenido. Cuando apruebes, mueve el archivo a src/content/blog/"
```

---

## FORMATO DEL ARCHIVO

```markdown
---
title: "Título del artículo (50-60 caracteres)"
description: "Meta description (máximo 155 caracteres)"
publishedDate: "YYYY-MM-DD"
author: "Tramitia"
category: "guias"
keywords:
  - keyword principal
  - keyword secundaria
  - keyword relacionada
country: "venezuela"
documentType: "partida-nacimiento"
targetCountry: "espana"
draft: false
---

[Contenido del artículo en Markdown]
```

### Campos del frontmatter

| Campo | Obligatorio | Valores válidos |
|-------|-------------|-----------------|
| title | Sí | String, 50-60 caracteres |
| description | Sí | String, máximo 155 caracteres |
| publishedDate | Sí | Formato YYYY-MM-DD |
| author | Sí | "Tramitia" |
| category | Sí | `apostillas`, `documentos`, `tramites`, `guias`, `noticias` |
| keywords | Sí | Array de 5-8 strings |
| country | No | `venezuela`, `argentina`, `colombia`, `ecuador`, `peru`, `bolivia`, `general` |
| documentType | No | `partida-nacimiento`, `antecedentes-penales`, `titulo-universitario`, `acta-matrimonio`, `partida-defuncion`, `otro` |
| targetCountry | No | `espana` |
| draft | Sí | `false` |

---

## ESTRUCTURA DEL ARTÍCULO

```markdown
# [Título - keyword en primeras 3 palabras]

[Párrafo introductorio - Responder pregunta principal en primeras 50 palabras con dato numérico]

## [H2 - Definición o contexto]
[Contenido 150-300 palabras]

## [H2 - Requisitos o documentos necesarios]
- Requisito 1
- Requisito 2
- Requisito 3

## [H2 - Proceso paso a paso]

### Paso 1: [Nombre]
[Descripción]

### Paso 2: [Nombre]
[Descripción]

## [H2 - Costos y tiempos]

| Concepto | Valor |
|----------|-------|
| Costo | X-Y EUR |
| Tiempo | X-Y días |

## ¿Necesitas ayuda con tu apostilla?

En Tramitia gestionamos [documento] de [país] sin que tengas que viajar. [Solicita tu presupuesto gratis](/#contacto).

## Preguntas frecuentes

### ¿Cuánto cuesta apostillar [documento] de [país]?
[Respuesta directa con dato numérico, 40-80 palabras]

### ¿Cuánto tiempo tarda la apostilla?
[Respuesta]

### ¿Puedo apostillar sin volver a [país]?
[Respuesta]

### ¿Qué requisitos necesito?
[Respuesta]
```

---

## REGLAS SEO OBLIGATORIAS

### Título
- 50-60 caracteres máximo
- Keyword principal en primeras 3 palabras
- Incluir año si el contenido cambia anualmente
- Formato: "Cómo [acción] [documento] de [país]: Guía [año]"

### Meta description
- Máximo 155 caracteres
- Keyword + beneficio + CTA implícito
- Sin mayúsculas ni exclamaciones
- Formato: "[Documento] para [trámite]. [Beneficio]. [Países]."

### Headings
- 1 H1 (título)
- 3-7 H2 (keyword en al menos 2)
- 0-3 H3 por cada H2

### Contenido
- 1500-2500 palabras para guías
- Párrafos de 2-4 oraciones (máx 100 palabras)
- Listas para requisitos y pasos
- Tablas para comparar datos

---

## REGLAS AEO OBLIGATORIAS

### Primer párrafo
- Responder la pregunta del título en primeras 50 palabras
- Incluir dato numérico (precio, tiempo)
- Formato: "[Acción] [documento] de [país] cuesta entre X y Y euros..."

### Bloques citables
- Crear frases con datos verificables
- Mencionar entidades oficiales por nombre completo
- Incluir referencias a convenios o leyes

---

## ENTIDADES OFICIALES POR PAÍS

### Venezuela
- Ministerio del Poder Popular para Relaciones Exteriores (MPPRE)
- SAREN (Servicio Autónomo de Registros y Notarías)
- Sistema SLAE (Sistema de Legalización y Apostilla Electrónica)
- Registro Civil venezolano

### Argentina
- Cancillería Argentina
- TAD (Trámites a Distancia)
- Colegio de Escribanos
- Registro Civil argentino

### Colombia
- Cancillería de Colombia
- Registraduría Nacional del Estado Civil
- Portal de Apostilla en línea

### España (destino)
- Ministerio de Justicia
- Ministerio de Universidades
- Ministerio de Educación

---

## LISTA NEGRA - PROHIBIDO

- Emojis en cualquier parte
- Keyword stuffing (>5 veces por 1000 palabras)
- Párrafos de más de 5 líneas
- Más de 500 palabras sin subheading
- "Clic aquí" o "leer más" como anchor text
- Mayúsculas para enfatizar (IMPORTANTE, ATENCIÓN)
- Signos de exclamación en títulos
- Urgencia artificial ("solo hoy", "últimas plazas")
- Más de 2 CTAs por artículo
- Enlaces en sección FAQ

---

## ORTOGRAFÍA ESPAÑOLA - OBLIGATORIO

SIEMPRE usar tildes correctamente:

| Incorrecto | Correcto |
|------------|----------|
| tramites | trámites |
| Espana | España |
| informacion | información |
| titulo | título |
| homologacion | homologación |
| como (pregunta) | cómo |
| que (pregunta) | qué |
| cual | cuál |
| donde | dónde |
| cuando | cuándo |
| por que | por qué |
| mas | más |
| facil | fácil |
| rapido | rápido |
| numero | número |
| tambien | también |
| dias | días |
| pais | país |
| seccion | sección |
| defuncion | defunción |
| reagrupacion | reagrupación |

---

## CHECKLIST ANTES DE CREAR ARCHIVO

- [ ] Título 50-60 caracteres con keyword
- [ ] Meta description máximo 155 caracteres
- [ ] Primer párrafo responde pregunta en <50 palabras
- [ ] 3-7 secciones H2
- [ ] FAQ con 4-8 preguntas
- [ ] 1 CTA principal
- [ ] 2-5 enlaces internos (NO en FAQ)
- [ ] Sin emojis
- [ ] Tildes correctas en todo el texto
- [ ] Entidades oficiales mencionadas
- [ ] Datos numéricos verificables
- [ ] Frontmatter completo y válido
- [ ] Archivo va a `src/drafts/blog/` (NO a `content/blog`)
