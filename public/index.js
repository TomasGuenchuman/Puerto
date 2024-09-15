const listado =
[
  'HANSEATIC INSPIRATION',
  'HANSEATIC SPIRIT',
  'HONDIUS',
  'MS EUROPA 2',
  'ORTELIUS',
  'PACIFIC WORLD',
  'PLANCIUS',
  'POLAR PIONEER',
  'SEAVENTURE',
  'SH DIANA',
  'HESPERIDES',
  'PERSEVERANCE',
  'SH VEGA',
  'SEVEN SEAS VOYAGER',
  'WORLD NAVIGATOR',
  'WORLD TRAVELLER',
  'WORLD VOYAGER',
  'EXPLORIS ONE',
  'HAMBURG',
  'MAGELLAN EXPLORER',
  'OCEAN ADVENTURER',
  'OCEAN NOVA',
  'SEA SPIRIT',
  'THE WORLD',
  /* PESQUEROS */
  'SAN ARAWA II',
  'CENTURION DEL ATLANTICO',
  'CAPESANTE'
    
]

const buquesNuestros = new Map(listado.map(buque => [buque, true])); // HASH TABLE

const meses = [
  "ENERO",
  "FEBRERO",
  "MARZO",
  "ABRIL",
  "MAYO",
  "JUNIO",
  "JULIO",
  "AGOSTO",
  "SEPTIEMBRE",
  "OCTUBRE",
  "NOVIEMBRE",
  "DICIEMBRE"
];

/*
  CONVIERTE EL STRING DEL HTML ( table ) a un elemento HTML
*/

function parseHTMLTableElem(tableStr) {
  try {
    // Crear el parser
    const parser = new DOMParser();
    const doc = parser.parseFromString(tableStr, "text/html");
    
    // Obtener la tabla (asegúrate de que exista una tabla)
    const table = doc.querySelector('table');
    if (!table) throw new Error('No se encontró una tabla en el HTML proporcionado.');

    // Obtener encabezados (si no hay encabezados, lanza un error)
    const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent.trim());
    if (headers.length === 0) throw new Error('No se encontraron encabezados (th) en la tabla.');

    // Obtener filas del cuerpo de la tabla
    const rows = Array.from(table.querySelectorAll('tr')).slice(1); // Omitir la primera fila si es el encabezado

    // Convertir filas a objetos JSON
    const result = rows.map(row => {
      const cells = Array.from(row.querySelectorAll('td')).map(td => td.textContent.trim());
      
      // Crear objeto de fila
      return headers.reduce((acc, header, idx) => {
        acc[header] = cells[idx] || '';  // Si hay menos celdas que columnas, devolver cadena vacía
        return acc;
      }, {});
    });

    return result;
  } catch (error) {
    console.error(`Error al parsear la tabla: ${error.message}`);
    return null; // O lanzar el error según sea necesario
  }
}


/*
  LLAMADO A LA API
  OBTENGO EL STRING DE LA TABLA HTML
*/
function get(url) {
return new Promise((resolve, reject) => {

  fetch(url)
  .then(resp => resp.json())
  .then(repos => {
    data = repos.content.rendered;
    resolve(data)
  })
  .catch(error => {
    console.error(error);
  });

});

}


function comparacionMes (recalada,recaladaSiguiente) {
  // VERIFICA SI LA RECALADA SIGUIENTE ES OTRO MES
  let mes = recalada[3] + recalada[4] 
  let mesSiguiente = recaladaSiguiente[3] + recaladaSiguiente[4]
  return (Number(mes) != Number(mesSiguiente))
}


get("https://www.dpp.gob.ar/web/wp-json/wp/v2/pages/3891")
.then((data) => {
  const tablaHtml = document.getElementById("buques") 
  let htmlString = '';
  let listaBarcos = parseHTMLTableElem(data) 
  let recaladas = 0;
  let totalRecaladas = 0;
  for (let i = 0; i < listaBarcos.length;i++) {

    if ( 
    (buquesNuestros.has(listaBarcos[i].Buque)) ||  (listaBarcos[i].Agente = "AGENCIA MARITIMA INTERNACIONAL  SA") 
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
  console.log(listaBarcos)
  console.log("Total de recaladas: " + totalRecaladas)
})
.catch((err) => {
  console.log("Error encontrado:", err);
  alert('ERROR',err)
});


/* BUQUES PESQUEROS */

// se le envia como parametro los <ul> <li> del la API y retorna el json
function parseHtmlToJSON(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const widgets = doc.querySelectorAll('.widget.widget-categories');

  const ships = Array.from(widgets).map(widget => {
      const titleElement = widget.querySelector('h3.widget-title');
      const name = titleElement.textContent.trim();
      const img = titleElement.querySelector('img') ? titleElement.querySelector('img').src : null;

      const listItems = widget.querySelectorAll('ul li');

      const getTextContent = (index) => listItems[index] ? listItems[index].textContent.trim().split(': ')[1] : null;

      return {
          name,
          img,
          arrivalDate: getTextContent(0),
          departureDate: getTextContent(1),
          shipType: getTextContent(2),
          length: getTextContent(3),
          agent: getTextContent(4),
          assignedSite: getTextContent(5),
          siteImg: listItems[7] ? listItems[7].querySelector('img').src : null
      };
  });

  return ships;
}

function buquesPesqueros(){
  get("https://www.dpp.gob.ar/web/wp-json/wp/v2/pages/141")
  .then(repos => {
    const jsonPesqueros = parseHtmlToJSON(repos);
    const tablaHtmlPesqueros = document.getElementById("buques")
    htmlString = '';
    console.log(jsonPesqueros)
    for (let i = 0; i < jsonPesqueros.length;i++) {

      if ( 
      /*(buquesNuestros.has(jsonPesqueros[i].name)) */true
      ) {
  
        htmlString = htmlString + 
      ' <tr>'+
      '<td>'+jsonPesqueros[i].name+'</td>'+
      '<td>'+jsonPesqueros[i].arrivalDate+'</td>'+
      '<td>'+jsonPesqueros[i].departureDate+'</td>'+
      '<td>'+jsonPesqueros[i].agent+'</td>'+
      '</tr>';
      
      }

    }
    tablaHtmlPesqueros.innerHTML = htmlString
  })
  .catch(error => {
    console.error(error);
  });
}
