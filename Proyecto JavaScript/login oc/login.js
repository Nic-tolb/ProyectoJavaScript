import {

usuariosIniciales,

validarUsuario,

crearSesion

}

from "./auth.js";



usuariosIniciales();



class LoginAcme extends HTMLElement{


constructor(){


super();


this.attachShadow({

mode:"open"

});


}



connectedCallback(){



this.shadowRoot.innerHTML = `


<div class="card">


<h1>

Acme

</h1>


<p class="subtitle">

Plataforma de exámenes

</p>



<input

id="email"

type="email"

placeholder="Correo electrónico">



<input

id="password"

type="password"

placeholder="Contraseña">



<button id="mostrar">

Mostrar contraseña

</button>



<button id="ingresar">

Ingresar

</button>



<p id="mensaje">

</p>


</div>


`;



this.shadowRoot

.querySelector("#ingresar")

.addEventListener(

"click",

()=>this.login()

);



this.shadowRoot

.querySelector("#mostrar")

.addEventListener(

"click",

()=>this.mostrarPassword()

);



}




login(){


let email =

this.shadowRoot

.querySelector("#email")

.value;



let password =

this.shadowRoot

.querySelector("#password")

.value;



let mensaje =

this.shadowRoot

.querySelector("#mensaje");



let usuario =

validarUsuario(

email,

password

);



if(usuario){



crearSesion(usuario);



mensaje.style.color="green";


mensaje.textContent=

"Bienvenido " + usuario.nombre;



}

else{


mensaje.style.color="red";


mensaje.textContent=

"Datos incorrectos";


}



}





mostrarPassword(){


let campo =

this.shadowRoot

.querySelector("#password");



if(campo.type==="password"){


campo.type="text";


}

else{


campo.type="password";


}



}



}



customElements.define(

"login-acme",

LoginAcme

);