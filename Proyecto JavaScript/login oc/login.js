import { usuariosIniciales, validarUsuario, crearSesion, registrarUsuario } from "./auth.js";

usuariosIniciales();

class LoginAcme extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {

        // 1. Obtener el template desde el HTML
        const template = document.getElementById("login-template");
        
        // 2. Clonar su contenido e inyectarlo en el Shadow DOM
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        // ==========================================
        // LÓGICA DE JAVASCRIPT
        // ==========================================

        // Evento: login
        this.shadowRoot.getElementById("entrar").addEventListener("click", () => {

            let email = this.shadowRoot.getElementById("email").value;
            let password = this.shadowRoot.getElementById("password").value;
            let mensaje = this.shadowRoot.querySelector("#vista-login #mensaje");

            if (!email || !password) {
                mensaje.textContent = "Completa todos los campos.";
                mensaje.className = "error";
                return;
            }

            let usuario = validarUsuario(email, password);

            if (usuario) {
                crearSesion(usuario);
                mensaje.textContent = "Bienvenido " + usuario.nombre;
                mensaje.className = "ok";
                setTimeout(() => {
                    window.location.href = "../PortalCreaciónExamen/CrearExamen.html";
                }, 1000);
            } else {
                mensaje.textContent = "Email o contrasena incorrectos.";
                mensaje.className = "error";
            }

        });

        // Evento: mostrar contrasena login
        this.shadowRoot.getElementById("mostrar").addEventListener("click", () => {

            let input = this.shadowRoot.getElementById("password");

            if (input.type === "password") {
                input.type = "text";
            } else {
                input.type = "password";
            }

        });

        // Evento: registro
        this.shadowRoot.getElementById("registrar").addEventListener("click", () => {

            let nombre = this.shadowRoot.getElementById("r-nombre").value;
            let email = this.shadowRoot.getElementById("r-email").value;
            let password = this.shadowRoot.getElementById("r-password").value;
            let mensaje = this.shadowRoot.querySelector("#vista-registro #mensaje");

            if (!nombre || !email || !password) {
                mensaje.textContent = "Completa todos los campos.";
                mensaje.className = "error";
                return;
            }

            let resultado = registrarUsuario(nombre, email, password);

            if (resultado) {
                mensaje.textContent = "Cuenta creada. Ahora inicia sesion.";
                mensaje.className = "ok";
            } else {
                mensaje.textContent = "Ese email ya esta registrado.";
                mensaje.className = "error";
            }

        });

        // Evento: mostrar contrasena registro
        this.shadowRoot.getElementById("mostrar-r").addEventListener("click", () => {

            let input = this.shadowRoot.getElementById("r-password");

            if (input.type === "password") {
                input.type = "text";
            } else {
                input.type = "password";
            }

        });

        // Evento: cambiar a registro
        this.shadowRoot.getElementById("ir-registro").addEventListener("click", () => {
            this.shadowRoot.getElementById("vista-login").style.display = "none";
            this.shadowRoot.getElementById("vista-registro").style.display = "block";
        });

        // Evento: volver al login
        this.shadowRoot.getElementById("ir-login").addEventListener("click", () => {
            this.shadowRoot.getElementById("vista-registro").style.display = "none";
            this.shadowRoot.getElementById("vista-login").style.display = "block";
        });

    }

}

customElements.define("login-acme", LoginAcme);