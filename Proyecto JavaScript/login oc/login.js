import { usuariosIniciales, validarUsuario, crearSesion, registrarUsuario } from "./auth.js";

usuariosIniciales();

class LoginAcme extends HTMLElement {

    constructor() {

        super();

        this.attachShadow({ mode: "open" });

    }

    connectedCallback() {

        this.shadowRoot.innerHTML = `

        <link rel="stylesheet" href="./style.css">

        <div class="container">

            <section class="info">
                <p class="modulo">Modulo privado</p>
                <h1>Gestiona usuarios y examenes con una cuenta <span>autorizada.</span></h1>
                <p>Ingresa para administrar el banco de examenes de Acme School. Los estudiantes pueden resolver pruebas desde el modulo publico.</p>
            </section>

            <section class="login">

                <div id="vista-login">
                    <h2>Iniciar sesion</h2>
                    <p class="sub">Ingresa tus datos</p>

                    <label for="email">Email</label>
                    <input id="email" type="email" placeholder="admin@acme.edu">

                    <label for="password">Contrasena</label>
                    <div class="campo-password">
                        <input id="password" type="password" placeholder="••••••••">
                        <button class="btn-ver" id="mostrar">ver</button>
                    </div>

                    <button class="btn-entrar" id="entrar">Entrar</button>

                    <p id="mensaje"></p>

                    <p class="cambiar">
                        No tienes cuenta?
                        <button id="ir-registro">Registrate</button>
                    </p>
                </div>

                <div id="vista-registro" style="display: none">
                    <h2>Crear cuenta</h2>
                    <p class="sub">Completa tus datos</p>

                    <label for="r-nombre">Nombre</label>
                    <input id="r-nombre" type="text" placeholder="Tu nombre">

                    <label for="r-email">Email</label>
                    <input id="r-email" type="email" placeholder="correo@acme.edu">

                    <label for="r-password">Contrasena</label>
                    <div class="campo-password">
                        <input id="r-password" type="password" placeholder="••••••••">
                        <button class="btn-ver" id="mostrar-r">ver</button>
                    </div>

                    <button class="btn-entrar" id="registrar">Crear cuenta</button>

                    <p id="mensaje"></p>

                    <p class="cambiar">
                        Ya tienes cuenta?
                        <button id="ir-login">Inicia sesion</button>
                    </p>
                </div>

            </section>

        </div>

        `;

        // login
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
                // window.location.href = "./dashboard/index.html";
            } else {
                mensaje.textContent = "Email o contrasena incorrectos.";
                mensaje.className = "error";
            }

        });

        // mostrar contrasena login
        this.shadowRoot.getElementById("mostrar").addEventListener("click", () => {

            let input = this.shadowRoot.getElementById("password");

            if (input.type === "password") {
                input.type = "text";
            } else {
                input.type = "password";
            }

        });

        // registro
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

        // mostrar contrasena registro
        this.shadowRoot.getElementById("mostrar-r").addEventListener("click", () => {

            let input = this.shadowRoot.getElementById("r-password");

            if (input.type === "password") {
                input.type = "text";
            } else {
                input.type = "password";
            }

        });

        // cambiar a registro
        this.shadowRoot.getElementById("ir-registro").addEventListener("click", () => {
            this.shadowRoot.getElementById("vista-login").style.display = "none";
            this.shadowRoot.getElementById("vista-registro").style.display = "block";
        });

        // volver al login
        this.shadowRoot.getElementById("ir-login").addEventListener("click", () => {
            this.shadowRoot.getElementById("vista-registro").style.display = "none";
            this.shadowRoot.getElementById("vista-login").style.display = "block";
        });

    }

}

customElements.define("login-acme", LoginAcme);