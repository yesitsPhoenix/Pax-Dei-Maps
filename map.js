async function fetchData(fileName) {
  try {
      const response = await fetch(fileName);
      if (!response.ok) {
          throw new Error(`Failed to fetch data from ${fileName}.`);
      }
      return await response.json();
  } catch (error) {
      console.error(error);
      return [];
  }
}

async function fetchResourceLocations() {
  return fetchData("data/resources.json");
}

async function fetchPlayerLocations() {
  const playerLocations = await fetchData("data/players.json");
  playerLocations.push({
      name: "Check All",
      lat: null,
      lng: null
  });
  return playerLocations;
}

let map;
let selectedFruits = [];
let selectedAnimals = [];
let selectedPlants = [];
let selectedMushrooms = [];
let selectedFlowers = [];
let selectedPlayers = [];
let selectedStone = [];
let selectedSpecial = [];
const markersByName = {};
let markers = [];
let temporaryMarkers = [];
const temporaryMarkersWithData = [];

//Icons and formatting
const commonIcon = L.icon({
  iconUrl: 'https://cdn.discordapp.com/attachments/885950046506450955/1133845956316631090/3.png',
  iconSize: [72, 72],
  iconAnchor: [36, 72],
  popupAnchor: [-3, -76]
});

const uncommonIcon = L.icon({
  iconUrl: 'https://cdn.discordapp.com/attachments/885950046506450955/1133845956056588399/2.png',
  iconSize: [72, 72],
  iconAnchor: [36, 72],
  popupAnchor: [-3, -76]
});

const rareIcon = L.icon({
  iconUrl: 'https://cdn.discordapp.com/attachments/885950046506450955/1133845955804942548/1.png',
  iconSize: [72, 72],
  iconAnchor: [36, 72],
  popupAnchor: [-3, -76]
});

const defaultIcon = L.icon({
  iconUrl: 'https://cdn.discordapp.com/attachments/885950046506450955/1133868988565291018/icons.png',
  iconSize: [72, 72],
  iconAnchor: [36, 72],
  popupAnchor: [-3, -76]
});

const blueberryIcon = L.icon({
  iconUrl: 'https://cdn.discordapp.com/attachments/885950046506450955/1134517140045709344/blueberry.png',
  iconSize: [72, 72],
  iconAnchor: [36, 72],
  popupAnchor: [-3, -76]
});

const boarIcon = L.icon({
  iconUrl: 'https://cdn.discordapp.com/attachments/1134833564597374976/1134833598889992213/boar.png',
  iconSize: [72, 72],
  iconAnchor: [36, 72],
  popupAnchor: [-3, -76]
});

const daisyIcon = L.icon({
  iconUrl: 'https://cdn.discordapp.com/attachments/1134833564597374976/1134833599175213056/daisy.png',
  iconSize: [72, 72],
  iconAnchor: [36, 72],
  popupAnchor: [-3, -76]
});

const daturaIcon = L.icon({
  iconUrl: 'https://cdn.discordapp.com/attachments/1134833564597374976/1134883548172656700/datura.png',
  iconSize: [72, 72],
  iconAnchor: [36, 72],
  popupAnchor: [-3, -76]
});

const deathcapIcon = L.icon({
  iconUrl: 'https://cdn.discordapp.com/attachments/1134833564597374976/1134833599783379004/deathcap.png',
  iconSize: [72, 72],
  iconAnchor: [36, 72],
  popupAnchor: [-3, -76]
});

const deerIcon = L.icon({
  iconUrl: 'https://cdn.discordapp.com/attachments/1134833564597374976/1134833600072781824/deer.png',
  iconSize: [72, 72],
  iconAnchor: [36, 72],
  popupAnchor: [-3, -76]
});

const amanitaIcon = L.icon({
  iconUrl: 'https://cdn.discordapp.com/attachments/1134833564597374976/1134833600328638544/amanita.png',
  iconSize: [72, 72],
  iconAnchor: [36, 72],
  popupAnchor: [-3, -76]
});

const batflowerIcon = L.icon({
  iconUrl: 'https://cdn.discordapp.com/attachments/1134833564597374976/1134833600550944810/batflower.png',
  iconSize: [72, 72],
  iconAnchor: [36, 72],
  popupAnchor: [-3, -76]
});

const bearIcon = L.icon({
  iconUrl: 'https://cdn.discordapp.com/attachments/1134833564597374976/1134833600777429034/bear.png',
  iconSize: [72, 72],
  iconAnchor: [36, 72],
  popupAnchor: [-3, -76]
});

const garlicIcon = L.icon({
  iconUrl: 'https://cdn.discordapp.com/attachments/1134833564597374976/1134833621367279686/garlic.png',
  iconSize: [72, 72],
  iconAnchor: [36, 72],
  popupAnchor: [-3, -76]
});

const greywolfIcon = L.icon({
  iconUrl: 'https://cdn.discordapp.com/attachments/1134833564597374976/1134833621652488233/grey-wolf.png',
  iconSize: [72, 72],
  iconAnchor: [36, 72],
  popupAnchor: [-3, -76]
});

const loiostearsIcon = L.icon({
  iconUrl: 'https://cdn.discordapp.com/attachments/1110652388328603738/1179157823469395979/loios-tears.png',
  iconSize: [72, 72],
  iconAnchor: [36, 72],
  popupAnchor: [-3, -76]
});

const mustardIcon = L.icon({
  iconUrl: 'https://cdn.discordapp.com/attachments/1134833564597374976/1134833622168391701/mustard.png',
  iconSize: [72, 72],
  iconAnchor: [36, 72],
  popupAnchor: [-3, -76]
});

const nightshadeIcon = L.icon({
  iconUrl: 'https://cdn.discordapp.com/attachments/1134833564597374976/1134833622466183259/nightshade.png',
  iconSize: [72, 72],
  iconAnchor: [36, 72],
  popupAnchor: [-3, -76]
});

const periwinkleIcon = L.icon({
  iconUrl: 'https://cdn.discordapp.com/attachments/1134833564597374976/1134833622751391744/periwinkle.png',
  iconSize: [72, 72],
  iconAnchor: [36, 72],
  popupAnchor: [-3, -76]
});

const divineIcon = L.icon({
  iconUrl: 'https://cdn.discordapp.com/attachments/1134833564597374976/1134833623049191535/divine.png',
  iconSize: [72, 72],
  iconAnchor: [36, 72],
  popupAnchor: [-3, -76]
});

const flaxIcon = L.icon({
  iconUrl: 'https://cdn.discordapp.com/attachments/1134833564597374976/1134918116753809470/flax.png',
  iconSize: [72, 72],
  iconAnchor: [48, 64],
  popupAnchor: [-3, -76]
});

const rabbitIcon = L.icon({
  iconUrl: 'https://cdn.discordapp.com/attachments/1134833564597374976/1134833633451057232/rabbit.png',
  iconSize: [72, 72],
  iconAnchor: [36, 72],
  popupAnchor: [-3, -76]
});

const rainlilyIcon = L.icon({
  iconUrl: 'https://cdn.discordapp.com/attachments/1134833564597374976/1134833633904050226/rain-lily.png',
  iconSize: [72, 72],
  iconAnchor: [36, 72],
  popupAnchor: [-3, -76]
});

const raspberryIcon = L.icon({
  iconUrl: 'https://cdn.discordapp.com/attachments/1134833564597374976/1134833634172469335/raspberry.png',
  iconSize: [72, 72],
  iconAnchor: [36, 72],
  popupAnchor: [-3, -76]
});

const sageIcon = L.icon({
  iconUrl: 'https://cdn.discordapp.com/attachments/1134833564597374976/1134833634503827477/sage.png',
  iconSize: [72, 72],
  iconAnchor: [36, 72],
  popupAnchor: [-3, -76]
});

const silverfirIcon = L.icon({
  iconUrl: 'https://cdn.discordapp.com/attachments/1134833564597374976/1134883858265931796/silver-fir-branch.png',
  iconSize: [72, 72],
  iconAnchor: [36, 72],
  popupAnchor: [-3, -76]
});

const reedsIcon = L.icon({
  iconUrl: 'https://cdn.discordapp.com/attachments/1134833564597374976/1134863539597754368/reeds.png',
  iconSize: [72, 72],
  iconAnchor: [36, 72],
  popupAnchor: [-3, -76]
});

const clayIcon = L.icon({
  iconUrl: 'https://cdn.discordapp.com/attachments/1134833564597374976/1134920975041974282/clay.png',
  iconSize: [64, 64],
  iconAnchor: [32, 64],
  popupAnchor: [-3, -76]
});

const grapesIcon = L.icon({
  iconUrl: 'https://cdn.discordapp.com/attachments/1134833564597374976/1135380633720455208/grapes.png',
  iconSize: [64, 64],
  iconAnchor: [32, 64],
  popupAnchor: [-3, -76]
});
const tempMarkerIcon = L.icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
const impureIronDepositIcon = L.icon({
  iconUrl: 'https://cdn.discordapp.com/attachments/1110652388328603738/1174805340898988102/impure_iron_deposit.png',
  iconSize: [64, 64],
  iconAnchor: [32, 64],
  popupAnchor: [-3, -76]
});
const copperDepositIcon = L.icon({
  iconUrl: 'https://cdn.discordapp.com/attachments/1110652388328603738/1174805347215618128/copper_deposit.png',
  iconSize: [64, 64],
  iconAnchor: [32, 64],
  popupAnchor: [-3, -76]
});

const graniteDepositIcon = L.icon({
  iconUrl: 'https://cdn.discordapp.com/attachments/1110652388328603738/1174816624503701645/granite_deposit.png',
  iconSize: [64, 64],
  iconAnchor: [32, 64],
  popupAnchor: [-3, -76]
});

const ironDepositIcon = L.icon({
  iconUrl: 'https://cdn.discordapp.com/attachments/1110652388328603738/1174816617977364531/iron_deposit.png',
  iconSize: [64, 64],
  iconAnchor: [32, 64],
  popupAnchor: [-3, -76]
});
const gneissDepositIcon = L.icon({
  iconUrl: 'https://cdn.discordapp.com/attachments/1110652388328603738/1174818242074792016/icons2.png',
  iconSize: [64, 64],
  iconAnchor: [32, 64],
  popupAnchor: [-3, -76]
});
const flintStoneIcon = L.icon({
  iconUrl: 'https://cdn.discordapp.com/attachments/1110652388328603738/1174819700513980459/icons2_1.png',
  iconSize: [64, 64],
  iconAnchor: [32, 64],
  popupAnchor: [-3, -76]
});
const tinDepositIcon = L.icon({
  iconUrl: 'https://cdn.discordapp.com/attachments/1110652388328603738/1175267524439445534/icons2.png',
  iconSize: [64, 64],
  iconAnchor: [32, 64],
  popupAnchor: [-3, -76]
});
const limestoneDepositIcon = L.icon({
  iconUrl: 'https://cdn.discordapp.com/attachments/1110652388328603738/1175270065508208650/limestone.png',
  iconSize: [64, 64],
  iconAnchor: [32, 64],
  popupAnchor: [-3, -76]
});
const badgerIcon = L.icon({
  iconUrl: 'https://cdn.discordapp.com/attachments/1110652388328603738/1176160477278117898/badger.png',
  iconSize: [64, 64],
  iconAnchor: [32, 64],
  popupAnchor: [-3, -76]
});
const foxIcon = L.icon({
  iconUrl: 'https://cdn.discordapp.com/attachments/1110652388328603738/1176160483150139532/fox.png',
  iconSize: [64, 64],
  iconAnchor: [32, 64],
  popupAnchor: [-3, -76]
});
const pennybunIcon = L.icon({
  iconUrl: 'https://cdn.discordapp.com/attachments/1110652388328603738/1176160488955060314/pennybun.png',
  iconSize: [64, 64],
  iconAnchor: [32, 64],
  popupAnchor: [-3, -76]
});
const wolfElderIcon = L.icon({
  iconUrl: 'https://cdn.discordapp.com/attachments/1134833564597374976/1134833621652488233/grey-wolf.png',
  iconSize: [72, 72],
  iconAnchor: [36, 72],
  popupAnchor: [-3, -76]
});
const corruptedWolfIcon = L.icon({
  iconUrl: 'https://cdn.discordapp.com/attachments/1134833564597374976/1134833621652488233/grey-wolf.png',
  iconSize: [72, 72],
  iconAnchor: [36, 72],
  popupAnchor: [-3, -76]
});
const corruptedBoarIcon = L.icon({
  iconUrl: 'https://cdn.discordapp.com/attachments/1134833564597374976/1134833598889992213/boar.png',
  iconSize: [72, 72],
  iconAnchor: [36, 72],
  popupAnchor: [-3, -76]
});



async function initMap() {
  try {
      resourceLocations = await fetchResourceLocations();
      playerLocations = await fetchPlayerLocations();


      map = L.map("map", {
          zoomControl: false,
          maxZoom: 4,
          scrollWheelZoom: false,
          smoothWheelZoom: true,
          smoothSensitivity: 1,
          wheelDebounceTime: 100,
          zoomSnap: 0.1,
          crs: L.CRS.Simple
      }).setView(
          [0, 0], 0);
      map.on("zoomend", function() {
          if (map.getZoom() > map.options.maxZoom) {
              map.setZoom(map.options.maxZoom);
          }
      });

      L.Control.zoomHome = L.Control.extend({
          options: {
              position: "topright",
              zoomInText: "+",
              zoomInTitle: "Zoom in",
              zoomOutText: "-",
              zoomOutTitle: "Zoom out",
              zoom: 0,
          },

          onAdd: function(map) {
              var controlName = "gin-control-zoom",
                  container = L.DomUtil.create("div", controlName + " leaflet-bar"),
                  options = this.options;

              this._zoomInButton = this._createButton(
                  options.zoomInText,
                  options.zoomInTitle,
                  controlName + "-in",
                  container,
                  this._zoomIn
              );

              this._zoomHomeButton = this._createButton(
                  "",
                  "Zoom home",
                  controlName + "-home",
                  container,
                  this._zoomHome,
                  "https://cdn.discordapp.com/attachments/885950046506450955/1133842273310871702/home.png"
              );

              this._zoomOutButton = this._createButton(
                  options.zoomOutText,
                  options.zoomOutTitle,
                  controlName + "-out",
                  container,
                  this._zoomOut
              );

              this._updateDisabled();
              map.on("zoomend zoomlevelschange", this._updateDisabled, this);

              return container;
          },

          _zoomHome: function(e) {
              this._map.setView([0, 0], 0, {
                  animate: true
              });
          },

          onRemove: function(map) {
              map.off("zoomend zoomlevelschange", this._updateDisabled, this);
          },

          _zoomIn: function(e) {
              this._map.zoomIn(e.shiftKey ? 3 : 1);
          },

          _zoomOut: function(e) {
              this._map.zoomOut(e.shiftKey ? 3 : 1);
          },

          _createButton: function(html, title, className, container, fn, iconUrl) {
              var link = L.DomUtil.create("a", className, container);
              link.innerHTML = html;
              link.href = "#";
              link.title = title;

              if (iconUrl) {
                  link.style.backgroundImage = `url(${iconUrl})`;
                  link.style.backgroundSize = "contain";
                  link.style.width = "30px";
                  link.style.height = "30px";
              }

              L.DomEvent.on(link, "mousedown dblclick", L.DomEvent.stopPropagation)
                  .on(link, "click", L.DomEvent.stop)
                  .on(link, "click", fn, this)
                  .on(link, "click", this._refocusOnMap, this);

              return link;
          },

          _updateDisabled: function() {
              var map = this._map,
                  className = "leaflet-disabled";

              L.DomUtil.removeClass(this._zoomInButton, className);
              L.DomUtil.removeClass(this._zoomOutButton, className);

              if (map._zoom === map.getMinZoom()) {
                  L.DomUtil.addClass(this._zoomOutButton, className);
              }
              if (map._zoom === map.getMaxZoom()) {
                  L.DomUtil.addClass(this._zoomInButton, className);
              }
          },


      });

      var zoomHome = new L.Control.zoomHome();
      zoomHome.addTo(map);

      const clearResourcesButton = document.querySelector(".clear-resources-button");
      clearResourcesButton.addEventListener("click", clearAllMarkers);


      var imageOverlay = L.imageOverlay(
          "assets/map.jpg", [
              [480, -480], // North West
              [-480, 480], // South East
          ]
      ).addTo(map);

      // Generate options for the "Fruit" dropdown menu
      const fruitDropdown = document.getElementById("fruit-dropdown");
      const uniqueFruitLocations = filterUniqueLocations(resourceLocations, "Fruit");
      uniqueFruitLocations.forEach((location) => {
          const option = document.createElement("div");
          option.className = "option";
          option.textContent = location.name;
          fruitDropdown.appendChild(option);
          option.addEventListener("click", (event) => {
              onOptionSelect(event, location.name, location.lat, location.lng);
          });
      });

      // Generate options for the "Animals" dropdown menu
      const animalsDropdown = document.getElementById("animals-dropdown");
      const uniqueAnimalLocations = filterUniqueLocations(resourceLocations, "Animals");
      uniqueAnimalLocations.forEach((location) => {
          const option = document.createElement("div");
          option.className = "option";
          option.textContent = location.name;
          animalsDropdown.appendChild(option);
          option.addEventListener("click", (event) => {
              onOptionSelect(event, location.name, location.lat, location.lng);
          });
      });
      // Generate options for the "Plants" dropdown menu
      const plantsDropdown = document.getElementById("plants-dropdown");
      const uniquePlantLocations = filterUniqueLocations(resourceLocations, "Plants");
      uniquePlantLocations.forEach((location) => {
          const option = document.createElement("div");
          option.className = "option";
          option.textContent = location.name;
          plantsDropdown.appendChild(option);
          option.addEventListener("click", (event) => {
              onOptionSelect(event, "Plants", location.name, location.lat, location.lng);
          });
      });

      // Generate options for the "Mushrooms" dropdown menu
      const mushroomsDropdown = document.getElementById("mushrooms-dropdown");
      const uniqueMushroomLocations = filterUniqueLocations(resourceLocations, "Mushrooms");
      uniqueMushroomLocations.forEach((location) => {
          const option = document.createElement("div");
          option.className = "option";
          option.textContent = location.name;
          mushroomsDropdown.appendChild(option);
          option.addEventListener("click", (event) => {
              onOptionSelect(event, "Mushrooms", location.name, location.lat, location.lng);
          });
      });
      // Generate options for the "Players" dropdown menu
      const playersDropdown = document.getElementById("players-dropdown");
      const uniquePlayerLocations = filterUniqueLocations(playerLocations, "Players");
      uniquePlayerLocations.forEach((location) => {
          const option = document.createElement("div");
          option.className = "option";
          option.textContent = location.name;
          playersDropdown.appendChild(option);
          option.addEventListener("click", (event) => {
              onOptionSelect(event, "Players", location.lat, location.lng);
          });
      });

      // Generate options for the "Flowers" dropdown menu
      const flowersDropdown = document.getElementById("flowers-dropdown");
      const uniqueFlowerLocations = filterUniqueLocations(resourceLocations, "Flowers");
      uniqueFlowerLocations.forEach((location) => {
          const option = document.createElement("div");
          option.className = "option";
          option.textContent = location.name;
          flowersDropdown.appendChild(option);
          option.addEventListener("click", (event) => {
              onOptionSelect(event, "Flowers", location.lat, location.lng);
          });
      });

      // Generate options for the "Stone" dropdown menu
      const stoneDropdown = document.getElementById("stone-dropdown");
      const uniqueStoneLocations = filterUniqueLocations(resourceLocations, "Stone");
      uniqueStoneLocations.forEach((location) => {
          const option = document.createElement("div");
          option.className = "option";
          option.textContent = location.name;
          stoneDropdown.appendChild(option);
          option.addEventListener("click", (event) => {
              onOptionSelect(event, "Stone", location.lat, location.lng);
          });
      });

      // Generate options for the "Stone" dropdown menu
      const specialDropdown = document.getElementById("special-dropdown");
      const uniqueSpecialLocations = filterUniqueLocations(resourceLocations, "Special");
      uniqueSpecialLocations.forEach((location) => {
          const option = document.createElement("div");
          option.className = "option";
          option.textContent = location.name;
          specialDropdown.appendChild(option);
          option.addEventListener("click", (event) => {
              onOptionSelect(event, "Stone", location.lat, location.lng);
          });

      });

      // Add event listener to update mouse coordinates when the mouse moves over the map
      map.on("mousemove", (e) => {
          const mouseCoordinates = document.getElementById("mouse-coordinates");
          mouseCoordinates.textContent = `[${e.latlng.lat.toFixed(3)}], ${e.latlng.lng.toFixed(3)}]`;
      });
      const mouseCoordinatesDiv = document.getElementById("mouse-coordinates");
      map.on("mousemove", (e) => {
          mouseCoordinatesDiv.textContent = `WORK-IN-PROGRESS\nBecause of their abundance,\nGneiss Rocks and Sapwood\nare not marked on the map.\n\n[${e.latlng.lat.toFixed(3)}], [${e.latlng.lng.toFixed(3)}]`;
      });

      // Event listener for the map's click event
      map.on("click", function(e) {
          // Create a temporary marker
          const tempMarker = L.marker(e.latlng, {
              icon: tempMarkerIcon
          }).addTo(map);

          // Create a custom popup-like behavior
          const popupDiv = document.createElement("div");
          const inputField = document.createElement("input");
          inputField.type = "text";
          inputField.id = "marker-input";
          inputField.placeholder = "Enter text";

          const coordinatesText = document.createElement("p");
          coordinatesText.textContent = `Coordinates: [${e.latlng.lat.toFixed(3)}, ${e.latlng.lng.toFixed(3)}]`;

          const copyButton = document.createElement("button");
          copyButton.id = "copy-data";
          copyButton.textContent = "Copy Data";

          const saveButton = document.createElement("button");
          saveButton.id = "save-location";
          saveButton.textContent = "Save Location";

          popupDiv.appendChild(inputField);
          popupDiv.appendChild(coordinatesText);

          // Add spacing between the Copy and Save buttons
          popupDiv.appendChild(document.createElement("br")); // Add a line break
          popupDiv.appendChild(copyButton);
          popupDiv.appendChild(document.createTextNode("\u00A0\u00A0")); // Add spacing
          popupDiv.appendChild(saveButton);

          // Bind the custom popup to the temporary marker
          tempMarker.bindPopup(popupDiv).openPopup();

          // Event listener for the marker's click event
          tempMarker.on("click", function(event) {
              // Check if the Ctrl key (Windows/Linux) or Command key (Mac) is pressed
              if (event.originalEvent.ctrlKey || event.originalEvent.metaKey) {
                  // Remove the temporary marker
                  tempMarker.remove();
              }
          });

          // Event listener for copying data (text and coordinates)
          const copyDataButton = popupDiv.querySelector("#copy-data");
          copyDataButton.addEventListener("click", function() {
              // Get the text and coordinates entered by the user
              const inputField = document.getElementById("marker-input");
              const enteredText = inputField.value;
              const coordinates = ` ${e.latlng.lat.toFixed(3)},${e.latlng.lng.toFixed(3)}`;

              // Combine text and coordinates without brackets and copy to clipboard
              const combinedText = `${enteredText}${coordinates}`;
              copyToClipboard(combinedText);
          });

          // Function to copy text to the clipboard
          function copyToClipboard(text) {
              const textArea = document.createElement("textarea");
              textArea.value = text;
              document.body.appendChild(textArea);
              textArea.select();
              document.execCommand("copy");
              document.body.removeChild(textArea);
          }
      });


  } catch (error) {
      console.error(error);
  }
}

function createOptionElement(name, category) {
  const option = document.createElement("div");
  option.className = "option";
  option.textContent = name;
  option.addEventListener("click", (event) => {
      onOptionSelect(event, category, name);
  });
  return option;
}

// Function to filter unique locations based on category
function filterUniqueLocations(locations, category) {
  const uniqueLocations = [];
  const namesSet = new Set();
  locations.forEach((location) => {
      if (location.category === category && !namesSet.has(location.name)) {
          uniqueLocations.push(location);
          namesSet.add(location.name);
      }
  });
  return uniqueLocations;
}


function toggleAndCloseSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const resourcesButton = document.getElementById('resources-button');
  const clearResourcesButton = document.querySelector('.clear-resources-button');
  const loginButton = document.querySelector('.login-button');
  const loadMarkersButton = document.querySelector('.load-markers-button');

  if (sidebar.classList.contains('open')) {
      // Sidebar is open, close it
      sidebar.classList.remove('open');

      // Reset the left positions to their default values
      resourcesButton.style.left = '105px';
      clearResourcesButton.style.left = '235px';
      loginButton.style.left = '10px';
      loadMarkersButton.style.left = '400px';
  } else {
      // Sidebar is closed, open it
      sidebar.classList.add('open');

      // Calculate new left positions if sidebar is open based on initial positions in CSS
      const initialPositions = {
          resources: 105,
          clearAll: 235,
          login: 10,
          loadMarkersButton: 400,
      };

      resourcesButton.style.left = `${initialPositions.resources + 255}px`;

      if (clearResourcesButton) {
          clearResourcesButton.style.left = `${initialPositions.clearAll + 255}px`;
      }
      loginButton.style.left = `${initialPositions.login + 255}px`;

      loadMarkersButton.style.left = `${initialPositions.loadMarkersButton + 255}px`;
  }
}


function closeSidebar() {
  const sidebar = document.querySelector('.sidebar.open');
  if (sidebar) {
      sidebar.classList.remove('open');

      // Reset the left positions to their default values
      document.getElementById('resources-button').style.left = '105px';

      const clearResourcesButton = document.querySelector('.clear-resources-button');
      if (clearResourcesButton) {
          clearResourcesButton.style.left = '235px';
      }

      const loginButton = document.querySelector('.login-button');
      if (loginButton) {
          loginButton.style.left = '10px';
      }
      const loadMarkersButton = document.querySelector('.load-markers-button');
      if (loadMarkersButton) {
          loadMarkersButton.style.left = '400px';
      }
  }
}

const clearResourcesButton = document.querySelector('.clear-resources-button');

if (clearResourcesButton) {
  clearResourcesButton.addEventListener('click', closeSidebar);

}

const closeButton = document.querySelector('.close-button');

if (closeButton) {
  closeButton.addEventListener('click', toggleSidebar);

}


document.addEventListener('DOMContentLoaded', () => {
  const infoButton = document.getElementById('info-button');
  const infoBox = document.querySelector('.info-box');
  let timeoutId;

  if (infoButton && infoBox) {
      infoButton.addEventListener('click', () => {
          clearTimeout(timeoutId);
          infoBox.classList.add('active');
      });

      infoButton.addEventListener('mouseout', () => {
          timeoutId = setTimeout(() => {
              infoBox.classList.remove('active');
          }, 5000);
      });
  }
});



// Function to handle dropdown menu selection
function onOptionSelect(event, category, name, lat, lng, rarity, iconUrl) {
  const selectedOption = event.target.textContent;
  const dropdownTitle = document.querySelector(`.${category}-dropdown .dropdown-title`);

  // Toggle the option selection
  if (selectedFruits.includes(selectedOption)) {
      // If the option is already selected, remove it from the selectedFruits array
      const index = selectedFruits.indexOf(selectedOption);
      if (index > -1) {
          selectedFruits.splice(index, 1);
      }
  } else {
      // If the option is not selected, add it to the selectedFruits array
      selectedFruits.push(selectedOption);
  }

  // Toggle the option selection for players
  if (selectedPlayers.includes(selectedOption)) {
      // If the option is already selected, remove it from the selectedPlayers array
      const index = selectedPlayers.indexOf(selectedOption);
      if (index > -1) {
          selectedPlayers.splice(index, 1);
      }
  } else {
      // If the option is not selected, add it to the selectedPlayers array
      selectedPlayers.push(selectedOption);
  }

  // Call updateMarkers() after selection to update the map markers
  updateMarkers();

  // Update the dropdown menu appearance to highlight orange
  updateDropdownAppearance();
}

// Function to add a marker for a specific location
function addMarker(name, lat, lng, rarity, iconUrl) {
  let icon;

  if (iconUrl) {
      icon = L.icon({
          iconUrl: iconUrl,
          iconSize: [128, 128],
      });
  } else {
      // Icon logic
      if (name.toLowerCase() === "blueberry") {
          icon = blueberryIcon;
      } else if (name.toLowerCase() === "boar") {
          icon = boarIcon;
      } else if (name.toLowerCase() === "daisy") {
          icon = daisyIcon;
      } else if (name.toLowerCase() === "datura") {
          icon = daturaIcon;
      } else if (name.toLowerCase() === "deathcap") {
          icon = deathcapIcon;
      } else if (name.toLowerCase() === "deer") {
          icon = deerIcon;
      } else if (name.toLowerCase() === "amanita") {
          icon = amanitaIcon;
      } else if (name.toLowerCase() === "batflower") {
          icon = batflowerIcon;
      } else if (name.toLowerCase() === "bear") {
          icon = bearIcon;
      } else if (name.toLowerCase() === "grey wolf") {
          icon = greywolfIcon;
      } else if (name.toLowerCase() === "loios tears") {
          icon = loiostearsIcon;
      } else if (name.toLowerCase() === "mustard") {
          icon = mustardIcon;
      } else if (name.toLowerCase() === "nightshade") {
          icon = nightshadeIcon;
      } else if (name.toLowerCase() === "periwinkle") {
          icon = periwinkleIcon;
      } else if (name.toLowerCase() === "divine") {
          icon = divineIcon;
      } else if (name.toLowerCase() === "flax") {
          icon = flaxIcon;
      } else if (name.toLowerCase() === "rabbit") {
          icon = rabbitIcon;
      } else if (name.toLowerCase() === "rain lily") {
          icon = rainlilyIcon;
      } else if (name.toLowerCase() === "raspberry") {
          icon = raspberryIcon;
      } else if (name.toLowerCase() === "sage") {
          icon = sageIcon;
      } else if (name.toLowerCase() === "reeds") {
          icon = reedsIcon;
      } else if (name.toLowerCase() === "silver fir branch") {
          icon = silverfirIcon;
      } else if (name.toLowerCase() === "garlic") {
          icon = garlicIcon;
      } else if (name.toLowerCase() === "clay") {
          icon = clayIcon;
      } else if (name.toLowerCase() === "grapes") {
          icon = grapesIcon;
      } else if (name.toLowerCase() === "copper deposit") {
          icon = copperDepositIcon;
      } else if (name.toLowerCase() === "impure iron deposit") {
          icon = impureIronDepositIcon;
      } else if (name.toLowerCase() === "granite deposit") {
          icon = graniteDepositIcon;
      } else if (name.toLowerCase() === "iron deposit") {
          icon = ironDepositIcon;
      } else if (name.toLowerCase() === "gneiss deposit") {
          icon = gneissDepositIcon;
      } else if (name.toLowerCase() === "flint stones") {
          icon = flintStoneIcon;
      } else if (name.toLowerCase() === "tin deposit") {
          icon = tinDepositIcon;
      } else if (name.toLowerCase() === "limestone deposit") {
          icon = limestoneDepositIcon;
      } else if (name.toLowerCase() === "badger") {
          icon = badgerIcon;
      } else if (name.toLowerCase() === "fox") {
          icon = foxIcon;
      } else if (name.toLowerCase() === "pennybun") {
          icon = pennybunIcon;
      } else if (name.toLowerCase() === "corrupted boar") {
          icon = corruptedBoarIcon;
      } else if (name.toLowerCase() === "corrupted wolf") {
          icon = corruptedWolfIcon;
      } else if (name.toLowerCase() === "wolf elder") {
          icon = wolfElderIcon;

      } else if (rarity === "common") {
          icon = commonIcon;
      } else if (rarity === "uncommon") {
          icon = uncommonIcon;
      } else if (rarity === "rare") {
          icon = rareIcon;
      } else {
          icon = defaultIcon;
      }
  }

  const marker = L.marker([lat, lng], {
      icon: icon,
  }).bindPopup(`${name}, (${lat.toFixed(3)}, ${lng.toFixed(3)})`);

  return marker;

}

function clearAllMarkers() {
  markers.forEach((marker) => marker.remove());
  markers = [];
  selectedFruits = [];
  selectedAnimals = [];
  selectedPlants = [];
  selectedMushrooms = [];
  selectedFlowers = [];
  selectedPlayers = [];
  selectedStone = [];
  selectedSpecial = [];
  tempMarkers = [];
  updateDropdownAppearance();
  map.setView([0, 0], 0, {
      animate: true
  });
}

// Function to update the markers
function updateMarkers() {
  // Remove all existing markers from the map
  markers.forEach((marker) => marker.remove());
  markers = [];

  // Add markers for selected options
  selectedFruits.forEach((selectedOption) => {
      const locationData = resourceLocations.find(
          (location) => location.name === selectedOption
      );
      if (locationData) {
          locationData.locations.forEach((location) => {
              const marker = addMarker(
                  locationData.name,
                  location.lat,
                  location.lng,
                  locationData.rarity
              );
              markers.push(marker);
          });
      }
      const playerData = playerLocations.find(
          (location) => location.name === selectedOption
      );
      if (playerData) {
          playerData.locations.forEach((location) => {
              const marker = addMarker(playerData.name, location.lat, location.lng);
              markers.push(marker);
          });
      }
  });

  markers.forEach((marker) => marker.addTo(map));
}

function toggleDropdown(category) {
  const dropdownOptions = document.getElementById(`${category}-dropdown`);

  if (dropdownOptions) {
      dropdownOptions.classList.toggle("open");
  } else {
      console.error(`Dropdown options with ID '${category}' not found.`);
  }
}

function toggleDropdown(category) {
  const dropdownOptions = document.getElementById(`${category}-dropdown`);

  // Check if dropdownOptions is not null before accessing its style property
  if (dropdownOptions) {
      dropdownOptions.style.display = dropdownOptions.style.display === "block" ? "none" : "block";
  } else {
      console.error(`Dropdown options with ID '${category}' not found.`);
  }
}

// Function to add Orange color to selected menu options
function updateDropdownAppearance() {
  const dropdownOptions = document.querySelectorAll(".option");
  const dropdownTitle = document.querySelector(".dropdown-title");

  dropdownOptions.forEach((option) => {
      const name = option.textContent;
      const category = name === "Fruit" ? "fruit" : "animals";

      if (selectedPlayers.includes(name)) {
          option.style.backgroundColor = "orange";
          option.style.color = "black";
      } else {
          option.style.backgroundColor = "white";
          option.style.color = category === "fruit" ? "green" : "blue";
      }
  });

  // Check if selectedPlayers array is empty to remove orange highlight from menu
  const allDeselected = dropdownOptions.length === selectedPlayers.length;
  if (allDeselected) {
      dropdownTitle.style.backgroundColor = category === "fruit" ? "green" : "blue";
      dropdownTitle.style.color = "transparent";
  }
}

// Function to hide dropdown menus if the mouse is moved outside of the menu
function hideDropdownsIfMouseOutside(event, dropdownId) {
  const dropdownOptions = document.getElementById(dropdownId);
  if (dropdownOptions.style.display === "block" && !event.target.closest(".custom-dropdown")) {
      dropdownOptions.style.display = "none";
  }
}

//Function to add event listener to detect mouse movements outside the dropdown menus
function addMousemoveListenerToDocument() {
  document.addEventListener("mousemove", (event) => {
      hideDropdownsIfMouseOutside(event, "fruit-dropdown");
      hideDropdownsIfMouseOutside(event, "animals-dropdown");
      hideDropdownsIfMouseOutside(event, "plants-dropdown");
      hideDropdownsIfMouseOutside(event, "mushrooms-dropdown");
      hideDropdownsIfMouseOutside(event, "flowers-dropdown");
      hideDropdownsIfMouseOutside(event, "players-dropdown");
      hideDropdownsIfMouseOutside(event, "stone-dropdown");
      hideDropdownsIfMouseOutside(event, "special-dropdown");
  });
}



L.Map.mergeOptions({
  // @section Mousewheel options
  // @option smoothWheelZoom: Boolean|String = true
  // Whether the map can be zoomed by using the mouse wheel. If passed `'center'`,
  // it will zoom to the center of the view regardless of where the mouse was.
  smoothWheelZoom: true,

  // @option smoothWheelZoom: number = 1
  // setting zoom speed
  smoothSensitivity: 1

});


L.Map.SmoothWheelZoom = L.Handler.extend({

  addHooks: function() {
      L.DomEvent.on(this._map._container, 'wheel', this._onWheelScroll, this);
  },

  removeHooks: function() {
      L.DomEvent.off(this._map._container, 'wheel', this._onWheelScroll, this);
  },

  _onWheelScroll: function(e) {
      if (!this._isWheeling) {
          this._onWheelStart(e);
      }
      this._onWheeling(e);
  },

  _onWheelStart: function(e) {
      var map = this._map;
      this._isWheeling = true;
      this._wheelMousePosition = map.mouseEventToContainerPoint(e);
      this._centerPoint = map.getSize()._divideBy(2);
      this._startLatLng = map.containerPointToLatLng(this._centerPoint);
      this._wheelStartLatLng = map.containerPointToLatLng(this._wheelMousePosition);
      this._startZoom = map.getZoom();
      this._moved = false;
      this._zooming = true;

      map._stop();
      if (map._panAnim) map._panAnim.stop();

      this._goalZoom = map.getZoom();
      this._prevCenter = map.getCenter();
      this._prevZoom = map.getZoom();

      this._zoomAnimationId = requestAnimationFrame(this._updateWheelZoom.bind(this));
  },

  _onWheeling: function(e) {
      var map = this._map;

      this._goalZoom = this._goalZoom + L.DomEvent.getWheelDelta(e) * 0.003 * map.options.smoothSensitivity;
      if (this._goalZoom < map.getMinZoom() || this._goalZoom > map.getMaxZoom()) {
          this._goalZoom = map._limitZoom(this._goalZoom);
      }
      this._wheelMousePosition = this._map.mouseEventToContainerPoint(e);

      clearTimeout(this._timeoutId);
      this._timeoutId = setTimeout(this._onWheelEnd.bind(this), 200);

      L.DomEvent.preventDefault(e);
      L.DomEvent.stopPropagation(e);
  },

  _onWheelEnd: function(e) {
      this._isWheeling = false;
      cancelAnimationFrame(this._zoomAnimationId);
      this._map._moveEnd(true);
  },

  _updateWheelZoom: function() {
      var map = this._map;

      if ((!map.getCenter().equals(this._prevCenter)) || map.getZoom() != this._prevZoom)
          return;

      this._zoom = map.getZoom() + (this._goalZoom - map.getZoom()) * 0.3;
      this._zoom = Math.floor(this._zoom * 100) / 100;

      var delta = this._wheelMousePosition.subtract(this._centerPoint);
      if (delta.x === 0 && delta.y === 0)
          return;

      if (map.options.smoothWheelZoom === 'center') {
          this._center = this._startLatLng;
      } else {
          this._center = map.unproject(map.project(this._wheelStartLatLng, this._zoom).subtract(delta), this._zoom);
      }

      if (!this._moved) {
          map._moveStart(true, false);
          this._moved = true;
      }

      map._move(this._center, this._zoom);
      this._prevCenter = map.getCenter();
      this._prevZoom = map.getZoom();

      this._zoomAnimationId = requestAnimationFrame(this._updateWheelZoom.bind(this));
  }

});

L.Map.addInitHook('addHandler', 'smoothWheelZoom', L.Map.SmoothWheelZoom);


// Call the function to add the mousemove listener to the document
addMousemoveListenerToDocument();


document.addEventListener("DOMContentLoaded", function() {
  // Add mouseleave event listener to the sidebar
  const sidebar = document.querySelector('.sidebar');

  if (sidebar) {
      sidebar.addEventListener("mouseleave", function() {
          closeSidebar();
      });
  }

  function closeSidebar() {
      const openSidebar = document.querySelector('.sidebar.open');
      if (openSidebar) {
          openSidebar.classList.remove('open');

          // Reset the left positions to their default values
          document.getElementById('resources-button').style.left = '105px';

          const clearResourcesButton = document.querySelector('.clear-resources-button');
          if (clearResourcesButton) {
              clearResourcesButton.style.left = '235px';
          }

          const loginButton = document.querySelector('.login-button');
          if (loginButton) {
              loginButton.style.left = '10px';
          }

          const loadMarkersButton = document.querySelector('.load-markers-button');
          if (loadMarkersButton) {
              loadMarkersButton.style.left = '400px';
          }
      }
  }
});

document.addEventListener("DOMContentLoaded", function() {
  initMap();

  // Get the button element and the span element by their IDs
  var loadMarkersButton = document.getElementById("load-markers-button");
  var buttonTextSpan = document.getElementById("button-text");

  // Store the original text content of the button
  var originalButtonText = buttonTextSpan.textContent;

  // Add a click event listener to the button
  loadMarkersButton.addEventListener("click", function(event) {
      // Toggle the text content
      if (buttonTextSpan.textContent === originalButtonText) {
          buttonTextSpan.textContent = "Hide Saved Markers";
      } else {
          buttonTextSpan.textContent = originalButtonText;
      }

  });

});