import { addCityToDOM, fetchCities } from "../../modules/landing_page.js";
require("jest-fetch-mock").enableMocks();
const fs = require("fs");
const path = require("path");
const mockCitiesData = require("../fixtures/cities.json");

const html = fs.readFileSync(
  path.resolve(__dirname, "../../index.html"),
  "utf8"
);
jest.dontMock("fs");

describe("Landing Page Tests", function () {
  beforeEach(() => {
    document.documentElement.innerHTML = html.toString();
  });

  afterEach(() => {
    // restore the original func after test
    jest.resetModules();
    fetch.resetMocks();
  });

  it("fetchCities() - Makes a fetch call for /cities API endpoint and returns an array with the cities data", async () => {
    // Ref: https://www.leighhalliday.com/mock-fetch-jest
    // fetch.mockResponseOnce argument has to be string
    fetch.mockResponseOnce(JSON.stringify(mockCitiesData));

    let data = await fetchCities();

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).not.toHaveBeenCalledWith(expect.stringContaining("//cities"));
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/cities"));
    expect(data).toBeInstanceOf(Array);
    expect(data).toEqual(mockCitiesData);

  });

  it("Catches error and returns null, if fetch call fails ", async () => {
    fetch.mockReject(() => Promise.reject("API failure"));

    const data = await fetchCities();

    expect(data).toEqual(null);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).not.toHaveBeenCalledWith(expect.stringContaining("//cities"));
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/cities"));
  });

  it("Adds a new City - London", function () {
    addCityToDOM("london", "London", "London", "London");
    expect(document.getElementById("london")).toBeTruthy();

    //add checks for tile and parent div has an id of data
  });

  it("Correctly links City Card to Adventures page", function () {
    const expected = "adventures/?city=london";
    addCityToDOM("london", "London", "London", "London");
    expect(document.getElementById("london").href).toEqual(
      expect.stringContaining(expected)
    );
  });
});
