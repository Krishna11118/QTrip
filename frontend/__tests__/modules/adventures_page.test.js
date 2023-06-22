import {
  getCityFromURL,
  fetchAdventures,
  addAdventureToDOM,
  filterByDuration,
  filterByCategory,
  filterFunction,
  saveFiltersToLocalStorage,
  getFiltersFromLocalStorage,
  generateFilterPillsAndUpdateDOM
} from "../../modules/adventures_page.js";

require("jest-fetch-mock").enableMocks();

const fs = require("fs");
const path = require("path");
const html = fs.readFileSync(
  path.resolve(__dirname, "../../pages/adventures/index.html"),
  "utf8"
);
const mockAdventuresData = require("../fixtures/adventures.json");

jest.dontMock("fs");

Storage.prototype.getItem = jest.fn(() => expectedPayload);

describe("Adventure Page Tests", function () {
  beforeEach(() => {
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(() => null),
      },
      writable: true,
    });
    fetch.resetMocks();
    document.documentElement.innerHTML = html.toString();
  });

  afterEach(() => {
    // restore the original func after test
    jest.resetModules();
  });

  it("getCityFromURL() - Extracts city from query parameter and return it", async () => {
    const city = await getCityFromURL("?city=london");
    expect(city).toEqual("london");
  });

  it("fetchAdventures() - Makes a fetch call for /adventures API endpoint and returns an array with the adventures data", async () => {
    fetch.mockResponseOnce(JSON.stringify(mockAdventuresData));

    const data = await fetchAdventures("bengaluru");

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/adventures"));
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("?city=bengaluru")
    );

    expect(data).toBeInstanceOf(Array);
    expect(data).toEqual(mockAdventuresData);
  });

  it("fetchAdventures() - Catches errors and returns null, if fetch call fails", async () => {
    fetch.mockReject(new Error(null));

    const data = fetchAdventures("bengaluru");

    await expect(data).resolves.toEqual(null);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/adventures"));
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("?city=bengaluru")
    );
  });

  it("addAdventureToDOM() - Adds a new Adventure with id value set to <a> tag", function () {
    addAdventureToDOM([
      {
        category: "park",
        costPerHead: 20,
        currency: "INR",
        duration: 4,
        image: "",
        name: "park",
        id: "park",
      },
    ]);
    expect(document.getElementById("park")).toBeTruthy();
  });

  it("addAdventureToDOM() - <a> tag links the adventure card correctly to the corresponding Adventure details page", function () {
    addAdventureToDOM([
      {
        category: "park",
        costPerHead: 20,
        currency: "INR",
        duration: 4,
        image: "",
        name: "park",
        id: "123456",
      },
    ]);
    expect(document.getElementById("123456").href).toEqual(
      expect.stringContaining("/detail")
    );
    expect(document.getElementById("123456").href).toEqual(
      expect.stringContaining("?adventure=123456")
    );
  });

  it("filterByDuration() - Returns an array of adventures, filtered by duration", function () {
    const expected = [
      {
        id: "3091807927",
        name: "East Phisphoe",
        price: "500",
        currency: "INR",
        image:
          "https://images.pexels.com/photos/3380805/pexels-photo-3380805.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        duration: 10,
        category: "Beaches",
      },
    ];
    const input = [
      {
        id: "3091807927",
        name: "East Phisphoe",
        price: "500",
        currency: "INR",
        image:
          "https://images.pexels.com/photos/3380805/pexels-photo-3380805.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        duration: 10,
        category: "Beaches",
      },
      {
        id: "3091807927",
        name: "Beach Cabanna",
        price: "500",
        currency: "INR",
        image:
          "https://images.pexels.com/photos/67566/palm-tree-palm-ocean-summer-67566.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        duration: 15,
        category: "Beaches",
      },
    ];
    let output = filterByDuration(input, "6", "10");

    expect(output).toBeInstanceOf(Array);
    expect(output.sort()).toEqual(expected.sort());
  });

  it("filterByCategory() - Returns an array of adventures, filtered by one category", function () {
    const expected = [
      {
        id: "3091807927",
        name: "Cape Vernbla",
        price: "500",
        currency: "INR",
        image:
          "https://images.pexels.com/photos/4684185/pexels-photo-4684185.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        duration: 3,
        category: "Party",
      },
    ];
    const input = [
      {
        id: "3091807927",
        name: "Mount Sleephod",
        price: "500",
        currency: "INR",
        image:
          "https://images.pexels.com/photos/4390119/pexels-photo-4390119.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
        duration: 8,
        category: "Hillside",
      },
      {
        id: "3091807927",
        name: "Cape Vernbla",
        price: "500",
        currency: "INR",
        image:
          "https://images.pexels.com/photos/4684185/pexels-photo-4684185.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        duration: 3,
        category: "Party",
      },
    ];
    let output = filterByCategory(input, ["Party"]);

    expect(output).toBeInstanceOf(Array);
    expect(output.sort()).toEqual(expected.sort());
  });

  it("filterByCategory() - Returns an array of adventures, filtered by multiple categories", function () {
    const expected = [
      {
        id: "3091807927",
        name: "Cape Vernbla",
        price: "500",
        currency: "INR",
        image:
          "https://images.pexels.com/photos/4684185/pexels-photo-4684185.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        duration: 3,
        category: "Party",
      },
      {
        id: "3091807928",
        name: "Cape Vernbla",
        price: "700",
        currency: "INR",
        image:
          "https://images.pexels.com/photos/4684185/pexels-photo-4684185.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        duration: 5,
        category: "Cycling",
      },
    ];
    const input = [
      {
        id: "3091807927",
        name: "Mount Sleephod",
        price: "500",
        currency: "INR",
        image:
          "https://images.pexels.com/photos/4390119/pexels-photo-4390119.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
        duration: 8,
        category: "Hillside",
      },
      {
        id: "3091807927",
        name: "Cape Vernbla",
        price: "500",
        currency: "INR",
        image:
          "https://images.pexels.com/photos/4684185/pexels-photo-4684185.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        duration: 3,
        category: "Party",
      },
      {
        id: "3091807928",
        name: "Cape Vernbla",
        price: "700",
        currency: "INR",
        image:
          "https://images.pexels.com/photos/4684185/pexels-photo-4684185.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        duration: 5,
        category: "Cycling",
      },
    ];
    let output = filterByCategory(input, ["Party", "Cycling"]);

    expect(output).toBeInstanceOf(Array);
    expect(output.sort()).toEqual(expected.sort());
  });

  it("filterFunction() - Returns an array of adventures, filtered by both duration and categories", function () {
    const expected = [
      {
        id: "3091807920",
        name: "Lake Stokeque",
        price: "500",
        currency: "INR",
        image:
          "https://images.pexels.com/photos/1666021/pexels-photo-1666021.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        duration: 20,
        category: "Cycling",
      },
      {
        id: "3091807922",
        name: "Beach Cabanna",
        price: "500",
        currency: "INR",
        image:
          "https://images.pexels.com/photos/67566/palm-tree-palm-ocean-summer-67566.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        duration: 15,
        category: "Beaches",
      },
    ];
    const input = [
      {
        id: "309180719",
        name: "West Wilkeshay",
        price: "500",
        currency: "INR",
        image:
          "https://images.pexels.com/photos/1658967/pexels-photo-1658967.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        duration: 2,
        category: "Hillside",
      },
      {
        id: "3091807920",
        name: "Lake Stokeque",
        price: "500",
        currency: "INR",
        image:
          "https://images.pexels.com/photos/1666021/pexels-photo-1666021.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        duration: 20,
        category: "Cycling",
      },
      {
        id: "3091807921",
        name: "East Phisphoe",
        price: "500",
        currency: "INR",
        image:
          "https://images.pexels.com/photos/3380805/pexels-photo-3380805.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        duration: 10,
        category: "Beaches",
      },
      {
        id: "3091807922",
        name: "Beach Cabanna",
        price: "500",
        currency: "INR",
        image:
          "https://images.pexels.com/photos/67566/palm-tree-palm-ocean-summer-67566.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        duration: 15,
        category: "Beaches",
      },
    ];
    let output = filterFunction(input, {
      duration: "12-20",
      category: ["Beaches", "Cycling"],
    });

    expect(output).toBeInstanceOf(Array);
    expect(output.map((a) => a.id).sort()).toEqual(
      expected.map((a) => a.id).sort()
    );
  });

  it("saveFiltersToLocalStorage() - Adds the updated filter as a string to localstorage", function () {
    const filters = { duration: "12-20", category: ["Beaches", "Cycling"] };
    saveFiltersToLocalStorage(filters);

    expect(window.localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      "filters",
      JSON.stringify(filters)
    );
  });

  it("getFiltersFromLocalStorage() - Retrieves filters from local storage as an object", function () {
    const filters = { duration: "12-20", category: ["Beaches", "Cycling"] };
    window.localStorage.getItem = jest.fn(() => JSON.stringify(filters));

    const output = getFiltersFromLocalStorage();

    expect(window.localStorage.getItem).toHaveBeenCalledTimes(1);
    expect(window.localStorage.getItem).toHaveBeenCalledWith("filters");
    expect(typeof output).not.toEqual("string");
  });

  it("generateFilterPillsAndUpdateDOM() - Sets the category filter pills correctly", function () {
    const filters = { duration: "12-20", category: ["Beaches", "Cycling"] };

    generateFilterPillsAndUpdateDOM(filters);

    expect(document.getElementById("category-list").children.length).toEqual(filters.category.length);    
  });
});