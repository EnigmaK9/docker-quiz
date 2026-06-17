const _question = document.getElementById('question');
const _options = document.querySelector('.quiz-options');
const _checkBtn = document.getElementById('check-answer');
const _playAgainBtn = document.getElementById('play-again');
const _result = document.getElementById('result');
const _correctScore = document.getElementById('correct-score');
const _totalQuestion = document.getElementById('total-question');
const _usernameInput = document.getElementById('username');
const _startQuizBtn = document.getElementById('start-quiz');
const _userForm = document.getElementById('user-form');
const _quizContainer = document.getElementById('quiz-container');

function playSuccessSound() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;
    [523.25, 659.25, 783.99].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.15, now + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.3);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(now + i * 0.1); osc.stop(now + i * 0.1 + 0.3);
    });
}
function playErrorSound() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;
    [200, 150].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.1, now + i * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.25);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(now + i * 0.15); osc.stop(now + i * 0.15 + 0.25);
    });
}

let correctAnswer = "", correctScore = askedCount = 0, totalQuestion = 10;
let respuestasUsuario = [];
let preguntasSeleccionadas = [];

const preguntas = [
    // Pregunta 1
    {
        pregunta: "¿Qué es Docker?",
        respuestas: ["Una plataforma de contenedores que permite empaquetar, distribuir y ejecutar aplicaciones", "Un sistema operativo para servidores", "Un lenguaje de programación", "Un editor de código"],
        correcta: "Una plataforma de contenedores que permite empaquetar, distribuir y ejecutar aplicaciones"
    },
    // Pregunta 2
    {
        pregunta: "¿En qué lenguaje de programación está escrito Docker?",
        respuestas: ["Go", "Python", "Java", "C++"],
        correcta: "Go"
    },
    // Pregunta 3
    {
        pregunta: "¿En qué año se lanzó Docker por primera vez?",
        respuestas: ["2013", "2010", "2015", "2012"],
        correcta: "2013"
    },
    // Pregunta 4
    {
        pregunta: "¿Cuál es la principal diferencia entre un contenedor y una máquina virtual?",
        respuestas: ["Los contenedores comparten el kernel del host, las VMs tienen su propio SO completo", "Los contenedores son más pesados que las VMs", "Las VMs no necesitan sistema operativo", "Los contenedores solo funcionan en Linux"],
        correcta: "Los contenedores comparten el kernel del host, las VMs tienen su propio SO completo"
    },
    // Pregunta 5
    {
        pregunta: "¿Qué es una imagen Docker?",
        respuestas: ["Una plantilla inmutable con las instrucciones para crear un contenedor", "Un contenedor en ejecución", "Un archivo de configuración de red", "Un volumen de almacenamiento persistente"],
        correcta: "Una plantilla inmutable con las instrucciones para crear un contenedor"
    },
    // Pregunta 6
    {
        pregunta: "¿Qué es un contenedor Docker?",
        respuestas: ["Una instancia en ejecución de una imagen Docker", "Un archivo comprimido con código fuente", "Una base de datos embebida", "Un servidor web exclusivo"],
        correcta: "Una instancia en ejecución de una imagen Docker"
    },
    // Pregunta 7
    {
        pregunta: "¿Qué es Docker Hub?",
        respuestas: ["Un registro público de imágenes Docker", "Un orquestador de contenedores", "Una herramienta de CI/CD", "Un editor de Dockerfiles"],
        correcta: "Un registro público de imágenes Docker"
    },
    // Pregunta 8
    {
        pregunta: "¿Qué comando se usa para descargar una imagen de Docker Hub?",
        respuestas: ["docker pull", "docker download", "docker get", "docker fetch"],
        correcta: "docker pull"
    },
    // Pregunta 9
    {
        pregunta: "¿Qué comando se usa para listar las imágenes descargadas localmente?",
        respuestas: ["docker images", "docker list", "docker show", "docker ps -a"],
        correcta: "docker images"
    },
    // Pregunta 10
    {
        pregunta: "¿Qué comando se usa para ver los contenedores en ejecución?",
        respuestas: ["docker ps", "docker ls", "docker status", "docker show"],
        correcta: "docker ps"
    },
    // Pregunta 11
    {
        pregunta: "¿Qué flag se usa con `docker ps` para ver también los contenedores detenidos?",
        respuestas: ["-a", "-d", "-s", "-l"],
        correcta: "-a"
    },
    // Pregunta 12
    {
        pregunta: "¿Qué comando se usa para ejecutar un contenedor?",
        respuestas: ["docker run", "docker start", "docker exec", "docker launch"],
        correcta: "docker run"
    },
    // Pregunta 13
    {
        pregunta: "¿Qué flag de `docker run` ejecuta el contenedor en segundo plano?",
        respuestas: ["-d (detached mode)", "-b (background)", "-f (foreground)", "-s (silent)"],
        correcta: "-d (detached mode)"
    },
    // Pregunta 14
    {
        pregunta: "¿Qué flag de `docker run` asigna un puerto del host al puerto del contenedor?",
        respuestas: ["-p (publish)", "-e (expose)", "-m (map)", "-n (network)"],
        correcta: "-p (publish)"
    },
    // Pregunta 15
    {
        pregunta: "¿Cómo se asigna el puerto 8080 del host al puerto 80 del contenedor?",
        respuestas: ["docker run -p 8080:80", "docker run -p 80:8080", "docker run --port 8080:80", "docker run --expose 8080:80"],
        correcta: "docker run -p 8080:80"
    },
    // Pregunta 16
    {
        pregunta: "¿Qué comando detiene un contenedor en ejecución?",
        respuestas: ["docker stop", "docker kill", "docker halt", "docker pause"],
        correcta: "docker stop"
    },
    // Pregunta 17
    {
        pregunta: "¿Qué comando elimina un contenedor detenido?",
        respuestas: ["docker rm", "docker delete", "docker remove", "docker erase"],
        correcta: "docker rm"
    },
    // Pregunta 18
    {
        pregunta: "¿Qué comando elimina una imagen Docker?",
        respuestas: ["docker rmi", "docker rm image", "docker delete image", "docker img rm"],
        correcta: "docker rmi"
    },
    // Pregunta 19
    {
        pregunta: "¿Qué archivo define cómo construir una imagen Docker?",
        respuestas: ["Dockerfile", "docker-compose.yml", "Dockerfile.yaml", "docker.config"],
        correcta: "Dockerfile"
    },
    // Pregunta 20
    {
        pregunta: "¿Cuál es la instrucción que debe ir primero en un Dockerfile?",
        respuestas: ["FROM", "RUN", "CMD", "COPY"],
        correcta: "FROM"
    },
    // Pregunta 21
    {
        pregunta: "¿Para qué sirve la instrucción FROM en un Dockerfile?",
        respuestas: ["Especifica la imagen base sobre la que se construye", "Define el nombre de la nueva imagen", "Copia archivos desde el host", "Ejecuta comandos durante la construcción"],
        correcta: "Especifica la imagen base sobre la que se construye"
    },
    // Pregunta 22
    {
        pregunta: "¿Para qué sirve la instrucción RUN en un Dockerfile?",
        respuestas: ["Ejecuta comandos durante la construcción de la imagen", "Ejecuta comandos al iniciar el contenedor", "Copia archivos al contenedor", "Define variables de entorno"],
        correcta: "Ejecuta comandos durante la construcción de la imagen"
    },
    // Pregunta 23
    {
        pregunta: "¿Para qué sirve la instrucción CMD en un Dockerfile?",
        respuestas: ["Define el comando por defecto que se ejecuta al iniciar el contenedor", "Ejecuta comandos durante la construcción", "Copia archivos al contenedor", "Expone puertos de red"],
        correcta: "Define el comando por defecto que se ejecuta al iniciar el contenedor"
    },
    // Pregunta 24
    {
        pregunta: "¿Cuál es la diferencia entre CMD y ENTRYPOINT?",
        respuestas: ["CMD tiene valores por defecto que pueden sobrescribirse; ENTRYPOINT define el ejecutable principal", "Son exactamente iguales", "CMD se ejecuta durante el build, ENTRYPOINT al iniciar", "ENTRYPOINT es obsoleto, solo se usa CMD"],
        correcta: "CMD tiene valores por defecto que pueden sobrescribirse; ENTRYPOINT define el ejecutable principal"
    },
    // Pregunta 25
    {
        pregunta: "¿Para qué sirve la instrucción COPY en un Dockerfile?",
        respuestas: ["Copia archivos desde el host al sistema de archivos del contenedor", "Ejecuta comandos en el contenedor", "Establece el directorio de trabajo", "Define una variable de entorno"],
        correcta: "Copia archivos desde el host al sistema de archivos del contenedor"
    },
    // Pregunta 26
    {
        pregunta: "¿Cuál es la diferencia entre COPY y ADD en un Dockerfile?",
        respuestas: ["ADD puede descargar URLs y extraer archivos tar; COPY solo copia archivos locales", "COPY puede descargar URLs; ADD solo copia archivos locales", "Son exactamente iguales", "ADD está obsoleto, solo se usa COPY"],
        correcta: "ADD puede descargar URLs y extraer archivos tar; COPY solo copia archivos locales"
    },
    // Pregunta 27
    {
        pregunta: "¿Para qué sirve la instrucción WORKDIR en un Dockerfile?",
        respuestas: ["Establece el directorio de trabajo para las instrucciones siguientes", "Define el directorio de salida de la build", "Copia el directorio de trabajo del host", "Especifica el directorio de logs"],
        correcta: "Establece el directorio de trabajo para las instrucciones siguientes"
    },
    // Pregunta 28
    {
        pregunta: "¿Para qué sirve la instrucción EXPOSE en un Dockerfile?",
        respuestas: ["Documenta en qué puerto escucha el contenedor (no publica el puerto)", "Publica automáticamente el puerto al host", "Abre un puerto en el firewall", "Crea una regla de red en Docker"],
        correcta: "Documenta en qué puerto escucha el contenedor (no publica el puerto)"
    },
    // Pregunta 29
    {
        pregunta: "¿Para qué sirve la instrucción ENV en un Dockerfile?",
        respuestas: ["Define variables de entorno", "Establece el encoding del contenedor", "Habilita características experimentales", "Configura el entorno de red"],
        correcta: "Define variables de entorno"
    },
    // Pregunta 30
    {
        pregunta: "¿Para qué sirve la instrucción VOLUME en un Dockerfile?",
        respuestas: ["Crea un punto de montaje para almacenamiento persistente", "Define el tamaño máximo del contenedor", "Especifica el volumen de logs", "Comprime los archivos del contenedor"],
        correcta: "Crea un punto de montaje para almacenamiento persistente"
    },
    // Pregunta 31
    {
        pregunta: "¿Para qué sirve la instrucción USER en un Dockerfile?",
        respuestas: ["Establece el usuario con el que se ejecuta el contenedor", "Define el nombre del creador de la imagen", "Configura la autenticación con Docker Hub", "Crea un nuevo usuario en el host"],
        correcta: "Establece el usuario con el que se ejecuta el contenedor"
    },
    // Pregunta 32
    {
        pregunta: "¿Qué comando construye una imagen desde un Dockerfile?",
        respuestas: ["docker build", "docker create", "docker compile", "docker make"],
        correcta: "docker build"
    },
    // Pregunta 33
    {
        pregunta: "¿Qué flag se usa para etiquetar una imagen al construirla?",
        respuestas: ["-t", "-n", "-l", "-i"],
        correcta: "-t"
    },
    // Pregunta 34
    {
        pregunta: "¿Cuál es la sintaxis correcta para etiquetar una imagen?",
        respuestas: ["docker build -t nombre:tag .", "docker build --name nombre:tag .", "docker build -l nombre:tag .", "docker build -tag nombre:tag ."],
        correcta: "docker build -t nombre:tag ."
    },
    // Pregunta 35
    {
        pregunta: "¿Qué son las capas (layers) en una imagen Docker?",
        respuestas: ["Cada instrucción del Dockerfile crea una capa que se almacena en caché", "Son backups de la imagen", "Son los archivos de configuración de red", "Son los logs de construcción"],
        correcta: "Cada instrucción del Dockerfile crea una capa que se almacena en caché"
    },
    // Pregunta 36
    {
        pregunta: "¿Qué comando se usa para publicar una imagen en Docker Hub?",
        respuestas: ["docker push", "docker upload", "docker publish", "docker deploy"],
        correcta: "docker push"
    },
    // Pregunta 37
    {
        pregunta: "¿Qué comando se usa para iniciar sesión en Docker Hub desde la CLI?",
        respuestas: ["docker login", "docker auth", "docker connect", "docker signin"],
        correcta: "docker login"
    },
    // Pregunta 38
    {
        pregunta: "¿Qué es Docker Compose?",
        respuestas: ["Una herramienta para definir y ejecutar aplicaciones multi-contenedor", "Un editor de Dockerfiles", "Un servicio de orquestación en la nube", "Una alternativa a Docker Engine"],
        correcta: "Una herramienta para definir y ejecutar aplicaciones multi-contenedor"
    },
    // Pregunta 39
    {
        pregunta: "¿Cuál es el archivo de configuración principal de Docker Compose?",
        respuestas: ["docker-compose.yml", "Dockerfile", "compose.config", "docker.yaml"],
        correcta: "docker-compose.yml"
    },
    // Pregunta 40
    {
        pregunta: "¿Qué comando inicia los servicios definidos en docker-compose.yml?",
        respuestas: ["docker compose up", "docker compose start", "docker compose run", "docker compose launch"],
        correcta: "docker compose up"
    },
    // Pregunta 41
    {
        pregunta: "¿Qué flag se usa para ejecutar docker compose en segundo plano?",
        respuestas: ["-d (detached)", "-b (background)", "-s (silent)", "-f (forever)"],
        correcta: "-d (detached)"
    },
    // Pregunta 42
    {
        pregunta: "¿Qué comando detiene y elimina los servicios de Docker Compose?",
        respuestas: ["docker compose down", "docker compose stop", "docker compose rm", "docker compose delete"],
        correcta: "docker compose down"
    },
    // Pregunta 43
    {
        pregunta: "¿Qué comando reconstruye las imágenes antes de iniciar los servicios?",
        respuestas: ["docker compose up --build", "docker compose rebuild", "docker compose build up", "docker compose --force up"],
        correcta: "docker compose up --build"
    },
    // Pregunta 44
    {
        pregunta: "¿Qué son los volúmenes en Docker?",
        respuestas: ["Mecanismo para persistir datos generados y usados por contenedores", "Copias de seguridad de imágenes", "Archivos de configuración de red", "Registros de actividad del contenedor"],
        correcta: "Mecanismo para persistir datos generados y usados por contenedores"
    },
    // Pregunta 45
    {
        pregunta: "¿Qué comando crea un volumen Docker?",
        respuestas: ["docker volume create", "docker create volume", "docker vol create", "docker new volume"],
        correcta: "docker volume create"
    },
    // Pregunta 46
    {
        pregunta: "¿Qué comando lista los volúmenes existentes?",
        respuestas: ["docker volume ls", "docker volumes", "docker list volumes", "docker show volumes"],
        correcta: "docker volume ls"
    },
    // Pregunta 47
    {
        pregunta: "¿Qué es un bind mount en Docker?",
        respuestas: ["Monta un directorio del host directamente en el contenedor", "Un volumen gestionado por Docker", "Un enlace simbólico entre contenedores", "Una copia temporal de archivos"],
        correcta: "Monta un directorio del host directamente en el contenedor"
    },
    // Pregunta 48
    {
        pregunta: "¿Qué tipo de redes puede crear Docker?",
        respuestas: ["Bridge, Host, Overlay, Macvlan y None", "Solo Bridge y Host", "TCP, UDP, HTTP y FTP", "LAN, WAN y VPN"],
        correcta: "Bridge, Host, Overlay, Macvlan y None"
    },
    // Pregunta 49
    {
        pregunta: "¿Cuál es la red por defecto a la que se conecta un contenedor?",
        respuestas: ["Bridge", "Host", "Overlay", "None"],
        correcta: "Bridge"
    },
    // Pregunta 50
    {
        pregunta: "¿Qué comando crea una red en Docker?",
        respuestas: ["docker network create", "docker create network", "docker net create", "docker new network"],
        correcta: "docker network create"
    },
    // Pregunta 51
    {
        pregunta: "¿Cómo se listan las redes disponibles en Docker?",
        respuestas: ["docker network ls", "docker networks", "docker list networks", "docker net show"],
        correcta: "docker network ls"
    },
    // Pregunta 52
    {
        pregunta: "¿Para qué sirve el modo de red `host`?",
        respuestas: ["El contenedor comparte la pila de red directamente con el host", "El contenedor no tiene acceso a red", "El contenedor se conecta a una VPN", "El contenedor usa solo localhost"],
        correcta: "El contenedor comparte la pila de red directamente con el host"
    },
    // Pregunta 53
    {
        pregunta: "¿Qué comando ejecuta un comando dentro de un contenedor en ejecución?",
        respuestas: ["docker exec", "docker run", "docker cmd", "docker shell"],
        correcta: "docker exec"
    },
    // Pregunta 54
    {
        pregunta: "¿Cómo se abre una shell interactiva en un contenedor?",
        respuestas: ["docker exec -it contenedor /bin/bash", "docker ssh contenedor", "docker connect contenedor", "docker shell contenedor"],
        correcta: "docker exec -it contenedor /bin/bash"
    },
    // Pregunta 55
    {
        pregunta: "¿Qué comando muestra los logs de un contenedor?",
        respuestas: ["docker logs", "docker show logs", "docker tail", "docker output"],
        correcta: "docker logs"
    },
    // Pregunta 56
    {
        pregunta: "¿Qué flag de `docker logs` sigue la salida en tiempo real?",
        respuestas: ["-f (follow)", "-t (tail)", "-l (live)", "-s (stream)"],
        correcta: "-f (follow)"
    },
    // Pregunta 57
    {
        pregunta: "¿Qué comando inspecciona los detalles de un contenedor o imagen?",
        respuestas: ["docker inspect", "docker info", "docker details", "docker show"],
        correcta: "docker inspect"
    },
    // Pregunta 58
    {
        pregunta: "¿Qué comando muestra las estadísticas de uso de recursos de los contenedores?",
        respuestas: ["docker stats", "docker top", "docker metrics", "docker monitor"],
        correcta: "docker stats"
    },
    // Pregunta 59
    {
        pregunta: "¿Qué comando copia archivos entre el contenedor y el host?",
        respuestas: ["docker cp", "docker copy", "docker transfer", "docker scp"],
        correcta: "docker cp"
    },
    // Pregunta 60
    {
        pregunta: "¿Qué comando elimina todos los contenedores detenidos, redes no usadas e imágenes dangling?",
        respuestas: ["docker system prune", "docker cleanup", "docker gc", "docker flush"],
        correcta: "docker system prune"
    },
    // Pregunta 61
    {
        pregunta: "¿Qué es un Dockerfile multi-etapa (multi-stage build)?",
        respuestas: ["Un Dockerfile con varios FROM que permite separar la etapa de construcción de la de producción", "Un Dockerfile que genera múltiples imágenes", "Un Dockerfile para múltiples sistemas operativos", "Un Dockerfile con múltiples CMD"],
        correcta: "Un Dockerfile con varios FROM que permite separar la etapa de construcción de la de producción"
    },
    // Pregunta 62
    {
        pregunta: "¿Qué instrucción se usa para copiar archivos desde una etapa anterior en un multi-stage build?",
        respuestas: ["COPY --from=etapa", "COPY --stage=etapa", "COPY --previous etapa", "COPY --source etapa"],
        correcta: "COPY --from=etapa"
    },
    // Pregunta 63
    {
        pregunta: "¿Qué es el Docker Daemon (dockerd)?",
        respuestas: ["El servicio en segundo plano que gestiona imágenes, contenedores, redes y volúmenes", "La interfaz gráfica de Docker", "El cliente de línea de comandos", "El registro de imágenes"],
        correcta: "El servicio en segundo plano que gestiona imágenes, contenedores, redes y volúmenes"
    },
    // Pregunta 64
    {
        pregunta: "¿Qué es containerd?",
        respuestas: ["El runtime de contenedores que gestiona el ciclo de vida del contenedor", "El daemon principal de Docker", "La herramienta CLI de Docker", "El sistema de archivos de Docker"],
        correcta: "El runtime de contenedores que gestiona el ciclo de vida del contenedor"
    },
    // Pregunta 65
    {
        pregunta: "¿Cuál de los siguientes NO es un componente de Docker Engine?",
        respuestas: ["Docker Swarm", "dockerd (Docker Daemon)", "containerd", "runc"],
        correcta: "Docker Swarm"
    },
    // Pregunta 66
    {
        pregunta: "¿Qué es el `.dockerignore`?",
        respuestas: ["Un archivo que excluye archivos del contexto de construcción", "Un archivo de configuración del daemon", "Un archivo que lista imágenes ignoradas", "Un comando para ignorar contenedores"],
        correcta: "Un archivo que excluye archivos del contexto de construcción"
    },
    // Pregunta 67
    {
        pregunta: "¿Qué es el contexto de construcción (build context) en Docker?",
        respuestas: ["El conjunto de archivos que se envían al daemon para construir una imagen", "El directorio donde se guardan las imágenes", "La configuración de red del contenedor", "El historial de builds anteriores"],
        correcta: "El conjunto de archivos que se envían al daemon para construir una imagen"
    },
    // Pregunta 68
    {
        pregunta: "¿Qué flag de `docker run` asigna un nombre al contenedor?",
        respuestas: ["--name", "-n", "--tag", "-l"],
        correcta: "--name"
    },
    // Pregunta 69
    {
        pregunta: "¿Qué hace `docker run --rm`?",
        respuestas: ["Elimina automáticamente el contenedor cuando se detiene", "Reinicia el contenedor si falla", "Elimina la imagen después de usarla", "Ejecuta el contenedor como root"],
        correcta: "Elimina automáticamente el contenedor cuando se detiene"
    },
    // Pregunta 70
    {
        pregunta: "¿Qué hace `docker run --restart always`?",
        respuestas: ["Reinicia el contenedor siempre que se detenga, incluso al reiniciar el daemon", "Nunca detiene el contenedor", "Ejecuta el contenedor cada minuto", "Reinicia Docker Engine al fallar"],
        correcta: "Reinicia el contenedor siempre que se detenga, incluso al reiniciar el daemon"
    },
    // Pregunta 71
    {
        pregunta: "¿Qué hace `docker run -e`?",
        respuestas: ["Define una variable de entorno en el contenedor", "Expone un puerto", "Ejecuta como usuario root", "Habilita el modo privilegiado"],
        correcta: "Define una variable de entorno en el contenedor"
    },
    // Pregunta 72
    {
        pregunta: "¿Qué es una imagen `dangling`?",
        respuestas: ["Una imagen sin etiqueta, generalmente capas intermedias obsoletas", "Una imagen corrupta", "Una imagen en construcción", "Una imagen sin permisos de acceso"],
        correcta: "Una imagen sin etiqueta, generalmente capas intermedias obsoletas"
    },
    // Pregunta 73
    {
        pregunta: "¿Qué es Alpine Linux en el contexto de Docker?",
        respuestas: ["Una distribución Linux mínima muy usada como imagen base por su pequeño tamaño (~5MB)", "Un orquestador de contenedores", "Un sistema de archivos para Docker", "Una herramienta de monitoreo de contenedores"],
        correcta: "Una distribución Linux mínima muy usada como imagen base por su pequeño tamaño (~5MB)"
    },
    // Pregunta 74
    {
        pregunta: "¿Qué es la instrucción HEALTHCHECK en un Dockerfile?",
        respuestas: ["Define un comando para verificar si el contenedor sigue funcionando correctamente", "Revisa la seguridad de la imagen", "Monitoriza el uso de CPU", "Verifica la conectividad de red"],
        correcta: "Define un comando para verificar si el contenedor sigue funcionando correctamente"
    },
    // Pregunta 75
    {
        pregunta: "¿Qué es la instrucción ARG en un Dockerfile?",
        respuestas: ["Define una variable disponible solo durante la construcción de la imagen", "Define un argumento de línea de comandos para el contenedor", "Especifica la arquitectura del procesador", "Declara un array de opciones"],
        correcta: "Define una variable disponible solo durante la construcción de la imagen"
    },
    // Pregunta 76
    {
        pregunta: "¿Cuál es la diferencia entre ARG y ENV?",
        respuestas: ["ARG solo está disponible durante el build; ENV persiste en el contenedor en ejecución", "ENV es para strings, ARG para números", "ARG es para producción, ENV para desarrollo", "Son exactamente iguales"],
        correcta: "ARG solo está disponible durante el build; ENV persiste en el contenedor en ejecución"
    },
    // Pregunta 77
    {
        pregunta: "¿Qué es una imagen `scratch` en Docker?",
        respuestas: ["Una imagen base completamente vacía para construir desde cero", "Una imagen dañada", "Una imagen temporal", "Una imagen de prueba"],
        correcta: "Una imagen base completamente vacía para construir desde cero"
    },
    // Pregunta 78
    {
        pregunta: "¿Qué comando etiqueta una imagen existente?",
        respuestas: ["docker tag", "docker label", "docker rename", "docker retag"],
        correcta: "docker tag"
    },
    // Pregunta 79
    {
        pregunta: "¿Qué es Docker Swarm?",
        respuestas: ["La herramienta de orquestación nativa de Docker para clústeres", "Un tipo de red de Docker", "Un comando para eliminar contenedores", "Una imagen base de Docker"],
        correcta: "La herramienta de orquestación nativa de Docker para clústeres"
    },
    // Pregunta 80
    {
        pregunta: "¿Qué es un `service` en Docker Swarm?",
        respuestas: ["La definición de una tarea a ejecutar en un nodo del clúster Swarm", "Un contenedor individual", "Un volumen compartido", "Una regla de firewall"],
        correcta: "La definición de una tarea a ejecutar en un nodo del clúster Swarm"
    },
    // Pregunta 81
    {
        pregunta: "¿Cuál es el comando para ver el historial de capas de una imagen?",
        respuestas: ["docker history", "docker layers", "docker image inspect", "docker show-layers"],
        correcta: "docker history"
    },
    // Pregunta 82
    {
        pregunta: "¿Cuál es la mejor práctica para el orden de instrucciones en un Dockerfile?",
        respuestas: ["Poner primero lo que cambia menos para aprovechar la caché de capas", "Poner primero lo que cambia más", "El orden no importa", "Poner siempre COPY antes que FROM"],
        correcta: "Poner primero lo que cambia menos para aprovechar la caché de capas"
    },
    // Pregunta 83
    {
        pregunta: "¿Qué hace el comando `docker diff contenedor`?",
        respuestas: ["Muestra los cambios en el sistema de archivos del contenedor", "Compara dos contenedores", "Muestra la diferencia entre dos imágenes", "Compara el contenedor con su imagen base"],
        correcta: "Muestra los cambios en el sistema de archivos del contenedor"
    },
    // Pregunta 84
    {
        pregunta: "¿Qué comando guarda una imagen como archivo tar?",
        respuestas: ["docker save", "docker export", "docker backup", "docker archive"],
        correcta: "docker save"
    },
    // Pregunta 85
    {
        pregunta: "¿Qué comando carga una imagen desde un archivo tar?",
        respuestas: ["docker load", "docker import", "docker restore", "docker unarchive"],
        correcta: "docker load"
    },
    // Pregunta 86
    {
        pregunta: "¿Cuál es la diferencia entre `docker save` y `docker export`?",
        respuestas: ["save guarda una imagen con su historial de capas; export guarda solo el sistema de archivos de un contenedor", "save comprime, export no", "save es para Linux, export para Windows", "Son exactamente iguales"],
        correcta: "save guarda una imagen con su historial de capas; export guarda solo el sistema de archivos de un contenedor"
    },
    // Pregunta 87
    {
        pregunta: "¿Qué flag de `docker run` limita el uso de memoria?",
        respuestas: ["--memory", "--ram", "--limit", "--cap"],
        correcta: "--memory"
    },
    // Pregunta 88
    {
        pregunta: "¿Qué flag de `docker run` limita el uso de CPU?",
        respuestas: ["--cpus", "--cpu-limit", "--cores", "--processor"],
        correcta: "--cpus"
    },
    // Pregunta 89
    {
        pregunta: "¿Cuál es un comando típico en un HEALTHCHECK para verificar una aplicación web?",
        respuestas: ["HEALTHCHECK CMD curl -f http://localhost/ || exit 1", "HEALTHCHECK CMD ping localhost", "HEALTHCHECK CMD docker ps", "HEALTHCHECK CMD netstat -tulpn"],
        correcta: "HEALTHCHECK CMD curl -f http://localhost/ || exit 1"
    },
    // Pregunta 90
    {
        pregunta: "¿Para qué sirve la instrucción STOPSIGNAL en un Dockerfile?",
        respuestas: ["Define la señal que se envía para detener el contenedor", "Evita que el contenedor se detenga", "Configura una alerta de parada", "Fuerza la detención inmediata"],
        correcta: "Define la señal que se envía para detener el contenedor"
    },
    // Pregunta 91
    {
        pregunta: "¿Qué es el PID 1 en un contenedor Docker?",
        respuestas: ["El proceso principal que se ejecuta como ENTRYPOINT/CMD del contenedor", "El PID del daemon de Docker", "Un proceso del sistema operativo host", "Un identificador de red"],
        correcta: "El proceso principal que se ejecuta como ENTRYPOINT/CMD del contenedor"
    },
    // Pregunta 92
    {
        pregunta: "¿Qué problema puede causar que el PID 1 no maneje señales correctamente?",
        respuestas: ["El contenedor no se detiene limpiamente con docker stop (timeout y SIGKILL)", "El contenedor consume más memoria", "El contenedor no puede conectarse a internet", "El contenedor se reinicia aleatoriamente"],
        correcta: "El contenedor no se detiene limpiamente con docker stop (timeout y SIGKILL)"
    },
    // Pregunta 93
    {
        pregunta: "¿Qué hace la instrucción SHELL en un Dockerfile?",
        respuestas: ["Cambia el shell por defecto para las instrucciones RUN, CMD y ENTRYPOINT", "Abre una shell interactiva al iniciar", "Define el tipo de terminal", "Configura el prompt del contenedor"],
        correcta: "Cambia el shell por defecto para las instrucciones RUN, CMD y ENTRYPOINT"
    },
    // Pregunta 94
    {
        pregunta: "¿Cuál es la imagen base recomendada para aplicaciones Go en producción?",
        respuestas: ["scratch o alpine tras un multi-stage build para minimizar el tamaño", "ubuntu:latest", "centos:8", "debian:bullseye"],
        correcta: "scratch o alpine tras un multi-stage build para minimizar el tamaño"
    },
    // Pregunta 95
    {
        pregunta: "¿Qué significa el estado `Exited (0)` en un contenedor?",
        respuestas: ["El contenedor terminó exitosamente sin errores (código de salida 0)", "El contenedor fue eliminado", "El contenedor falló con error", "El contenedor está pausado"],
        correcta: "El contenedor terminó exitosamente sin errores (código de salida 0)"
    },
    // Pregunta 96
    {
        pregunta: "¿Qué significa el estado `Exited (1)` en un contenedor?",
        respuestas: ["El contenedor terminó con un error (código de salida distinto de 0)", "El contenedor terminó exitosamente", "El contenedor fue reiniciado", "El contenedor está en pausa"],
        correcta: "El contenedor terminó con un error (código de salida distinto de 0)"
    },
    // Pregunta 97
    {
        pregunta: "¿Qué comando pausa un contenedor sin detenerlo?",
        respuestas: ["docker pause", "docker stop --pause", "docker freeze", "docker suspend"],
        correcta: "docker pause"
    },
    // Pregunta 98
    {
        pregunta: "¿Qué comando reanuda un contenedor pausado?",
        respuestas: ["docker unpause", "docker resume", "docker continue", "docker start"],
        correcta: "docker unpause"
    },
    // Pregunta 99
    {
        pregunta: "¿Qué comando renombra un contenedor?",
        respuestas: ["docker rename", "docker mv", "docker tag", "docker name"],
        correcta: "docker rename"
    },
    // Pregunta 100
    {
        pregunta: "¿Qué hace `docker run --init`?",
        respuestas: ["Usa un proceso init (tini) como PID 1 para manejar señales y procesos zombi", "Inicializa una nueva red", "Crea un volumen inicial", "Ejecuta el contenedor con máxima prioridad"],
        correcta: "Usa un proceso init (tini) como PID 1 para manejar señales y procesos zombi"
    },
    // Pregunta 101
    {
        pregunta: "¿Cuál es la sintaxis correcta en docker-compose.yml para exponer un puerto?",
        respuestas: ["ports:
  - '3000:3000'", "expose:
  - 3000:3000", "publish:
  - 3000:3000", "network:
  - port: 3000"],
        correcta: "ports:
  - '3000:3000'"
    },
    // Pregunta 102
    {
        pregunta: "¿Qué comando de Docker Compose escala un servicio a múltiples instancias?",
        respuestas: ["docker compose up --scale servicio=N", "docker compose scale servicio=N", "docker compose replicate servicio=N", "docker compose expand servicio=N"],
        correcta: "docker compose up --scale servicio=N"
    },
    // Pregunta 103
    {
        pregunta: "¿Cómo se definen dependencias entre servicios en docker-compose.yml?",
        respuestas: ["Con la directiva `depends_on`", "Con la directiva `requires`", "Con la directiva `links`", "Con la directiva `needs`"],
        correcta: "Con la directiva `depends_on`"
    },
    // Pregunta 104
    {
        pregunta: "¿Qué comando de Docker Compose muestra los logs de todos los servicios?",
        respuestas: ["docker compose logs", "docker compose output", "docker compose tail", "docker compose journal"],
        correcta: "docker compose logs"
    },
    // Pregunta 105
    {
        pregunta: "¿Qué directiva en docker-compose.yml carga variables de entorno desde un archivo?",
        respuestas: ["env_file", "environment", "env", "config"],
        correcta: "env_file"
    },
    // Pregunta 106
    {
        pregunta: "¿Qué es un secreto en Docker Swarm?",
        respuestas: ["Un blob de datos cifrados accesible solo por servicios autorizados", "Una contraseña del daemon de Docker", "Un token de API para Docker Hub", "Una clave SSH para acceder al contenedor"],
        correcta: "Un blob de datos cifrados accesible solo por servicios autorizados"
    },
    // Pregunta 107
    {
        pregunta: "¿Qué es una `config` en Docker Swarm?",
        respuestas: ["Datos de configuración no cifrados inyectados en servicios", "Un archivo de configuración del host", "La configuración de red del clúster", "Un tipo especial de volumen"],
        correcta: "Datos de configuración no cifrados inyectados en servicios"
    },
    // Pregunta 108
    {
        pregunta: "¿Cuál es la diferencia entre un secreto y una config en Swarm?",
        respuestas: ["Los secretos se almacenan cifrados en disco; las configs se almacenan sin cifrar", "Las configs son para archivos grandes; los secretos para pequeños", "No hay diferencia", "Los secretos son para producción; las configs para desarrollo"],
        correcta: "Los secretos se almacenan cifrados en disco; las configs se almacenan sin cifrar"
    },
    // Pregunta 109
    {
        pregunta: "¿Qué comando inicializa un clúster Docker Swarm?",
        respuestas: ["docker swarm init", "docker swarm create", "docker cluster init", "docker swarm start"],
        correcta: "docker swarm init"
    },
    // Pregunta 110
    {
        pregunta: "¿Qué comando despliega un stack en Docker Swarm?",
        respuestas: ["docker stack deploy", "docker swarm deploy", "docker deploy stack", "docker compose swarm"],
        correcta: "docker stack deploy"
    },
    // Pregunta 111
    {
        pregunta: "¿Qué es un `network overlay` en Docker?",
        respuestas: ["Una red que permite la comunicación entre contenedores en diferentes hosts del clúster Swarm", "Una red que se superpone al firewall", "Una red exclusiva para un solo host", "Una red para conexiones externas a internet"],
        correcta: "Una red que permite la comunicación entre contenedores en diferentes hosts del clúster Swarm"
    },
    // Pregunta 112
    {
        pregunta: "¿Qué es el DNS interno de Docker?",
        respuestas: ["Resolución de nombres integrada que permite a contenedores comunicarse por nombre de servicio", "Un servidor DNS externo", "Una configuración manual de hosts", "Un plugin de terceros"],
        correcta: "Resolución de nombres integrada que permite a contenedores comunicarse por nombre de servicio"
    },
    // Pregunta 113
    {
        pregunta: "¿Qué es el `docker context`?",
        respuestas: ["Permite cambiar entre diferentes entornos Docker (local, remoto, cloud)", "El contexto de construcción de una imagen", "El directorio de trabajo de Docker", "La configuración regional de Docker"],
        correcta: "Permite cambiar entre diferentes entornos Docker (local, remoto, cloud)"
    },
    // Pregunta 114
    {
        pregunta: "¿Cuál es el formato recomendado para los tags de versión de imágenes Docker?",
        respuestas: ["SemVer (ej: 1.0.0, 1.0, latest)", "Fechas (ej: 2026-06-17)", "Nombres aleatorios", "Solo números de build"],
        correcta: "SemVer (ej: 1.0.0, 1.0, latest)"
    },
    // Pregunta 115
    {
        pregunta: "¿Por qué no se recomienda usar el tag `latest` en producción?",
        respuestas: ["Porque puede apuntar a versiones diferentes sin previo aviso, rompiendo la reproducibilidad", "Porque es más pesado que otros tags", "Porque consume más recursos", "Porque no tiene soporte para HTTPS"],
        correcta: "Porque puede apuntar a versiones diferentes sin previo aviso, rompiendo la reproducibilidad"
    },
    // Pregunta 116
    {
        pregunta: "¿Qué hace `docker container prune`?",
        respuestas: ["Elimina todos los contenedores detenidos", "Pausa todos los contenedores", "Limpia los logs de los contenedores", "Reinicia todos los contenedores"],
        correcta: "Elimina todos los contenedores detenidos"
    },
    // Pregunta 117
    {
        pregunta: "¿Qué hace `docker image prune`?",
        respuestas: ["Elimina imágenes dangling (sin etiqueta y sin usar)", "Elimina todas las imágenes", "Comprime las imágenes", "Re-etiqueta las imágenes"],
        correcta: "Elimina imágenes dangling (sin etiqueta y sin usar)"
    },
    // Pregunta 118
    {
        pregunta: "¿Qué flag de `docker system prune` elimina también todas las imágenes no usadas?",
        respuestas: ["-a (all)", "-f (force)", "-i (images)", "--full"],
        correcta: "-a (all)"
    },
    // Pregunta 119
    {
        pregunta: "¿Qué es un registro (registry) privado en Docker?",
        respuestas: ["Un repositorio propio para almacenar y distribuir imágenes Docker de forma privada", "Una copia local de Docker Hub", "Un firewall para imágenes", "Una herramienta de escaneo de imágenes"],
        correcta: "Un repositorio propio para almacenar y distribuir imágenes Docker de forma privada"
    },
    // Pregunta 120
    {
        pregunta: "¿Qué es Docker Scout?",
        respuestas: ["Una herramienta para analizar vulnerabilidades y obtener recomendaciones en imágenes", "Un explorador de archivos para contenedores", "Un servicio de búsqueda de imágenes en Docker Hub", "Un orquestador de contenedores cloud"],
        correcta: "Una herramienta para analizar vulnerabilidades y obtener recomendaciones en imágenes"
    },
    // Pregunta 121
    {
        pregunta: "¿Qué es Docker BuildKit?",
        respuestas: ["Un sistema de construcción de imágenes mejorado con builds paralelos y caché avanzada", "Un kit de herramientas para Kubernetes", "Una GUI para construir Dockerfiles", "Un plugin de seguridad para imágenes"],
        correcta: "Un sistema de construcción de imágenes mejorado con builds paralelos y caché avanzada"
    },
    // Pregunta 122
    {
        pregunta: "¿Cómo se habilita BuildKit para docker build?",
        respuestas: ["DOCKER_BUILDKIT=1 docker build ...", "docker build --buildkit ...", "docker buildkit enable ...", "buildkit docker build ..."],
        correcta: "DOCKER_BUILDKIT=1 docker build ..."
    },
    // Pregunta 123
    {
        pregunta: "¿Qué hace `docker build --no-cache`?",
        respuestas: ["Construye la imagen sin usar la caché de capas", "Construye sin almacenar la imagen final", "Construye sin conexión a internet", "Construye en modo offline"],
        correcta: "Construye la imagen sin usar la caché de capas"
    },
    // Pregunta 124
    {
        pregunta: "¿Qué son los `labels` en Docker?",
        respuestas: ["Metadatos clave-valor aplicados a imágenes, contenedores y otros objetos Docker", "Etiquetas de versión de imágenes", "Nombres de contenedores", "Tags de red"],
        correcta: "Metadatos clave-valor aplicados a imágenes, contenedores y otros objetos Docker"
    },
    // Pregunta 125
    {
        pregunta: "¿Qué instrucción del Dockerfile define un label?",
        respuestas: ["LABEL", "TAG", "META", "ANNOTATION"],
        correcta: "LABEL"
    },
    // Pregunta 126
    {
        pregunta: "¿Qué es el PID namespace en Docker?",
        respuestas: ["Un namespace de Linux que aísla los procesos del contenedor de los del host", "El identificador del proceso Docker", "El namespace de red del contenedor", "El directorio de PIDs del sistema"],
        correcta: "Un namespace de Linux que aísla los procesos del contenedor de los del host"
    },
    // Pregunta 127
    {
        pregunta: "¿Qué hace `docker run --privileged`?",
        respuestas: ["Otorga todos los capabilities de Linux al contenedor (acceso casi completo al kernel)", "Ejecuta el contenedor como usuario root", "Prioriza el contenedor sobre otros en CPU", "Habilita el modo debug del contenedor"],
        correcta: "Otorga todos los capabilities de Linux al contenedor (acceso casi completo al kernel)"
    },
    // Pregunta 128
    {
        pregunta: "¿Por qué se debe evitar `--privileged` en producción?",
        respuestas: ["Porque otorga demasiados permisos y compromete la seguridad del host", "Porque ralentiza el contenedor significativamente", "Porque no es compatible con Kubernetes", "Porque consume más memoria RAM"],
        correcta: "Porque otorga demasiados permisos y compromete la seguridad del host"
    },
    // Pregunta 129
    {
        pregunta: "¿Qué son los capabilities de Linux en Docker?",
        respuestas: ["Permisos granulares del kernel que se pueden añadir o quitar a un contenedor", "Las capacidades de hardware disponibles", "Las funcionalidades de red del contenedor", "Los límites de recursos (CPU/memoria)"],
        correcta: "Permisos granulares del kernel que se pueden añadir o quitar a un contenedor"
    },
    // Pregunta 130
    {
        pregunta: "¿Qué flag de `docker run` elimina un capability específico?",
        respuestas: ["--cap-drop", "--no-cap", "--remove-cap", "--disable-cap"],
        correcta: "--cap-drop"
    },
    // Pregunta 131
    {
        pregunta: "¿Cuál es una buena práctica de seguridad sobre el usuario en un contenedor?",
        respuestas: ["No ejecutar como root; usar la instrucción USER para cambiar a un usuario sin privilegios", "Ejecutar siempre como root para evitar problemas de permisos", "Desactivar todos los capabilities", "Usar siempre --privileged"],
        correcta: "No ejecutar como root; usar la instrucción USER para cambiar a un usuario sin privilegios"
    },
    // Pregunta 132
    {
        pregunta: "¿Qué hace `docker run --read-only`?",
        respuestas: ["Monta el sistema de archivos del contenedor como solo lectura", "Desactiva la salida de logs del contenedor", "Solo permite leer imágenes locales", "Bloquea el acceso a internet del contenedor"],
        correcta: "Monta el sistema de archivos del contenedor como solo lectura"
    },
    // Pregunta 133
    {
        pregunta: "¿Cuál es el formato correcto para definir variables de entorno en docker-compose.yml?",
        respuestas: ["environment:
  - VARIABLE=valor", "env:
  VARIABLE: valor", "variables:
  - VARIABLE=valor", "config:
  VARIABLE: valor"],
        correcta: "environment:
  - VARIABLE=valor"
    },
    // Pregunta 134
    {
        pregunta: "¿Qué son los `tmpfs mounts` en Docker?",
        respuestas: ["Montajes temporales que almacenan datos en memoria RAM, no en disco", "Montajes de sistemas de archivos comprimidos", "Archivos de intercambio (swap) del contenedor", "Copias de seguridad temporales en disco"],
        correcta: "Montajes temporales que almacenan datos en memoria RAM, no en disco"
    },
    // Pregunta 135
    {
        pregunta: "¿Qué es el `logging driver` en Docker?",
        respuestas: ["El mecanismo que determina dónde y cómo se almacenan los logs de los contenedores", "Un controlador de dispositivos de entrada", "Un driver de almacenamiento para volúmenes", "Un plugin de red para logs"],
        correcta: "El mecanismo que determina dónde y cómo se almacenan los logs de los contenedores"
    },
    // Pregunta 136
    {
        pregunta: "Calcula: Si tienes 40 imágenes y eliminas 15 imágenes dangling, ¿cuántas imágenes quedan?",
        respuestas: ["25 imágenes (si las 15 dangling eran parte de las 40)", "55 imágenes", "40 imágenes", "15 imágenes"],
        correcta: "25 imágenes (si las 15 dangling eran parte de las 40)"
    },
    // Pregunta 137
    {
        pregunta: "¿Qué hace `docker commit`?",
        respuestas: ["Crea una nueva imagen a partir de los cambios realizados en un contenedor", "Confirma un push a Docker Hub", "Guarda el estado del daemon de Docker", "Aplica cambios a un Dockerfile"],
        correcta: "Crea una nueva imagen a partir de los cambios realizados en un contenedor"
    },
    // Pregunta 138
    {
        pregunta: "¿Por qué no se recomienda usar `docker commit` en entornos de producción?",
        respuestas: ["Porque la imagen resultante no es reproducible ni versionable como un Dockerfile", "Porque es un comando muy lento", "Porque solo funciona en Windows", "Porque elimina el contenedor original"],
        correcta: "Porque la imagen resultante no es reproducible ni versionable como un Dockerfile"
    },
    // Pregunta 139
    {
        pregunta: "¿Qué es la instrucción ONBUILD en un Dockerfile?",
        respuestas: ["Define comandos que se ejecutan cuando la imagen se usa como base para otra build", "Ejecuta comandos al iniciar el contenedor", "Programa una build automática en Docker Hub", "Activa notificaciones al construir la imagen"],
        correcta: "Define comandos que se ejecutan cuando la imagen se usa como base para otra build"
    },
    // Pregunta 140
    {
        pregunta: "¿Para qué sirve `docker events`?",
        respuestas: ["Muestra eventos en tiempo real del daemon de Docker (start, stop, create, etc.)", "Lista los contenedores activos", "Muestra el historial de comandos ejecutados", "Notifica sobre nuevas imágenes en Docker Hub"],
        correcta: "Muestra eventos en tiempo real del daemon de Docker (start, stop, create, etc.)"
    },
    // Pregunta 141
    {
        pregunta: "¿Qué comando muestra los procesos que se ejecutan dentro de un contenedor?",
        respuestas: ["docker top", "docker ps --inside", "docker processes", "docker proc"],
        correcta: "docker top"
    },
    // Pregunta 142
    {
        pregunta: "¿Qué hace `docker wait`?",
        respuestas: ["Bloquea hasta que un contenedor se detenga y muestra su código de salida", "Espera a que un contenedor esté healthy", "Pausa la ejecución de un contenedor", "Espera a que Docker Engine se reinicie"],
        correcta: "Bloquea hasta que un contenedor se detenga y muestra su código de salida"
    },
    // Pregunta 143
    {
        pregunta: "¿Qué es runc?",
        respuestas: ["El runtime de bajo nivel que interactúa con el kernel Linux para crear y ejecutar contenedores", "Un comando alternativo a docker run", "El runtime de alto nivel de Docker", "Un cliente ligero de Docker"],
        correcta: "El runtime de bajo nivel que interactúa con el kernel Linux para crear y ejecutar contenedores"
    },
    // Pregunta 144
    {
        pregunta: "¿Qué es el estándar OCI (Open Container Initiative)?",
        respuestas: ["Especificaciones abiertas para el formato de imágenes y runtime de contenedores", "Un tipo de contenedor optimizado para producción", "Una certificación oficial de Docker Inc.", "Un formato de archivo de configuración de redes"],
        correcta: "Especificaciones abiertas para el formato de imágenes y runtime de contenedores"
    },
    // Pregunta 145
    {
        pregunta: "¿Qué significa que Docker sea compatible con OCI?",
        respuestas: ["Que las imágenes Docker cumplen un estándar abierto portable entre diferentes runtimes", "Que Docker es completamente open source", "Que Docker está certificado para entornos empresariales", "Que Docker solo funciona en sistemas Linux"],
        correcta: "Que las imágenes Docker cumplen un estándar abierto portable entre diferentes runtimes"
    },
    // Pregunta 146
    {
        pregunta: "¿Qué es una `restart policy` en Docker?",
        respuestas: ["Define si y cómo Docker debe reiniciar un contenedor cuando se detiene", "Una política de seguridad para reinicios del daemon", "Un límite de reinicios por hora", "Una regla de firewall para conexiones entrantes"],
        correcta: "Define si y cómo Docker debe reiniciar un contenedor cuando se detiene"
    },
    // Pregunta 147
    {
        pregunta: "¿Cuáles son las posibles `restart policies` en Docker?",
        respuestas: ["no, on-failure, always, unless-stopped", "always, never, sometimes", "restart, no-restart, force", "on-error, on-success, always"],
        correcta: "no, on-failure, always, unless-stopped"
    },
    // Pregunta 148
    {
        pregunta: "¿En qué orden deben ir las instrucciones en un Dockerfile para optimizar la caché de capas?",
        respuestas: ["FROM → Instalar dependencias (RUN) → COPY código → CMD (lo que cambia menos primero)", "CMD → COPY → RUN → FROM", "FROM → CMD → COPY → RUN", "El orden no afecta a la caché de capas"],
        correcta: "FROM → Instalar dependencias (RUN) → COPY código → CMD (lo que cambia menos primero)"
    },
    // Pregunta 149
    {
        pregunta: "¿Qué instrucción del Dockerfile permite que un puerto sea mapeado dinámicamente con el flag -P?",
        respuestas: ["EXPOSE", "PUBLISH", "PORT", "MAP"],
        correcta: "EXPOSE"
    },
    // Pregunta 150
    {
        pregunta: "¿Cuál es el comando para ver la versión instalada de Docker?",
        respuestas: ["docker version", "docker --version", "docker info", "Tanto `docker version` como `docker --version` son válidos"],
        correcta: "Tanto `docker version` como `docker --version` son válidos"
    }
];


function seleccionarPreguntas() {
    const preguntasShuffled = preguntas.sort(() => 0.5 - Math.random());
    preguntasSeleccionadas = preguntasShuffled.slice(0, 10);
}

const preguntasRealizadas = new Set();

function cargarPregunta() {
    if (preguntasRealizadas.size >= preguntasSeleccionadas.length) {
        _result.innerHTML = "<p>¡Se han realizado todas las preguntas disponibles!</p>";
        _playAgainBtn.classList.remove('d-none');
        _checkBtn.classList.add('d-none');
        return;
    }

    let preguntaActual;
    do {
        preguntaActual = preguntasSeleccionadas[Math.floor(Math.random() * preguntasSeleccionadas.length)];
    } while (preguntasRealizadas.has(preguntaActual.pregunta));

    preguntasRealizadas.add(preguntaActual.pregunta);

    _question.innerHTML = preguntaActual.pregunta;
    const opcionesReordenadas = reordenarOpciones(preguntaActual.respuestas);
    _options.innerHTML = opcionesReordenadas.map((respuesta, index) => `<li data-index="${index + 1}">${index + 1}. <span>${respuesta}</span></li>`).join('');
    correctAnswer = preguntaActual.correcta;

    seleccionarOpcion();
}

function reordenarOpciones(opciones) {
    const opcionesCopia = [...opciones];
    for (let i = opcionesCopia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [opcionesCopia[i], opcionesCopia[j]] = [opcionesCopia[j], opcionesCopia[i]];
    }
    return opcionesCopia;
}

function listenersEventos() {
    _checkBtn.addEventListener('click', comprobarRespuesta);
    _playAgainBtn.addEventListener('click', reiniciarJuego);
    document.addEventListener('keydown', manejarTeclado);
    _startQuizBtn.addEventListener('click', startQuiz);
    _usernameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') startQuiz();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    listenersEventos();
});

function startQuiz() {
    const username = _usernameInput.value.trim();
    if (username) {
        _userForm.classList.add('d-none');
        _quizContainer.classList.remove('d-none');
        inicializarJuego();
    } else {
        alert("Por favor, introduce tu nombre.");
    }
}

function inicializarJuego() {
    seleccionarPreguntas();
    cargarPregunta();
    actualizarUI();
}

function actualizarUI() {
    _totalQuestion.textContent = totalQuestion;
    _correctScore.textContent = correctScore;
}

function seleccionarOpcion() {
    _options.querySelectorAll('li').forEach(opcion => {
        opcion.addEventListener('click', () => {
            const opcionActiva = _options.querySelector('.selected');
            if (opcionActiva) {
                opcionActiva.classList.remove('selected');
            }
            opcion.classList.add('selected');
        });
    });
}

function manejarTeclado(e) {
    if (e.key >= '1' && e.key <= '4') {
        const opcion = _options.querySelector(`li[data-index="${e.key}"]`);
        if (opcion) {
            const opcionActiva = _options.querySelector('.selected');
            if (opcionActiva) {
                opcionActiva.classList.remove('selected');
            }
            opcion.classList.add('selected');
        }
    } else if (e.key === 'Enter' && !_quizContainer.classList.contains('d-none')) {
        comprobarRespuesta();
    }
}

function comprobarRespuesta() {
    if (_checkBtn.disabled) return;
    _checkBtn.disabled = true;
    const opcionSeleccionada = _options.querySelector('.selected');
    if (opcionSeleccionada) {
        const respuestaSeleccionada = opcionSeleccionada.querySelector('span').textContent;
        respuestasUsuario.push({
            pregunta: _question.textContent,
            respuesta: respuestaSeleccionada,
            correcta: respuestaSeleccionada === correctAnswer,
            correctaText: correctAnswer
        });
        if (respuestaSeleccionada === correctAnswer) {
            correctScore++;
            playSuccessSound();
            _result.innerHTML = `<p><i class="fas fa-check"></i>¡Respuesta Correcta!</p>`;
        } else {
            playErrorSound();
            _result.innerHTML = `<p><i class="fas fa-times"></i>¡Respuesta Incorrecta!</p> <small><b>Respuesta Correcta: </b>${correctAnswer}</small>`;
            _options.querySelectorAll('li').forEach(opcion => {
                if (opcion.querySelector('span').textContent === correctAnswer) {
                    opcion.classList.add('correct');
                }
            });
        }
        actualizarConteo();
    } else {
        _result.innerHTML = `<p><i class="fas fa-question"></i>¡Por favor selecciona una opción!</p>`;
        _checkBtn.disabled = false;
    }
}

function actualizarConteo() {
    askedCount++;
    setConteo();
    if (askedCount === totalQuestion || preguntasRealizadas.size >= preguntasSeleccionadas.length) {
        setTimeout(() => {
            _result.innerHTML += `<p>Tu puntuación es ${correctScore} de ${totalQuestion}.</p>`;
            _playAgainBtn.classList.remove('d-none');
            _checkBtn.classList.add('d-none');
            if (correctScore >= 8) {
                generarDiploma();
            } else {
                mostrarMensajeBurrazo();
            }
            descargarCSVUsuario();
        }, 4000); // Mostrar la respuesta correcta durante 4 segundos
    } else {
        setTimeout(() => {
            _checkBtn.disabled = false;
            cargarPregunta();
        }, 4000); // Mostrar la respuesta correcta durante 4 segundos
    }
}

function mostrarMensajeBurrazo() {
    const mensajeBurrazo = document.createElement('div');
    mensajeBurrazo.innerHTML = `
        <div id="burrazo-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.8); display: flex; align-items: center; justify-content: center; z-index: 1000;">
            <div style="background: #fff; padding: 20px; border-radius: 8px; text-align: center; max-width: 500px; width: 100%;">
                <h2 style="color: #e74c3c;">¡Eres un burrazo!</h2>
                <p>Lo siento, no alcanzaste la puntuación mínima de 8. Vuelve a intentarlo y saca más de 8.</p>
                <button id="close-burrazo" style="background: #e74c3c; color: #fff; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Intentar de nuevo</button>
            </div>
        </div>
    `;
    document.body.appendChild(mensajeBurrazo);
    
    document.getElementById('close-burrazo').addEventListener('click', () => {
        document.getElementById('burrazo-modal').remove();
    });
}

function setConteo() {
    _totalQuestion.textContent = totalQuestion;
    _correctScore.textContent = correctScore;
}

function reiniciarJuego() {
    if (_result.textContent.includes("Tu puntuación es")) {
        correctScore = askedCount = 0;
        _playAgainBtn.classList.add('d-none');
        _checkBtn.classList.remove('d-none');
        _checkBtn.disabled = false;
        respuestasUsuario.length = 0;
        preguntasRealizadas.clear();
        seleccionarPreguntas();
        setConteo();
        cargarPregunta();
    }
}

function descargarCSVUsuario() {
    const username = _usernameInput.value.trim();
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Pregunta,Respuesta Elegida,Respuesta Correcta\n";
    respuestasUsuario.forEach(({ pregunta, respuesta, correctaText }) => {
        const preguntaSanitizada = pregunta.replace(/,/g, ' ').replace(/(\r\n|\n|\r)/gm, " ");
        const respuestaSanitizada = respuesta.replace(/,/g, ' ').replace(/(\r\n|\n|\r)/gm, " ");
        const correctaSanitizada = correctaText.replace(/,/g, ' ').replace(/(\r\n|\n|\r)/gm, " ");
        csvContent += `${preguntaSanitizada},${respuestaSanitizada},${correctaSanitizada}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `respuestas_usuario_${username}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function generarDiploma() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('landscape');

    const username = _usernameInput.value.trim();
    const score = `${correctScore} / ${totalQuestion}`;

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // ===== CAPA 0: FONDOS (se dibujan primero) =====

    // Banda decorativa central (dentro del margen, no rompe los marcos)
    doc.setFillColor(248, 245, 255);
    doc.rect(16, 28, pageWidth - 32, 52, 'F');

    // ===== CAPA 1: MARCOS (se dibujan encima de los fondos) =====

    // Barras superior e inferior
    doc.setFillColor(124, 58, 237);
    doc.rect(0, 0, pageWidth, 8, 'F');
    doc.rect(0, pageHeight - 8, pageWidth, 8, 'F');

    // Marco doble
    doc.setDrawColor(124, 58, 237);
    doc.setLineWidth(2);
    doc.rect(8, 8, pageWidth - 16, pageHeight - 16, 'S');
    doc.setLineWidth(0.5);
    doc.setDrawColor(180, 140, 255);
    doc.rect(14, 14, pageWidth - 28, pageHeight - 28, 'S');

    // ===== CAPA 2: CONTENIDO =====

    // Título
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(124, 58, 237);
    doc.setFontSize(34);
    doc.text("Certificado de Docker", pageWidth / 2, 48, null, null, "center");

    // Línea decorativa
    doc.setDrawColor(124, 58, 237);
    doc.setLineWidth(1);
    doc.line(pageWidth / 2 - 60, 55, pageWidth / 2 + 60, 55);

    // Círculo decorativo
    doc.setFillColor(124, 58, 237);
    doc.circle(pageWidth / 2, 61, 2, 'F');

    // "Otorgado a:"
    doc.setTextColor(60, 60, 60);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(16);
    doc.text("Otorgado a:", pageWidth / 2, 84, null, null, "center");

    // Nombre del usuario
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(124, 58, 237);
    doc.setFontSize(28);
    doc.text(username, pageWidth / 2, 104, null, null, "center");

    // Descripción
    doc.setTextColor(60, 60, 60);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(16);
    doc.text("Por haber completado exitosamente el", pageWidth / 2, 122, null, null, "center");
    doc.text("cuestionario de certificacion en Docker", pageWidth / 2, 139, null, null, "center");

    // Puntuación en recuadro
    doc.setFillColor(248, 245, 255);
    doc.roundedRect(pageWidth / 2 - 50, 147, 100, 22, 5, 5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(124, 58, 237);
    doc.setFontSize(16);
    doc.text(`Puntuacion: ${score}`, pageWidth / 2, 162, null, null, "center");

    // Separador
    doc.setDrawColor(180, 140, 255);
    doc.setLineWidth(0.5);
    doc.line(pageWidth / 2 - 70, 177, pageWidth / 2 + 70, 177);

    // Firma
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(13);
    doc.text("Firmado por EnigmaK9", pageWidth / 2, 189, null, null, "center");

    // Fecha
    const date = new Date();
    const formattedDate = date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(`Fecha de emision: ${formattedDate}`, pageWidth / 2, 195, null, null, "center");

    doc.save(`certificado_docker_${username}.pdf`);
}