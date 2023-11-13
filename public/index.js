// HTML TABLE A JSON
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

//OBTENER STRING HTML
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

const buquesNuestros =
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
  'SH VEGA',
  'AZAMARA QUEST',
  'MARINA',
  'SEVEN SEAS SPLENDOR',
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

function comparacionMes (recalada,recaladaSiguiente) {
  // VERIFICAR SI LA RECALADA SIGUIENTE ES OTRO MES
  let mes;
  mes = recalada.Llegada.slice(3,5)
  let mesSiguiente;
  mesSiguiente = recaladaSiguiente.Llegada.slice(3,5)
  return (Number(mes) != Number(mesSiguiente))
}

get("https://www.dpp.gob.ar/web/wp-json/wp/v2/pages/3891")
.then((data) => {
  const tablaHtml = document.getElementById("buques")
  let htmlString = '';
  let listaBarcos = parseHTMLTableElem(data)
  let stringDatos = buquesNuestros.toString() 
  let recaladas = 0;
  for (let i = 0; i < listaBarcos.length;i++) {
    // INDEX [0] DEL BUQUE
    let inicioString = (stringDatos.search(listaBarcos[i].Buque)) 

    if ((inicioString != -1)  && (listaBarcos[i].Buque = ( stringDatos.slice(inicioString,inicioString+(listaBarcos[i].Buque).length) ) ) )  {
      recaladas = recaladas + 1

      htmlString = htmlString + 
    ' <tr>'+
    '<td>'+listaBarcos[i].Buque+'</td>'+
    '<td>'+listaBarcos[i].Llegada+'</td>'+
    '<td>'+listaBarcos[i].Partida+'</td>'+
    '<td>'+listaBarcos[i].Agente+'</td>'+
    '</tr>';
    
    }
    if (((i+1) < listaBarcos.length) && (comparacionMes(listaBarcos[i],listaBarcos[i+1])) ) {
      mes = listaBarcos[i].Llegada.slice(3,5)
      htmlString = htmlString + 
      ' <tr>'+
      '<td colspan="2" style="font-weight: bolder;">MES: '+meses[mes-1]+'</td>'+
      '<td colspan="2" style="font-weight: bolder;">RECALADAS: '+recaladas+'</td>'+
      '</tr>';
      ;

      recaladas = 0
    }
  }
  console.log(listaBarcos)
  tablaHtml.innerHTML = htmlString
})
.catch((err) => {
  console.log("Error encontrado:", err);
  alert('ERROR',err)
});