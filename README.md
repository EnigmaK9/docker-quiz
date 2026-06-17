# Docker Quiz - Certifícate en Docker

Quiz interactivo de 150 preguntas sobre Docker. Responde 10 preguntas aleatorias, obtén tu puntuación, y recibe un certificado en PDF si apruebas con 8/10 o más.

## Cómo usar

1. Abre `index.html` en tu navegador
2. Introduce tu nombre y haz clic en **Comenzar**
3. Responde las 10 preguntas (usa teclas 1-4 + Enter, o clic)
4. Si aciertas 8 o más, se descarga automáticamente tu certificado en PDF
5. También se descarga un CSV con tus respuestas

## Tecnologías

- HTML5 + CSS3 (Bootstrap 4.5)
- JavaScript vanilla (sin frameworks)
- jsPDF para generación de certificados
- Web Audio API para sonidos de acierto/error
- Font Awesome para iconos

## Estructura

```
.
├── index.html    # Interfaz de la aplicación
├── script.js     # Lógica del quiz + 150 preguntas + generación de diploma
└── styles.css    # Estilos personalizados
```

## Temas de las preguntas

- Fundamentos de Docker (contenedores, imágenes, arquitectura)
- Dockerfile (FROM, RUN, CMD, ENTRYPOINT, COPY, ADD, ENV, ARG, VOLUME, USER, WORKDIR, EXPOSE, HEALTHCHECK)
- Comandos Docker CLI (`docker run`, `docker build`, `docker ps`, `docker exec`, `docker logs`, etc.)
- Volúmenes y almacenamiento (volumes, bind mounts, tmpfs)
- Redes Docker (bridge, host, overlay, macvlan)
- Docker Compose (servicios, dependencias, variables de entorno)
- Docker Swarm (servicios, secretos, configs, stacks)
- Seguridad (capabilities, `--privileged`, USER, `--read-only`)
- Optimización (multi-stage builds, BuildKit, caché de capas)
- Registros (Docker Hub, registros privados, OCI)
