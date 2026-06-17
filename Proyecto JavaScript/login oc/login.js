import { usuariosIniciales, validarUsuario, crearSesion, registrarUsuario } from "./auth.js";

usuariosIniciales();

class LoginAcme extends HTMLElement {

    constructor() {

        super();

        this.attachShadow({ mode: "open" });

    }

    connectedCallback() {

        this.shadowRoot.innerHTML = `

        <style>

            * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
            }

            :host {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 100vh;
                font-family: Arial, sans-serif;
            }

            .container {
                width: 860px;
                min-height: 460px;
                display: flex;
                border-radius: 20px;
                overflow: hidden;
                box-shadow: 0 15px 40px rgba(0, 0, 0, 0.18);
            }

            .info {
                width: 52%;
                background: linear-gradient(150deg, #1e3a5f 0%, #2d6a9f 100%);
                color: white;
                padding: 50px 42px;
                display: flex;
                flex-direction: column;
                justify-content: center;
            }

            .modulo {
                font-size: 11px;
                font-weight: 600;
                letter-spacing: 2px;
                text-transform: uppercase;
                color: #90c4e8;
                margin-bottom: 20px;
            }

            .info h1 {
                font-size: 32px;
                font-weight: 700;
                line-height: 1.25;
                margin-bottom: 18px;
                color: white;
            }

            .info h1 span {
                color: #7ec8f0;
            }

            .info p {
                color: #b8d8f0;
                font-size: 14px;
                line-height: 1.7;
            }

            .login {
                width: 48%;
                background: #f8fafc;
                padding: 50px 42px;
                display: flex;
                flex-direction: column;
                justify-content: center;
            }

            .login h2 {
                font-size: 21px;
                font-weight: 700;
                color: #1e3a5f;
                margin-bottom: 4px;
            }

            .login .sub {
                font-size: 13px;
                color: #64748b;
                margin-bottom: 26px;
            }

            label {
                display: block;
                font-size: 12px;
                font-weight: 600;
                color: #334155;
                margin-bottom: 5px;
            }

            input {
                width: 100%;
                padding: 12px 14px;
                border: 1.5px solid #cbd5e1;
                border-radius: 10px;
                font-size: 14px;
                color: #1e293b;
                background: white;
                margin-bottom: 16px;
            }

            input:focus {
                outline: none;
                border-color: #2d6a9f;
                box-shadow: 0 0 0 3px rgba(45, 106, 159, 0.1);
            }

            .campo-password {
                position: relative;
                margin-bottom: 16px;
            }

            .campo-password input {
                margin-bottom: 0;
                padding-right: 44px;
            }

            .btn-ver {
                position: absolute;
                right: 12px;
                top: 50%;
                transform: translateY(-50%);
                background: none;
                border: none;
                cursor: pointer;
                font-size: 14px;
                color: #94a3b8;
            }

            .btn-ver:hover {
                color: #2d6a9f;
            }

            .btn-entrar {
                width: 100%;
                padding: 13px;
                background: linear-gradient(135deg, #1e3a5f, #2d6a9f);
                color: white;
                border: none;
                border-radius: 10px;
                font-size: 15px;
                font-weight: 600;
                cursor: pointer;
                margin-top: 4px;
            }

            .btn-entrar:hover {
                opacity: 0.9;
            }

            #mensaje {
                font-size: 13px;
                text-align: center;
                margin-top: 12px;
                min-height: 18px;
            }

            #mensaje.error {
                color: #dc2626;
            }

            #mensaje.ok {
                color: #16a34a;
            }

            .cambiar {
                margin-top: 18px;
                text-align: center;
                font-size: 13px;
                color: #64748b;
            }

            .cambiar button {
                background: none;
                border: none;
                color: #2d6a9f;
                font-weight: 600;
                cursor: pointer;
                font-size: 13px;
                text-decoration: underline;
            }

        </style>

        <div class="container">

            <section class="info">
                <h1 class="modulo">ACME SCHOOL</h1>
                <p1>Gestiona usuarios y examenes con una cuenta <span>autorizada.</span></p1>
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