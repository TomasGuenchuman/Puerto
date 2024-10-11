const listado =
[
  'WORLD TRAVELLER',
  'WORLD NAVIGATOR',
  'WORLD VOYAGER',
  /* PESQUEROS */
  'SAN ARAWA II',
  'CENTURION DEL ATLANTICO',
  'CAPESANTE'
    
]
export const buquesNuestros = new Map(listado.map(buque => [buque, true])); // HASH TABLE