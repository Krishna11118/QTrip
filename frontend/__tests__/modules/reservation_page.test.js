
import {
  fetchReservations,
  addReservationToTable,
} from "../../modules/reservation_page.js";
require("jest-fetch-mock").enableMocks();

const fs = require("fs");
const path = require("path");
const html = fs.readFileSync(
  path.resolve(__dirname, "../../pages/adventures/reservations/index.html"),
  "utf8"
);
jest.dontMock("fs");

describe("Reservation Page Tests", function () {
  beforeEach(() => {
    fetch.resetMocks();
    document.documentElement.innerHTML = html.toString();
  });

  afterEach(() => {
    jest.resetModules();
  });

  it("Check if fetch call for the reservations was made and data was received", async () => {
    const data = await fetchReservations();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/reservations")
    );
  });

  it("Catches errors and returns null", async () => {
    fetch.mockReject(() => "API failure");

    const data = await fetchReservations();
    expect(data).toEqual(null);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/reservations")
    );
  });

  it("Adding reservation to table", function () {
    let reservations = [];
    addReservationToTable(reservations);
    expect(
      document.getElementById("reservation-table-parent").style.display
    ).toBe("none");
    expect(document.getElementById("no-reservation-banner").style.display).toBe(
      "block"
    );

    reservations = [
      {
        name: "Test",
        date: "2020-11-05",
        person: "10",
        adventure: "2447910730",
        adventureName: "Niaboytown",
        price: 8006,
        id: "166e0e79d4efc2f8",
        time: "Wed Nov 04 2020 21:32:31 GMT+0530 (India Standard Time)",
      },
      {
        name: "Test2",
        date: "2021-01-01",
        person: "1",
        adventure: "2447910731",
        adventureName: "Random Adventure",
        price: 1234,
        id: "52cs0v79f4afcaf8",
        time: "Wed Nov 04 2020 20:30:59 GMT+0530 (India Standard Time)",
      },
    ];
    addReservationToTable(reservations);
    expect(
      document.getElementById("reservation-table-parent").style.display
    ).toBe("block");
    expect(document.getElementById("no-reservation-banner").style.display).toBe(
      "none"
    );
    expect(document.getElementById("reservation-table").children.length).toBe(
      reservations.length
    );
    reservations.map((ele, idx) => {
      expect(document.getElementById(ele.id).children[0].href).toEqual(
        expect.stringContaining(`detail/?adventure=${ele.adventure}`)
      );
      let children = document.getElementById("reservation-table").children[idx]
        .children;
      expect(children[1].innerHTML).toEqual(ele.name);
      expect(children[2].innerHTML).toEqual(ele.adventureName);
      expect(children[3].innerHTML).toEqual(ele.person);
      expect(children[5].innerHTML).toEqual(String(ele.price));
    });
    expect(
      document.getElementById("reservation-table").children[0].children[4]
        .innerHTML
    ).toEqual("5/11/2020");
    expect(
      document.getElementById("reservation-table").children[0].children[6]
        .innerHTML
    ).toEqual("4 November 2020, 9:32:31 pm");
    expect(
      document.getElementById("reservation-table").children[1].children[4]
        .innerHTML
    ).toEqual("1/1/2021");
    expect(
      document.getElementById("reservation-table").children[1].children[6]
        .innerHTML
    ).toEqual("4 November 2020, 8:30:59 pm");
  });
});
