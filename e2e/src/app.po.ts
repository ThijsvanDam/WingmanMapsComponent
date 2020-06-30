import { browser, by, element } from 'protractor';

export class WingmanMapPage {

  /**
   * Go to the url set in the protractor config.
   */
  navigateTo(): Promise<unknown> {
    return browser.get(browser.baseUrl) as Promise<unknown>;
  }

  getTitleText(): Promise<string> {
    return element(by.css('app-wingman-map h1')).getText() as Promise<string>;
  }

  /**
   * Get the leaflet overlay pane
   */
  getCurrentRoutes(){
    return element(by.css('.leaflet-overlay-pane'));
  }

  /**
   * Get the leaflet marker pane
   */
  getCurrentMarkers(){
    return element(by.css('.leaflet-marker-pane'));
  }

  /**
   * Select the flights inside the dropdown on the right side of the page.
   */
  selectFlightFromDropdown(flightId: string){
    const appMapControl = element.all(by.tagName('app-map-control'));
    const flightDropDown = appMapControl.all(by.tagName('select'));

    flightDropDown.all(by.cssContainingText('option', flightId)).click();
  }

  /**
   * Select the flights inside the flight list on the right side of the page.
   * Do this by just clicking the checkbox.
   */
  selectFlightInList(flightId: string){
    const appflightListRows = element.all(by.tagName('app-flight-list')).all(by.tagName('tr'));

    appflightListRows.each((row, index) => {
      // Skip the TH row.
      if (index > 0) {
        row.getText().then((text: string) => {
        });
        // The second TD contains the ID of the flight.
        const childId = row.all(by.css('td:nth-child(2)'));

        // Get the text of the second TD and check if it's equal to the flightID param.
        // If so, click the checkbox of that same flight.
        childId.getText().then((text: string) => {
          if (text[0] === flightId){
            row.all(by.css('td:nth-child(1)')).click();
          }
        });
      }
    });
  }
}
