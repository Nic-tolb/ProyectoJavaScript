// ==================== ALMACENAMIENTO EN LOCALSTORAGE ====================
const STORAGE_KEY = 'examenes_data';

// Estructura de datos de un examen
const ExamenTemplate = {
    id: null,
    codigo: '',
    titulo: '',
    tiempo: 0,
    porcentaje: 0,
    descripcion: '',
    preguntas: [],
    fechaCreacion: null,
    fechaActualizacion: null
};

const PreguntaTemplate = {
    id: null,
    texto: '',
    respuestas: [],
    respuestaCorrecta: null
};

const RespuestaTemplate = {
    id: null,
    texto: ''
};

// ==================== FUNCIONES DE ALMACENAMIENTO ====================
class ExamenStorage {
    // Obtener todos los exámenes
    static obtenerTodos() {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }

    // Guardar todos los exámenes
    static guardarTodos(examenes) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(examenes));
    }

    // Obtener examen por ID
    static obtenerPorId(id) {
        const examenes = this.obtenerTodos();
        return examenes.find(e => e.id === id);
    }

    // Guardar o actualizar examen
    static guardarExamen(examen) {
        const examenes = this.obtenerTodos();
        const indice = examenes.findIndex(e => e.id === examen.id);
        
        if (indice === -1) {
            examen.id = Date.now(); // ID único basado en timestamp
            examen.codigo = this.generarCodigo();
            examen.fechaCreacion = new Date().toISOString();
            examenes.push(examen);
        } else {
            examen.fechaActualizacion = new Date().toISOString();
            examenes[indice] = examen;
        }
        
        this.guardarTodos(examenes);
        return examen;
    }

    // Eliminar examen
    static eliminarExamen(id) {
        const examenes = this.obtenerTodos();
        const filtrados = examenes.filter(e => e.id !== id);
        this.guardarTodos(filtrados);
    }

    // Generar código único
    static generarCodigo() {
        const examenes = this.obtenerTodos();
        const numero = examenes.length + 1;
        return `EX-${String(numero).padStart(3, '0')}`;
    }

    // Limpiar todo (solo para desarrollo)
    static limpiar() {
        localStorage.removeItem(STORAGE_KEY);
    }
}

// ==================== GESTIÓN DEL FORMULARIO ====================
class GestorExamenes {
    constructor() {
        this.examenActual = null;
        this.contador_preguntas = 1;
        this.init();
    }

    init() {
        this.attachEventListeners();
        this.cargarExamenes();
        this.inicializarFormulario();
    }

    attachEventListeners() {
        // Botones principales
        document.getElementById('btn-guardar-examen').addEventListener('click', (e) => this.guardarExamen(e));
        document.getElementById('btn-cancelar').addEventListener('click', () => this.limpiarFormulario());
        
        // Preguntas
        document.getElementById('btn-agregar-pregunta').addEventListener('click', () => this.agregarPregunta());
        
        // Tabla
        document.getElementById('examenes-tabla').addEventListener('click', (e) => this.manejarAccionesTabla(e));

        // Eventos para la primera pregunta
        this.attachPreguntaEventListeners(1);
    }

    // ==================== INICIALIZAR FORMULARIO ====================
    inicializarFormulario() {
        // Generar un código automático
        const nuevoCodigo = ExamenStorage.generarCodigo();
        document.getElementById('exam-codigo').value = nuevoCodigo;
    }

    // ==================== GUARDAR EXAMEN ====================
    guardarExamen(e) {
        e.preventDefault();

        const examen = {
            ...this.examenActual || { ...ExamenTemplate },
            codigo: document.getElementById('exam-codigo').value,
            titulo: document.getElementById('exam-titulo').value,
            tiempo: parseInt(document.getElementById('exam-tiempo').value),
            porcentaje: parseInt(document.getElementById('exam-porcentaje').value),
            descripcion: document.getElementById('exam-descripcion').value,
            preguntas: this.recolectarPreguntas()
        };

        // Validaciones básicas
        if (!examen.titulo.trim()) {
            alert('El título del examen es requerido');
            return;
        }

        if (!examen.tiempo || examen.tiempo <= 0) {
            alert('El tiempo debe ser mayor a 0 minutos');
            return;
        }

        if (examen.preguntas.length === 0) {
            alert('El examen debe tener al menos una pregunta');
            return;
        }

        // Validar que cada pregunta tenga respuesta correcta
        const preguntasValidas = examen.preguntas.every(p => p.respuestaCorrecta !== null);
        if (!preguntasValidas) {
            alert('Cada pregunta debe tener una respuesta correcta marcada');
            return;
        }

        ExamenStorage.guardarExamen(examen);
        this.limpiarFormulario();
        this.cargarExamenes();
        alert('Examen guardado correctamente');
    }

    // ==================== RECOLECTAR PREGUNTAS ====================
    recolectarPreguntas() {
        const preguntasDiv = document.getElementById('preguntas-list');
        const preguntasElements = preguntasDiv.querySelectorAll('.pregunta-item');
        const preguntas = [];

        preguntasElements.forEach((el, index) => {
            const preguntaId = el.id;
            const textarea = el.querySelector('.pregunta-body textarea');
            const texto = textarea ? textarea.value.trim() : '';
            const respuestasElements = el.querySelectorAll('.respuesta-item');
            const respuestas = [];
            let respuestaCorrecta = null;

            respuestasElements.forEach((respEl, respIndex) => {
                const inputRespuesta = respEl.querySelector('.respuesta-input');
                const radioButton = respEl.querySelector('input[type="radio"]');
                
                if (inputRespuesta) {
                    const textoResp = inputRespuesta.value.trim();
                    const esCorrecta = radioButton ? radioButton.checked : false;
                    
                    if (textoResp) {
                        respuestas.push({
                            id: respIndex,
                            texto: textoResp
                        });
                        
                        if (esCorrecta) {
                            respuestaCorrecta = respIndex;
                        }
                    }
                }
            });

            if (texto && respuestas.length > 0) {
                preguntas.push({
                    id: index,
                    texto: texto,
                    respuestas: respuestas,
                    respuestaCorrecta: respuestaCorrecta
                });
            }
        });

        return preguntas;
    }

    // ==================== AGREGAR PREGUNTA ====================
    agregarPregunta() {
        const preguntasList = document.getElementById('preguntas-list');
        this.contador_preguntas = preguntasList.children.length + 1;
        const numPregunta = this.contador_preguntas;

        const preguntaHTML = `
            <div class="pregunta-item" id="pregunta-${numPregunta}">
                <div class="pregunta-header">
                    <label>Pregunta ${numPregunta}</label>
                    <button type="button" class="btn-eliminar btn-eliminar-pregunta">Eliminar</button>
                </div>
                <div class="pregunta-body">
                    <textarea id="pregunta-texto-${numPregunta}" placeholder="Escribe la pregunta..."></textarea>
                </div>
                <div class="respuestas-container" id="respuestas-${numPregunta}">
                    <div class="respuesta-item">
                        <input type="radio" name="correcta-${numPregunta}" value="0">
                        <input type="text" placeholder="Opción A" class="respuesta-input">
                        <button type="button" class="btn-eliminar-respuesta">✕</button>
                    </div>
                </div>
                <button type="button" class="btn-agregar-respuesta">+ Agregar respuesta</button>
            </div>
        `;

        preguntasList.insertAdjacentHTML('beforeend', preguntaHTML);
        this.attachPreguntaEventListeners(numPregunta);
    }

    // ==================== EVENTOS DE PREGUNTAS ====================
    attachPreguntaEventListeners(numeroPregunta) {
        const preguntaEl = document.getElementById(`pregunta-${numeroPregunta}`);
        
        if (!preguntaEl) return;

        // Botón eliminar pregunta
        const btnEliminarPregunta = preguntaEl.querySelector('.btn-eliminar-pregunta');
        if (btnEliminarPregunta) {
            btnEliminarPregunta.addEventListener('click', (e) => {
                e.preventDefault();
                if (document.querySelectorAll('.pregunta-item').length === 1) {
                    alert('Debe haber al menos una pregunta');
                    return;
                }
                preguntaEl.remove();
                this.renumerarPreguntas();
            });
        }

        // Botón agregar respuesta
        const btnAgregarRespuesta = preguntaEl.querySelector('.btn-agregar-respuesta');
        if (btnAgregarRespuesta) {
            btnAgregarRespuesta.addEventListener('click', (e) => {
                e.preventDefault();
                this.agregarRespuesta(numeroPregunta);
            });
        }

        // Botones eliminar respuesta
        preguntaEl.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-eliminar-respuesta')) {
                e.preventDefault();
                const respuestasContainer = document.getElementById(`respuestas-${numeroPregunta}`);
                if (respuestasContainer.children.length === 1) {
                    alert('Debe haber al menos una respuesta');
                    return;
                }
                e.target.closest('.respuesta-item').remove();
            }
        });
    }

    // ==================== AGREGAR RESPUESTA ====================
    agregarRespuesta(numeroPregunta) {
        const respuestasContainer = document.getElementById(`respuestas-${numeroPregunta}`);
        const numeroRespuesta = respuestasContainer.children.length;
        const letra = String.fromCharCode(65 + numeroRespuesta);

        const respuestaHTML = `
            <div class="respuesta-item">
                <input type="radio" name="correcta-${numeroPregunta}" value="${numeroRespuesta}">
                <input type="text" placeholder="Opción ${letra}" class="respuesta-input">
                <button type="button" class="btn-eliminar-respuesta">✕</button>
            </div>
        `;

        respuestasContainer.insertAdjacentHTML('beforeend', respuestaHTML);
    }

    // ==================== RENUMERAR PREGUNTAS ====================
    renumerarPreguntas() {
        const preguntasDiv = document.getElementById('preguntas-list');
        const preguntasElements = preguntasDiv.querySelectorAll('.pregunta-item');

        preguntasElements.forEach((el, index) => {
            const numeroNuevo = index + 1;
            el.id = `pregunta-${numeroNuevo}`;
            el.querySelector('label').textContent = `Pregunta ${numeroNuevo}`;
            
            // Actualizar respuestas container
            const respuestasContainer = el.querySelector('.respuestas-container');
            if (respuestasContainer) {
                respuestasContainer.id = `respuestas-${numeroNuevo}`;
                respuestasContainer.querySelectorAll('input[type="radio"]').forEach(radio => {
                    radio.name = `correcta-${numeroNuevo}`;
                });
            }

            // Reasignar event listeners
            this.attachPreguntaEventListeners(numeroNuevo);
        });

        this.contador_preguntas = preguntasElements.length;
    }

    // ==================== CARGAR EXÁMENES ====================
    cargarExamenes() {
        const examenes = ExamenStorage.obtenerTodos();
        const tbody = document.getElementById('examenes-tbody');
        tbody.innerHTML = '';

        if (examenes.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #9ca3af;">No hay exámenes registrados</td></tr>';
            return;
        }

        examenes.forEach(examen => {
            const porcentajeAprobados = Math.floor(Math.random() * 100); // Simulado
            const fila = document.createElement('tr');
            fila.id = `exam-row-${examen.id}`;
            fila.innerHTML = `
                <td>${examen.codigo}</td>
                <td>${examen.titulo}</td>
                <td>${examen.tiempo} min</td>
                <td>${porcentajeAprobados}%</td>
                <td>${examen.preguntas.length}</td>
                <td>
                    <button class="btn-editar btn-editar-exam" data-id="${examen.id}">Editar</button>
                    <button class="btn-eliminar-tabla btn-eliminar-exam" data-id="${examen.id}">Eliminar</button>
                </td>
            `;
            tbody.appendChild(fila);
        });
    }

    // ==================== EDITAR EXAMEN ====================
    editarExamen(id) {
        const examen = ExamenStorage.obtenerPorId(id);
        if (!examen) return;

        this.examenActual = examen;

        // Llenar formulario
        document.getElementById('exam-codigo').value = examen.codigo;
        document.getElementById('exam-titulo').value = examen.titulo;
        document.getElementById('exam-tiempo').value = examen.tiempo;
        document.getElementById('exam-porcentaje').value = examen.porcentaje;
        document.getElementById('exam-descripcion').value = examen.descripcion;

        // Limpiar preguntas anteriores
        const preguntasList = document.getElementById('preguntas-list');
        preguntasList.innerHTML = '';
        this.contador_preguntas = 0;

        // Cargar preguntas
        examen.preguntas.forEach((pregunta, index) => {
            const numeroPregunta = index + 1;
            this.contador_preguntas = numeroPregunta;

            const preguntaHTML = `
                <div class="pregunta-item" id="pregunta-${numeroPregunta}">
                    <div class="pregunta-header">
                        <label>Pregunta ${numeroPregunta}</label>
                        <button type="button" class="btn-eliminar btn-eliminar-pregunta">Eliminar</button>
                    </div>
                    <div class="pregunta-body">
                        <textarea id="pregunta-texto-${numeroPregunta}">${pregunta.texto}</textarea>
                    </div>
                    <div class="respuestas-container" id="respuestas-${numeroPregunta}">
                        ${pregunta.respuestas.map((respuesta, respIndex) => `
                            <div class="respuesta-item">
                                <input type="radio" name="correcta-${numeroPregunta}" value="${respIndex}" ${pregunta.respuestaCorrecta === respIndex ? 'checked' : ''}>
                                <input type="text" value="${respuesta.texto}" class="respuesta-input">
                                <button type="button" class="btn-eliminar-respuesta">✕</button>
                            </div>
                        `).join('')}
                    </div>
                    <button type="button" class="btn-agregar-respuesta">+ Agregar respuesta</button>
                </div>
            `;
            preguntasList.insertAdjacentHTML('beforeend', preguntaHTML);
            this.attachPreguntaEventListeners(numeroPregunta);
        });

        // Scroll al formulario
        document.getElementById('crear-examen-section').scrollIntoView({ behavior: 'smooth' });
    }

    // ==================== ELIMINAR EXAMEN ====================
    eliminarExamen(id) {
        if (confirm('¿Estás seguro de que quieres eliminar este examen?')) {
            ExamenStorage.eliminarExamen(id);
            this.cargarExamenes();
            alert('Examen eliminado correctamente');
        }
    }

    // ==================== MANEJAR ACCIONES DE LA TABLA ====================
    manejarAccionesTabla(e) {
        if (e.target.classList.contains('btn-editar-exam')) {
            const id = parseInt(e.target.getAttribute('data-id'));
            this.editarExamen(id);
        } else if (e.target.classList.contains('btn-eliminar-exam')) {
            const id = parseInt(e.target.getAttribute('data-id'));
            this.eliminarExamen(id);
        }
    }

    // ==================== LIMPIAR FORMULARIO ====================
    limpiarFormulario() {
        this.examenActual = null;
        
        const nuevoCodigo = ExamenStorage.generarCodigo();
        document.getElementById('exam-codigo').value = nuevoCodigo;
        document.getElementById('exam-titulo').value = '';
        document.getElementById('exam-tiempo').value = '';
        document.getElementById('exam-porcentaje').value = '';
        document.getElementById('exam-descripcion').value = '';

        // Limpiar preguntas
        const preguntasList = document.getElementById('preguntas-list');
        preguntasList.innerHTML = `
            <div class="pregunta-item" id="pregunta-1">
                <div class="pregunta-header">
                    <label>Pregunta 1</label>
                    <button type="button" id="btn-eliminar-pregunta-1" class="btn-eliminar">Eliminar</button>
                </div>
                <div class="pregunta-body">
                    <textarea id="pregunta-texto-1" placeholder="Escribe la pregunta..."></textarea>
                </div>
                <div class="respuestas-container" id="respuestas-1">
                    <div class="respuesta-item">
                        <input type="radio" name="correcta-1" value="0">
                        <input type="text" placeholder="Opción A" class="respuesta-input">
                        <button type="button" class="btn-eliminar-respuesta">✕</button>
                    </div>
                </div>
                <button type="button" class="btn-agregar-respuesta">+ Agregar respuesta</button>
            </div>
        `;

        this.contador_preguntas = 1;
        this.attachPreguntaEventListeners(1);
    }
}

// ==================== INICIALIZAR ====================
document.addEventListener('DOMContentLoaded', () => {
    new GestorExamenes();
});