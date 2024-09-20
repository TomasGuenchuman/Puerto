import {get} from './index.js';
import {parseHtmlToJSON} from './modules/listToJson.js';

//  POP UP PESQUEROS
function popUp(){
  const div = document.getElementById('popUp');
  div.style.zIndex = 2;
  let htmlString = 
          '<div id="salir"><P>X</P></div>'+
          '<table style="width:80%;height:70%;border:solid;">'+
            '<thead>'+
                '<th style="background-color: darkorange;">Buque</th>'+
                '<th style="background-color: darkorange;">Llegada</th>'+
                '<th style="background-color: darkorange;">Partida</th>'+
                '<th style="background-color: darkorange;">Agente</th>'+
            '</thead>'+
            '<tbody id="buques-popUp">'+ 
                '<tr>'+
                  '<td colspan="4" style="text-align: -webkit-center;">'+
                      '<div class="loader"></div>'+
                  '</td>'+
                '</tr>'+
            '</tbody>' +
          '</table>';
  ;

  div.innerHTML = htmlString;
}

function salirPopUp(){
  const div = document.getElementById('popUp');
  div.style.zIndex = -1;
  div.innerHTML = '';
}

//  OBTENER BUQUES PESQUEROS
export function buquesPesqueros(){
  popUp()
  get("https://www.dpp.gob.ar/web/wp-json/wp/v2/pages/141")
  .then(repos => {
    const jsonPesqueros = parseHtmlToJSON(repos);
    const tablaHtmlPesqueros = document.getElementById('buques-popUp')
    let htmlString = '';
    console.log(jsonPesqueros)
    for (const buque of jsonPesqueros) {
      if ( 
        /*(buquesNuestros.has(buque.name)) */true
        ) {
    
          htmlString = htmlString + 
        ' <tr>'+
        '<td>'+buque.name+'</td>'+
        '<td>'+buque.arrivalDate+'</td>'+
        '<td>'+buque.departureDate+'</td>'+
        '<td>'+buque.agent+'</td>'+
        '</tr>';
        
        } 
    }
    tablaHtmlPesqueros.innerHTML = htmlString
  })
  .catch(error => {
    console.error(error);
  });
  document.getElementById("salir").addEventListener("click",salirPopUp);
}