/*
// Initialize the map
const map = L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19
}).addTo(map);

// Save the raster map and generate puzzle
document.getElementById('saveRaster').addEventListener('click', () => {
	const mapContainer = document.getElementById('map');
	html2canvas(mapContainer).then(canvas => {
		const puzzleBoard = document.getElementById('puzzleBoard');
		puzzleBoard.innerHTML = ''; // Clear previous puzzle
		const rows = 4, cols = 4; // 4x4 puzzle pieces
		const pieceWidth = canvas.width / cols;
		const pieceHeight = canvas.height / rows;

		// Create puzzle pieces
		for (let row = 0; row < rows; row++) {
			for (let col = 0; col < cols; col++) {
				const piece = document.createElement('div');
				piece.classList.add('puzzle-piece');
				piece.style.backgroundImage = `url(${canvas.toDataURL()})`;
				piece.style.backgroundPosition = `-${col * pieceWidth}px -${row * pieceHeight}px`;
				puzzleBoard.appendChild(piece);
			}
		}
	});
});
*/

let map = L.map('map').setView([53.430127, 14.564802], 18);
// L.tileLayer.provider('OpenStreetMap.DE').addTo(map);
L.tileLayer.provider('Esri.WorldImagery').addTo(map);
let marker = L.marker([53.430127, 14.564802]).addTo(map);
marker.bindPopup("<strong>Hello!</strong><br>This is a popup.");

document.querySelectorAll('.grid-item').forEach(item => {
  item.addEventListener('dragover', dragOver);
  item.addEventListener('drop', drop);
  item.addEventListener('dragleave', dragleave);
  item.addEventListener('dragenter', dragenter);
});

document.getElementById("saveButton").addEventListener("click", function() {
	leafletImage(map, function (err, canvas) { //function (err, canvas) to callback
		// here we have the canvas
		//let rasterMap = document.getElementById("rasterMap");
		//let rasterContext = rasterMap.getContext("2d");
    //rasterContext.drawImage(canvas, 0, 0, 300, 150);
    clear();

    const gridContainer = document.getElementById("grid-container2");

    // Ustalanie nowych wymiarów fragmentów z uwzględnieniem przerwy
    const columns = 8;
    const rows = 2;

    const fragmentWidth = canvas.width / columns;
    const fragmentHeight = canvas.height / rows;

    var nr_puzzla = 1;

    const rowsTab = [];
    const columnsTab = [];
    const puzzelIdTab = []

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const sourceX = col * fragmentWidth;
        const sourceY = row * fragmentHeight;
        rowsTab.push(sourceX);
        columnsTab.push(sourceY);
        puzzelIdTab.push(nr_puzzla)
        nr_puzzla++;
      }
    }
    shuffle(puzzelIdTab); // Losowa kolejność puzzli
    nr_puzzla = 0;

    // Pętla po wierszach i kolumnach, by pobrać każdy fragment
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        // Tworzymy nowy canvas dla fragmentu
        const imageFragment = document.createElement("canvas");
        imageFragment.id = "puzzel" + puzzelIdTab[nr_puzzla];
        nr_puzzla++;
        imageFragment.width = fragmentWidth;
        imageFragment.height = fragmentHeight;
        imageFragment.classList.add("puzzel");
        imageFragment.draggable = true;
        imageFragment.addEventListener("dragstart", dragStart);
        imageFragment.addEventListener("dragend", dragend);
        //imageFragment.addEventListener("dragenter", dragenter);
        //imageFragment.addEventListener("dragleave", dragleave);

        // Rysujemy fragment na osobnym canvas
        const context = imageFragment.getContext("2d");
        context.drawImage(canvas, rowsTab[puzzelIdTab[nr_puzzla-1]-1], columnsTab[puzzelIdTab[nr_puzzla-1]-1], fragmentWidth, fragmentHeight, 0, 0, fragmentWidth, fragmentHeight);

        gridContainer.appendChild(imageFragment);
      }
    }
	});
});

function clear(){
  const gridContainer = document.getElementById("grid-container");
  const gridContainer2 = document.getElementById("grid-container2");
  // Przechodzimy przez wszystkie dzieci w gridContainer
  Array.from(gridContainer.children).forEach(child => {
    // Usuwamy wszystkie dzieci każdego elementu
    while (child.firstChild) {
      child.removeChild(child.firstChild);
    }
  });
  while(gridContainer2.firstChild){
    gridContainer2.removeChild(gridContainer2.firstChild);
  }
}

// Funkcja tasująca tablicę
function shuffle(array1) {
  for (let i = array1.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array1[i], array1[j]] = [array1[j], array1[i]];
  }
}
function dragleave(event){
  event.target.classList.remove("drag-border");
}

function dragend(event){
  event.target.style.borderWidth = "0";
}

function dragenter(event){
  event.preventDefault();
  event.target.classList.add("drag-border");
}

// Funkcje do obsługi drag-and-drop
function dragStart(event) {
  event.dataTransfer.setData("text", event.target.id);
  event.target.style.border = "3px dashed #ffb200";
}

function dragOver(event) {
  event.preventDefault();
}

function drop(event) {
  event.preventDefault();
  const fragmentId = event.dataTransfer.getData("text");
  const fragment = document.getElementById(fragmentId);

  const target = event.target;

  if(target.id.includes("puzzel")){
    const fragmentParent = fragment.parentElement;
    target.parentElement.appendChild(fragment);
    fragmentParent.appendChild(target);
  }
  else{
    target.appendChild(fragment);
  }
  target.classList.remove("drag-border");
  //fragment.classList.remove("drag-border");
  setTimeout(checkWin, 0); // Z opóźnieniem, aby dać czas na aktualizację DOM
}

function checkWin(){
  const gridContainer = document.getElementById("grid-container");
  // Przekształcamy HTMLCollection na tablicę i używamy forEach
  var licznik = 0
  Array.from(gridContainer.children).forEach((gridItem, index) => {
    //console.log(`Element ${index + 1}:`, gridItem);

    const canvas = "puzzel" + (index + 1);
    if(gridItem.firstChild){
      if(gridItem.firstChild.id === canvas){
        licznik++;
      }
    }
  });
  if(licznik === 16){
    alert("wygrales");
    console.log("wygrales");
  }
}

document.getElementById("getLocation").addEventListener("click", function(event) {
  if (! navigator.geolocation) {
    console.log("No geolocation.");
  }

  navigator.geolocation.getCurrentPosition(position => {
    console.log(position);
    clear();
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;

    map.setView([lat, lon]);
  }, positionError => {
    console.error(positionError);
  });
});
