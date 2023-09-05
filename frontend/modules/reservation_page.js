import config from "../conf/index.js";

//Implementation of fetch call to fetch all reservations
async function fetchReservations() {
  // TODO: MODULE_RESERVATIONS
  // 1. Fetch Reservations by invoking the REST API and return them

  try {
    const response = await fetch(`${config.backendEndpoint}/reservations/`);
    const reserv = await response.json();
    //  console.log(reserv,"reserv")
    return reserv;
  } catch (error) {
    console.log(error);
  }

  // Place holder for functionality to work in the Stubs
  return null;
}

//Function to add reservations to the table. Also; in case of no reservations, display the no-reservation-banner, else hide it.
function addReservationToTable(reservations) {
  // TODO: MODULE_RESERVATIONS
  // 1. Add the Reservations to the HTML DOM so that they show up in the table

  //Conditionally render the no-reservation-banner and reservation-table-parent
  //  console.log(reservations)
  if (reservations.length === 0) {
    document.getElementById('no-reservation-banner').style.display = 'block';
    document.getElementById('reservation-table-parent').style.display = 'none';
  } else {
    document.getElementById('no-reservation-banner').style.display = 'none';
    document.getElementById('reservation-table-parent').style.display = 'block';
  }
  
  // console.log(reservations)
   for ( let i= 0; i <reservations.length; i++ ){

    const d = new Date();
      // let text = reservations.date("en-IN");
      // console.log(text)
      let timeAt = new Date(reservations[i].time).toLocaleString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        second : "numeric",
         
      
      })
      const splitTime = timeAt.split(" at")
      // console.log(splitTime)
      const joinTime = splitTime.join(",")
      // console.log(joinTime)
     

     let row=document.createElement('tr');
     row.innerHTML=`
     <tr>
        <td scope="col">${reservations[i].id}</td>
        <td scope="col">${reservations[i].name}</td>
        <td scope="col">${reservations[i].adventureName}</td>
        <td scope="col">${reservations[i].person}</td>
        <td scope="col">${new Date(reservations[i].date).toLocaleDateString('en-IN')}</td>
        <td scope="col">${reservations[i].price}</td>
        <td scope="col" >${joinTime}</td>
        <td scope="col" class="reservation-visit-button" > <div id="${reservations[i].id}" ><a class="reservation-visit-button"  href='../detail/?adventure=${reservations[i].adventure}'>Visit Advnture</a> </div>
        </th>
    </tr>
</tr>`
document.getElementById('reservation-table').append(row);
   }

  /*
    Iterating over reservations, adding it to table (into div with class "reservation-table") and link it correctly to respective adventure
    The last column of the table should have a "Visit Adventure" button with id=<reservation-id>, class=reservation-visit-button and should link to respective adventure page

    Note:
    1. The date of adventure booking should appear in the format D/MM/YYYY (en-IN format) Example:  4/11/2020 denotes 4th November, 2020
    2. The booking time should appear in a format like 4 November 2020, 9:32:31 pm
  */
}

export { fetchReservations, addReservationToTable };
