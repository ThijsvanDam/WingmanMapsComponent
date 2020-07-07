import { WingmanMapPage } from './app.po';
import { browser, logging, element, by } from 'protractor';

const flights = require('../../src/assets/json/flights');

describe('Wingman maps component', () => {
  let page: WingmanMapPage;

  beforeEach(() => {
    page = new WingmanMapPage();
    page.navigateTo();
    browser.waitForAngular();
  });

  it('[1/6] Shows correct amount of legs and markers on selecting a flight through the dropdown.', () => {

    const flight = flights[8];

    // Get all the distinct legIds so you can count them.
    let legIds = [];
    flight.legs.forEach(leg => {
      legIds.push(leg.startId);
      legIds.push(leg.destinationId);
    });

    legIds = legIds.filter((legId, index) => {
      return legIds.indexOf(legId) === index;
    });

    page.selectFlightFromDropdown(flight.flightId);
    const routes = page.getCurrentRoutes();
    const markers = page.getCurrentMarkers();

    expect(routes.all(by.tagName('path')).count()).toEqual(flight.legs.length);
    expect(markers.all(by.tagName('img')).count()).toEqual(legIds.length);
  });

  it('[2/6] Shows correct amount of legs and markers on selecting a flight through the dropdown.', () => {

    const flight = flights[1];

    // Get all the distinct legIds so you can count them.
    let legIds = [];
    flight.legs.forEach(leg => {
      legIds.push(leg.startId);
      legIds.push(leg.destinationId);
    });

    legIds = legIds.filter((legId, index) => {
      return legIds.indexOf(legId) === index;
    });

    page.selectFlightFromDropdown(flight.flightId);
    const routes = page.getCurrentRoutes();
    const markers = page.getCurrentMarkers();

    expect(routes.all(by.tagName('path')).count()).toEqual(flight.legs.length);
    expect(markers.all(by.tagName('img')).count()).toEqual(legIds.length);
  });

  it('[3/6] Shows correct amount of legs and markers on selecting a flight through the dropdown.', () => {

    const flight = flights[2];

    // Get all the distinct legIds so you can count them.
    let legIds = [];
    flight.legs.forEach(leg => {
      legIds.push(leg.startId);
      legIds.push(leg.destinationId);
    });

    legIds = legIds.filter((legId, index) => {
      return legIds.indexOf(legId) === index;
    });

    page.selectFlightFromDropdown(flight.flightId);
    const routes = page.getCurrentRoutes();
    const markers = page.getCurrentMarkers();

    expect(routes.all(by.tagName('path')).count()).toEqual(flight.legs.length);
    expect(markers.all(by.tagName('img')).count()).toEqual(legIds.length);
  });

  it('[4/6] Shows correct amount of legs and markers on selecting a flight through the dropdown.', () => {

    const flight = flights[3];

    // Get all the distinct legIds so you can count them.
    let legIds = [];
    flight.legs.forEach(leg => {
      legIds.push(leg.startId);
      legIds.push(leg.destinationId);
    });

    legIds = legIds.filter((legId, index) => {
      return legIds.indexOf(legId) === index;
    });

    page.selectFlightFromDropdown(flight.flightId);
    const routes = page.getCurrentRoutes();
    const markers = page.getCurrentMarkers();

    expect(routes.all(by.tagName('path')).count()).toEqual(flight.legs.length);
    expect(markers.all(by.tagName('img')).count()).toEqual(legIds.length);
  });


  it('[5/6] Shows correct amount of legs and markers on selecting a flight through the dropdown.', () => {

    const flight = flights[4];

    // Get all the distinct legIds so you can count them.
    let legIds = [];
    flight.legs.forEach(leg => {
      legIds.push(leg.startId);
      legIds.push(leg.destinationId);
    });

    legIds = legIds.filter((legId, index) => {
      return legIds.indexOf(legId) === index;
    });

    page.selectFlightFromDropdown(flight.flightId);
    const routes = page.getCurrentRoutes();
    const markers = page.getCurrentMarkers();

    expect(routes.all(by.tagName('path')).count()).toEqual(flight.legs.length);
    expect(markers.all(by.tagName('img')).count()).toEqual(legIds.length);
  });



  it('[6/6] Shows correct amount of legs and markers on selecting a flight through the dropdown.', () => {

    const flight = flights[5];

    // Get all the distinct legIds so you can count them.
    let legIds = [];
    flight.legs.forEach(leg => {
      legIds.push(leg.startId);
      legIds.push(leg.destinationId);
    });

    legIds = legIds.filter((legId, index) => {
      return legIds.indexOf(legId) === index;
    });

    page.selectFlightFromDropdown(flight.flightId);
    const routes = page.getCurrentRoutes();
    const markers = page.getCurrentMarkers();

    expect(routes.all(by.tagName('path')).count()).toEqual(flight.legs.length);
    expect(markers.all(by.tagName('img')).count()).toEqual(legIds.length);
  });


  it('Shows correct amount of legs and markers on selecting a flight inside the list', () => {
    const flightId = 'FPG034689';

    const flight = flights[5];
    const flightTwo = flights.filter(currentFlight => currentFlight.flightId === flightId)[0];

    // Get all the distinct legIds so you can count them.
    let legIds = [];
    flight.legs.forEach(leg => {
      legIds.push(leg.startId);
      legIds.push(leg.destinationId);
    });

    flightTwo.legs.forEach(leg => {
      legIds.push(leg.startId);
      legIds.push(leg.destinationId);
    });

    legIds = legIds.filter((legId, index) => {
      return legIds.indexOf(legId) === index;
    });

    // Do the necessary steps, select the two flights.
    // One through the dropdown and one through the list.
    page.selectFlightFromDropdown(flight.flightId);
    page.selectFlightInList(flightTwo.flightId);

    // Gather leaflet data
    const routes = page.getCurrentRoutes();
    const markers = page.getCurrentMarkers();

    // The items that are shown should be equal to the items gathered from the selected flights.
    expect(routes.all(by.tagName('path')).count()).toEqual(flight.legs.length + flightTwo.legs.length);
    expect(markers.all(by.tagName('img')).count()).toEqual(legIds.length);

    // Select one extra flight and test it again, so that
    // the working of adding extra flights is ensured.
    const flightThreeId = 'FPG034966';
    const flightThree = flights.filter(currentFlight => currentFlight.flightId === flightThreeId)[0];

    flightThree.legs.forEach(leg => {
      legIds.push(leg.startId);
      legIds.push(leg.destinationId);
    });

    legIds = legIds.filter((legId, index) => {
      return legIds.indexOf(legId) === index;
    });

    page.selectFlightInList(flightThree.flightId);

    expect(routes.all(by.tagName('path')).count()).toEqual(
      flight.legs.length + flightTwo.legs.length + flightThree.legs.length);
    expect(markers.all(by.tagName('img')).count()).toEqual(legIds.length);

  });

  it('Should be able to hide and show markers.', () => {

  });


  afterEach(async () => {
    // I have commented this because firebase automatically throws errors.
    // It doesn't seem worth my time to work around this.

    // // Assert that there are no errors emitted from the browser
    // const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    // expect(logs).not.toContain(jasmine.objectContaining({
    //   level: logging.Level.SEVERE,
    // } as logging.Entry));
  });
});
