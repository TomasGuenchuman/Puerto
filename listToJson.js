// se le envia como parametro los <ul> <li> del la API y retorna el json
export function parseHtmlToJSON(html) {
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