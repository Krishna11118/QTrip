import config from "../conf/index.js";

async function init() {
  // Show loading message
  showLoadingMessage();
  // debug();

  try {
    // Fetches list of all cities along with their images and description
    let cities = await fetchCities();

    // Updates the DOM with the cities
    if (cities) {
      hideLoadingMessage(); // Hide loading message once cities are fetched

      cities.forEach((key) => {
        addCityToDOM(key.id, key.city, key.description, key.image);
      });
    }
  } catch (error) {
    console.error("Failed to fetch data:", error);
    // Ensure the loader is hidden even in case of an error
    hideLoadingMessage();
  }
}

// Show loading message function
function showLoadingMessage() {
  let loader = document.createElement("div");
  loader.id = "loader";
  loader.innerHTML = "";
  document.body.append(loader);
}

// Hide loading message function
function hideLoadingMessage() {

  let loader = document.getElementById("loader");
  if (loader) {
    loader.remove();
  }
}

// Implementation of fetch call
async function fetchCities() {
  // TODO: MODULE_CITIES
  // 1. Fetch cities using the Backend API and return the data

  try {
    const response = await fetch(`${config.backendEndpoint}/cities`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Failed to fetch data:", error);
    return null;
  }
}

// Implementation of DOM manipulation to add cities
function addCityToDOM(id, city, description, image) {
  let container = document.createElement("div");
  container.className = "col-sm-12 col-md-6 col-lg-3 mb-3";
  let elements = `<a href="pages/adventures/?city=${id}" id="${id}">
    <div class="tile" > 
      <div  class="tile-text text-center" > 
       <h5>${city}</h5>
       <p>${description}</p>
      </div>
    <img src="${image}" class="img-responsive" alt="img" >
    </div>
</a>`;  

  container.innerHTML = elements;

  document.getElementById("data").appendChild(container);
}

export { init, fetchCities, addCityToDOM };
