# Skill: create-blog-post

Genera y publica contenido de blog optimizado para SEO/AEO en Sanity CMS.

## Uso

```
/create-blog-post <tipo> <pais> <documento> [--draft]
```

**Ejemplos:**
- `/create-blog-post guia venezuela partida-nacimiento`
- `/create-blog-post proceso argentina antecedentes-penales`
- `/create-blog-post informativo colombia titulo-universitario --draft`

## Parametros

| Parametro | Valores | Descripcion |
|-----------|---------|-------------|
| tipo | `guia`, `proceso`, `informativo`, `comparativo` | Tipo de articulo |
| pais | `venezuela`, `argentina`, `colombia`, `general` | Pais del documento |
| documento | `partida-nacimiento`, `antecedentes-penales`, `titulo-universitario`, `acta-matrimonio`, `partida-defuncion`, `general` | Tipo de documento |
| --draft | flag opcional | Crear como borrador (no publicar) |

---

## INSTRUCCIONES OBLIGATORIAS

### 1. ANTES DE GENERAR CONTENIDO

1. Leer las reglas completas en `CONTENT_RULES.md`
2. Consultar el schema de Sanity con `mcp__Sanity__get_schema`
3. Verificar que no exista un articulo similar con `mcp__Sanity__query_documents`

### 2. ESTRUCTURA DEL ARTICULO

Seguir EXACTAMENTE esta estructura:

```markdown
# [Titulo - 50-60 caracteres, keyword en primeras 3 palabras]

[Parrafo introductorio - Responder pregunta principal en primeras 50 palabras]

## [H2 - Definicion o contexto]
[Contenido 150-300 palabras]

## [H2 - Requisitos o documentos necesarios]
[Lista con items]

## [H2 - Proceso paso a paso]
### Paso 1: [Nombre]
[Descripcion]
### Paso 2: [Nombre]
[Descripcion]
...

## [H2 - Costos y tiempos]
| Concepto | Valor |
|----------|-------|
| ... | ... |

## [H2 - CTA]
En Tramitia gestionamos [documento] de [pais] sin que tengas que viajar.
[Solicita tu presupuesto gratis](/contacto) o escribenos por [WhatsApp](https://wa.me/34XXXXXXXXX).

## Preguntas frecuentes

### [Pregunta 1 con interrogativo]?
[Respuesta directa 40-80 palabras]

### [Pregunta 2]?
[Respuesta]

... (4-8 preguntas)
```

### 3. REGLAS DE SEO OBLIGATORIAS

**Titulo:**
- 50-60 caracteres maximo
- Keyword principal en primeras 3 palabras
- Incluir ano si el contenido cambia anualmente
- Formato: "Como [accion] [documento] de [pais]: Guia [ano]"

**Meta description:**
- 145-155 caracteres
- Keyword + beneficio + CTA implicito
- SIN mayusculas ni exclamaciones

**Headings:**
- 1 H1 (titulo)
- 3-7 H2 (keyword en al menos 2)
- 0-3 H3 por cada H2

**Contenido:**
- 1500-2500 palabras para guias
- Parrafos de 2-4 oraciones (max 100 palabras)
- Listas para requisitos y pasos
- Tablas para comparar datos

### 4. REGLAS DE AEO OBLIGATORIAS

**Primer parrafo:**
- Responder la pregunta del titulo en primeras 50 palabras
- Incluir dato numerico (precio, tiempo)
- Formato: "[Accion] [documento] de [pais] cuesta entre X y Y euros..."

**Bloques citables:**
- Crear frases con datos verificables
- Mencionar entidades oficiales por nombre completo
- Incluir referencias a convenios o leyes

### 5. REGLAS DE FAQ OBLIGATORIAS

**Preguntas obligatorias para apostillas:**
1. Cuanto cuesta apostillar [documento] de [pais]?
2. Cuanto tiempo tarda la apostilla de [documento]?
3. Puedo apostillar [documento] sin volver a [pais]?
4. Que requisitos necesito para apostillar [documento]?
5. [Pregunta especifica del tema]

**Formato respuesta:**
- Primera oracion: respuesta directa (Si/No o dato)
- Extension: 40-80 palabras
- Incluir dato numerico cuando sea posible

### 6. ENTIDADES POR PAIS

**Venezuela:**
- Ministerio del Poder Popular para Relaciones Exteriores (MPPRE)
- SAREN (Servicio Autonomo de Registros y Notarias)
- Sistema SLAE (Sistema de Legalizacion y Apostilla Electronica)
- Registro Civil venezolano

**Argentina:**
- Cancilleria Argentina
- TAD (Tramites a Distancia)
- Colegio de Escribanos
- Registro Civil argentino

**Colombia:**
- Cancilleria de Colombia
- Registraduria Nacional del Estado Civil
- Portal de Apostilla en linea

### 7. LISTA NEGRA - PROHIBIDO

- Emojis en cualquier parte
- Keyword stuffing (>5 veces por 1000 palabras)
- Parrafos de mas de 5 lineas
- Mas de 500 palabras sin subheading
- "Clic aqui" o "leer mas" como anchor text
- Mayusculas para enfatizar (IMPORTANTE, ATENCION)
- Signos de exclamacion en titulos
- Urgencia artificial ("solo hoy", "ultimas plazas")
- Mas de 2 CTAs por articulo
- Enlaces en seccion FAQ

### 8. ORTOGRAFIA ESPANOLA - OBLIGATORIO

SIEMPRE usar tildes correctamente:
- tramites -> tramites (INCORRECTO) -> trámites (CORRECTO)
- Espana -> España
- informacion -> información
- titulo -> título
- apostilla electronica -> apostilla electrónica
- homologacion -> homologación
- como -> cómo (en preguntas)
- que -> qué (en preguntas)
- cual -> cuál
- donde -> dónde
- cuando -> cuándo
- por que -> por qué
- mas -> más
- facil -> fácil
- rapido -> rápido
- numero -> número
- tambien -> también
- asi -> así
- aqui -> aquí
- alli -> allí
- despues -> después
- dias -> días
- pais -> país
- Proximamente -> Próximamente
- seccion -> sección
- defuncion -> defunción
- solteria -> soltería
- reagrupacion -> reagrupación

---

## PROCESO DE PUBLICACION EN SANITY

### Paso 1: Verificar schema
```
Usar mcp__Sanity__get_schema para verificar campos disponibles
Resource: projectId: [obtener de sanity.config.ts], dataset: production
```

### Paso 2: Generar contenido
```
Generar el articulo siguiendo todas las reglas anteriores
```

### Paso 3: Crear documento en Sanity
```
Usar mcp__Sanity__create_documents_from_markdown con:
- type: "post"
- markdown: [contenido generado]
- resource: { projectId: "...", dataset: "production" }
```

### Paso 4: Completar metadatos con patch
```
Usar mcp__Sanity__patch_document_from_json para agregar:
- category
- country
- documentType
- keywords (array)
- targetCountry: "espana"
```

### Paso 5: Publicar (si no es --draft)
```
Usar mcp__Sanity__publish_documents con el ID del documento creado
```

### Paso 6: Confirmar
```
Mostrar:
- URL del articulo: https://tramitia.es/blog/[slug]
- Estado: publicado/borrador
- Campos completados
```

---

## CONFIGURACION SANITY

**Project ID:** Obtener de `studio/sanity.config.ts`
**Dataset:** production
**Workspace:** default

---

## CHECKLIST ANTES DE PUBLICAR

- [ ] Titulo 50-60 caracteres con keyword
- [ ] Meta description 145-155 caracteres
- [ ] Primer parrafo responde pregunta en <50 palabras
- [ ] 3-7 secciones H2
- [ ] FAQ con 4-8 preguntas
- [ ] 1 CTA principal
- [ ] 2-5 enlaces internos (NO en FAQ)
- [ ] Sin emojis
- [ ] Tildes correctas en todo el texto
- [ ] Entidades oficiales mencionadas
- [ ] Datos numericos verificables
