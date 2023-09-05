import config from "../conf/index.js";

//Implementation to extract city from query params
function getCityFromURL(search) {
  // TODO: MODULE_ADVENTURES
  // 1. Extract the city id from the URL's Query Param and return it
  const params = new URLSearchParams(search);
  return params.get("city");
}
// getCityFromURL();

//Implementation of fetch call with a paramterized input based on city
async function fetchAdventures(city) {
  // TODO: MODULE_ADVENTURES
  // 1. Fetch adventures using the Backend API and return the data

  try {
    let response = await fetch(
      `${config.backendEndpoint}/adventures?city=${city}`
    );
    let data = await response.json();
    return data;
  } catch (error) {
    console.log("Failed to fetch data:", error);
    return null;
   
  }
}

//Implementation of DOM manipulation to add adventures for the given city from list of adventures
function addAdventureToDOM(adventures) {
  // TODO: MODULE_ADVENTURES
  // 1. Populate the Adventure Cards and insert those details into the DOM
  
  adventures.forEach((key) => {
    let ele = document.createElement("div");
    ele.className = "col-6 col-lg-3 mb-4";
    ele.innerHTML = `
        <a href="detail/?adventure=${key.id}" id="${key.id}">
        <div class="bannerParent border-0" >
        <div class="category-banner">${key.category}</div>
          <div class="activity-card">
            
            <img
              class="img-responsive"
              src=${key.image} 
            />
            <div class="text-md-center w-100 mt-3 px-3">
              <div class="d-block d-md-flex justify-content-between flex-wrap pl-3 pr-3">
                <h5 class="text-left">${key.name}</h5>
                <p>₹${key.costPerHead}</p>
              </div>
              <div class="d-block d-md-flex justify-content-between flex-wrap pl-3 pr-3">
                <h5 class="text-left">Duration</h5>
                <p>${key.duration} Hours</p>
              </div>
            </div>
          </div>
          </div>
        </a>
      `;

    document.getElementById("data").appendChild(ele);
  });
}

//Implementation of filtering by duration which takes in a list of adventures, the lower bound and upper bound of duration and returns a filtered list of adventures.
function filterByDuration(list, low, high) {
  // TODO: MODULE_FILTERS
  // 1. Filter adventures based on Duration and return filtered list
  let filteredDuration = [];
  list.forEach((adventure) => {
    if (
      adventure.duration >= parseInt(low) &&
      adventure.duration <= parseInt(high)
    ) {
      filteredDuration.push(adventure);
    }
  });

  return filteredDuration;
}

//Implementation of filtering by category which takes in a list of adventures, list of categories to be filtered upon and returns a filtered list of adventures.
function filterByCategory(list, categoryList) {
  // TODO: MODULE_FILTERS
  // 1. Filter adventures based on their Category and return filtered list

  let filteredCategory = [];

  list.forEach((adventure) => {
    if (categoryList.includes(adventure.category)) {
      filteredCategory.push(adventure);
    }
  });
  return filteredCategory;
}

//Implementation of combined filter function that covers the following cases :
// 1. Filter by duration only
// 2. Filter by category only
// 3. Filter by duration and category together

function filterFunction(list, filters) {
  let filteredList = [];

  if (filters.duration === "" && filters.category.length !== 0) {
    filteredList = filterByCategory(list, filters.category);
  } else if (filters.duration !== "" && filters.category.length === 0) {
    const durationNumbers = filters.duration.split("-");
    filteredList = filterByDuration(
      list,
      parseInt(durationNumbers[0]),
      parseInt(durationNumbers[1])
    );
  } else if (filters.duration !== "" && filters.category.length !== 0) {
    const list1 = filterByCategory(list, filters.category);
    const durationNumbers = filters.duration.split("-");
    const list2 = filterByDuration(
      list1,
      parseInt(durationNumbers[0]),
      parseInt(durationNumbers[1])
    );
    // Use of Set to remove duplicates
    filteredList = Array.from(new Set(list2));
  } else {
    return list;
  }
  return filteredList;
}

//Implementation of localStorage API to save filters to local storage. This should get called everytime an onChange() happens in either of filter dropdowns
function saveFiltersToLocalStorage(filters) {
  // TODO: MODULE_FILTERS
  // 1. Store the filters as a String to localStorage
  let filter = localStorage.setItem("filters", JSON.stringify(filters));
  // console.log(filter, " Filter");
  return true;
}

//Implementation of localStorage API to get filters from local storage. This should get called whenever the DOM is loaded.
function getFiltersFromLocalStorage(filters) {
  // TODO: MODULE_FILTERS
  // 1. Get the filters from localStorage and return String read as an object
  let store = JSON.parse(localStorage.getItem("filters"));
  // console.log(store, "Store");
  return store;

  // Place holder for functionality to work in the Stubs

  // return null;
}

//Implementation of DOM manipulation to add the following filters to DOM :
// 1. Update duration filter with correct value
// 2. Update the category pills on the DOM

function generateFilterPillsAndUpdateDOM(filters) {
  // TODO: MODULE_FILTERS
  // 1. Use the filters given as input, update the Duration Filter value and Generate Category Pills

  // Assuming filters is an object containing the category filters

  filters["category"].forEach((category) => {
    let pills = document.createElement("div");
    pills.innerHTML = `<p class="category-filter">${category}</p>`;
    document.getElementById("category-list").appendChild(pills);
  });

  if (filters.duration === "") {
    document.getElementById("duration-select").selectedIndex = 0;
    return;
  }

  const duration = document.getElementById("duration-select");
  for (let i = 0; i < duration.options.length; i++) {
    if (duration.options[i].value === filters.duration) {
      duration.options[i].selected = true;
      return;
    }
  }
}
export {
  getCityFromURL,
  fetchAdventures,
  addAdventureToDOM,
  filterByDuration,
  filterByCategory,
  filterFunction,
  saveFiltersToLocalStorage,
  getFiltersFromLocalStorage,
  generateFilterPillsAndUpdateDOM,
};
