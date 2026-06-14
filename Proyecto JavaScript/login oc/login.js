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


this.shadowRoot.innerHTML=`

<div class="card">


<h1>

Acme School

</h1>


<input

id="email"

type="email"

placeholder="Correo">


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



<p id="mensaje"></p>



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



if(!email || !password){


mensaje.textContent=

"Complete todos los campos";


return;

}



let usuario =

validarUsuario(

email,

password

);



if(usuario){


crearSesion(usuario);



mensaje.style.color="green";


mensaje.textContent=

"Bienvenido "+usuario.nombre;



}

else{


mensaje.style.color="red";


mensaje.textContent=

"Correo o contraseña incorrectos";


}


}





mostrarPassword(){


let input =

this.shadowRoot

.querySelector("#password");



if(input.type==="password"){


input.type="text";


}

else{


input.type="password";


}


}



}



customElements.define(

"login-acme",

LoginAcme

);