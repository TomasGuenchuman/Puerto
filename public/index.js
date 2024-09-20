import {stringTableToJson} from './modules/TableToJson.js';
import {buquesNuestros} from './listaBuques.js'; // HASH TABLE CON LOS BUQUES
import {buquesPesqueros} from './buquesPesqueros.js'; // GENERA EL POP UP CON LOS BUQUES PESQUEROS

const meses = [
  "ENERO","FEBRERO","MARZO","ABRIL","MAYO","JUNIO","JULIO","AGOSTO","SEPTIEMBRE",
  "OCTUBRE","NOVIEMBRE","DICIEMBRE"
];

// VERIFICA SI LA RECALADA SIGUIENTE ES OTRO MES
function comparacionMes (recalada,recaladaSiguiente) {
  let mes = recalada[3] + recalada[4] 
  let mesSiguiente = recaladaSiguiente[3] + recaladaSiguiente[4]
  return (Number(mes) != Number(mesSiguiente))
}

//  LLAMADO A LA API; SE OBTIENE STRING (HTML TABLE)
export function get(url) {
  return new Promise((resolve, reject) => {

    fetch(url)
    .then(resp => resp.json())
    .then(repos => {
      let data = repos.content.rendered;
      resolve(data)
    })
    .catch(error => {
      console.error(error);
    });

  });
}

// OBTENER BUQUES DE LA TEMPORADA
function buquesTemporada(url){
  get(url)
  .then((data) => {
    const tablaHtml = document.getElementById("buques") 
    let htmlString = '';
    let listaBarcos = stringTableToJson(data);
    console.log("lista barcos: ")
    console.log(listaBarcos) 
    let recaladas = 0;
    let totalRecaladas = 0;
    let mes;
    for (let i = 0; i < listaBarcos.length;i++) {

      if ( 
      (buquesNuestros.has(listaBarcos[i].Buque)) ||  (listaBarcos[i].Agente === "AGENCIA MARITIMA INTERNACIONAL  SA") 
      ) {
        
        recaladas = recaladas + 1

        htmlString = htmlString + 
      ' <tr>'+
      '<td>'+listaBarcos[i].Buque+'</td>'+
      '<td>'+listaBarcos[i].Llegada+'</td>'+
      '<td>'+listaBarcos[i].Partida+'</td>'+
      '<td>'+listaBarcos[i].Agente+'</td>'+
      '</tr>';
      
      }

      if (
        ( (i+1) < listaBarcos.length) && (comparacionMes(listaBarcos[i].Llegada,listaBarcos[i+1].Llegada) ) 
      ) {
        
        mes = listaBarcos[i].Llegada.slice(3,5)
        htmlString = htmlString + 
        ' <tr>'+
        '<td colspan="2" style="font-weight: bolder;">MES: '+meses[mes-1]+'</td>'+
        '<td colspan="2" style="font-weight: bolder;">RECALADAS: '+recaladas+'</td>'+
        '</tr>';
        ;
        console.log("Recaladas "+meses[mes-1]+": "+recaladas)
        totalRecaladas += recaladas
        recaladas = 0
      }
    }
    tablaHtml.innerHTML = htmlString
    console.log("Total( de recaladas: " + totalRecaladas)
  })
  .catch((err) => {
    console.log("Error encontrado:", err);
    alert('ERROR',err)
  });

}

buquesTemporada("https://www.dpp.gob.ar/web/wp-json/wp/v2/pages/3891");
document.getElementById("buques-pesqueros").addEventListener("click",buquesPesqueros);

