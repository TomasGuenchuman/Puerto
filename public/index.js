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
  'THE WORLD'
    
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
function parseHTMLTableElem(table) { //parametro: string

  // html string
  const htmlStr = table;

  // make a new parser
  const parser = new DOMParser();

  // convert html string into DOM
  const tableEl = parser.parseFromString(htmlStr, "text/html");

  const columns = Array.from(tableEl.querySelectorAll('th')).map(it => it.textContent)
  const rows = tableEl.querySelectorAll('tbody > tr')
  return Array.from(rows).map(row => {
      const cells = Array.from(row.querySelectorAll('td'))
      return columns.reduce((obj, col, idx) => {
          obj[col] = cells[idx].textContent
          return obj
      }, {})
  })
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