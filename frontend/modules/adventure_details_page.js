import config from "../conf/index.js";
//Implementation to extract adventure ID from query params
function getAdventureIdFromURL(search) {
  // TODO: MODULE_ADVENTURE_DETAILS
  // 1. Get the Adventure Id from the URL
  const id = search.replace(/\D/g, "");

  return id;

  
}
//Implementation of fetch call with a paramterized input based on adventure ID
async function fetchAdventureDetails(adventureId) {
  // TODO: MODULE_ADVENTURE_DETAILS
  // 1. Fetch the details of the adventure by making an API call

  const url = `${config.backendEndpoint}/adventures/detail?adventure=${adventureId}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    // console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    return null; // or handle error as appropriate
  }

}

//Implementation of DOM manipulation to add adventure details to DOM
function addAdventureDetailsToDOM(adventure) {
  // TODO: MODULE_ADVENTURE_DETAILS
  // 1. Add the details of the adventure to the HTML DOM
  // console.log(adventure.images)

  document.getElementById("adventure-name").append(adventure.name);

  document.getElementById("adventure-subtitle").append(adventure.subtitle);

  adventure.images.forEach((img) => {
    const imgDom = document.createElement("div");
    imgDom.innerHTML = `<img  src="${img}" alt="img" class="activity-card-image">`;
    document.getElementById("photo-gallery").appendChild(imgDom);
  });

  document.getElementById("adventure-content").append(adventure.content);
}

//Implementation of bootstrap gallery component

function addBootstrapPhotoGallery(images) {
  document.getElementById("photo-gallery").innerHTML = `
    <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-indicators">${images
        .map(
          (_, idx) =>
            `<button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="${idx}"${
              idx === 0 ? ' class="active" aria-current="true"' : ""
            } aria-label="Slide ${idx + 1}"></button>`
        )
        .join("")}</div>
      <div class="carousel-inner">${images
        .map(
          (img, idx) =>
            `<div class="carousel-item${
              idx === 0 ? " active" : ""
            }"><img src="${img}" class="d-block w-100" width="702px" height="500px" alt="..."></div>`
        )
        .join("")}</div>
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>`;
}

//Implementation of conditional rendering of DOM based on availability

function conditionalRenderingOfReservationPanel(adventure) {
  // TODO: MODULE_RESERVATIONS
  // 1. If the adventure is already reserved, display the sold-out message.

  if (adventure.available == true) {
    document.getElementById("reservation-panel-available").style.display =
      "block";
    document.getElementById("reservation-panel-sold-out").style.display =
      "none";
    document.getElementById(
      "reservation-person-cost"
    ).innerHTML = `${adventure.costPerHead}`;
  } else {
    document.getElementById("reservation-panel-available").style.display =
      "none";
    document.getElementById("reservation-panel-sold-out").style.display =
      "block";
  }
}

//Implementation of reservation cost calculation based on persons
function calculateReservationCostAndUpdateDOM(adventure, persons) {
  // TODO: MODULE_RESERVATIONS
  // 1. Calculate the cost based on number of persons and update the reservation-cost
  document.getElementById(
    "reservation-person-cost"
  ).innerHTML = `${adventure.costPerHead}`;

  document.getElementById("reservation-cost").innerHTML = `${
    adventure.costPerHead * persons
  }`;
}

//Implementation of reservation form submission
function captureFormSubmit(adventure) {
  // TODO: MODULE_RESERVATIONS
  // 1. Capture the query details and make a POST API call using fetch() to make the reservation
  // 2. If the reservation is successful, show an alert with "Success!" and refresh the page. If the reservation fails, just show an alert with "Failed!".

  const myForm = document.getElementById("myForm");
  let adventureId = adventure.id;

  myForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = myForm.elements.name.value;
    const date = myForm.elements.date.value;
    const person = myForm.elements.person.value;

    // console.log(adventureId, "", name, "", date, "", person);

    const reservationData = {name: name,date: date,person: person,adventure: adventureId };

    async function makeReservation(reservationData) {
      try {
        const response = await fetch(
          `${config.backendEndpoint}/reservations/new`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(reservationData),
          }
                  
        );
             
        const res = await response.json()
        // console.log(res)

        if (response.ok) {
          alert("Success!");
          location.reload();
        } else {
          alert("Failed!");
        }
      } catch (error) {
        console.log(error);
        alert("Failed!");
      }
    }
    makeReservation(reservationData);
  });
}
//Implementation of success banner after reservation
function showBannerIfAlreadyReserved(adventure) {
  // TODO: MODULE_RESERVATIONS
  // 1. If user has already reserved this adventure, show the reserved-banner, else don't
   
  if (adventure.reserved == true){
    document.getElementById("reserved-banner").style.display ="block"; 
    
   }
   else{
    document.getElementById("reserved-banner").style.display ="none"; 
   }

}

export {
  getAdventureIdFromURL,
  fetchAdventureDetails,
  addAdventureDetailsToDOM,
  addBootstrapPhotoGallery,
  conditionalRenderingOfReservationPanel,
  captureFormSubmit,
  calculateReservationCostAndUpdateDOM,
  showBannerIfAlreadyReserved,
};
