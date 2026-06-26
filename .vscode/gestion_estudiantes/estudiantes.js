let examenes = JSON.parse(

localStorage.getItem("examenesAcme")

)||[];

///HOLAAAAAAAAAAAAAAAAA

mostrarExamenes();



document

.getElementById("guardar")

.addEventListener(

"click",

guardarExamen

);



function guardarExamen(){



let examen = {


codigo:codigo.value,


titulo:titulo.value,


tiempo:tiempo.value,


porcentajeAprobacion:

porcentaje.value,


descripcion:

descripcion.value,


preguntas:[]


};




examenes.push(examen);



localStorage.setItem(

"examenesAcme",

JSON.stringify(examenes)

);



mostrarExamenes();


limpiar();


}






function mostrarExamenes(){



tablaExamenes.innerHTML="";



examenes.forEach((e,index)=>{



tablaExamenes.innerHTML +=`



<tr>


<td>${e.codigo}</td>


<td>${e.titulo}</td>


<td>${e.tiempo} min</td>


<td>${e.porcentajeAprobacion}%</td>


<td>${e.descripcion}</td>



<td>


<button onclick="eliminarExamen(${index})">

Eliminar

</button>



</td>



</tr>



`;



});



}





function eliminarExamen(index){


examenes.splice(index,1);



localStorage.setItem(

"examenesAcme",

JSON.stringify(examenes)

);



mostrarExamenes();


}




function limpiar(){


codigo.value="";

titulo.value="";

tiempo.value="";

porcentaje.value="";

descripcion.value="";


}