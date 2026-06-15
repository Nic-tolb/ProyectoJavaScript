export function usuariosIniciales(){
    

let usuarios = localStorage.getItem("usuarios");


if(!usuarios){


let datos = [

{
nombre:"Administrador",
email:"admin@gmail.com",
password:"1234",
cargo:"Administrativo"
}

];


localStorage.setItem(

"usuarios",

JSON.stringify(datos)

);


}


}



export function validarUsuario(email,password){


let usuarios = JSON.parse(

localStorage.getItem("usuarios")

) || [];



let usuario = usuarios.find(

(user)=> 

user.email === email &&

user.password === password

);



return usuario;


}



export function crearSesion(usuario){


localStorage.setItem(

"sesion",

JSON.stringify(usuario)

);}