import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire';
import { NgModule } from '@angular/core';


import { AppRoutingModule } from './app-routing.module';

// Components
import { AppComponent } from './app.component';
import { MapComponent } from './components/map/map.component';

// Services
import { WingmanMapService } from './services/wingman-map.service';
import { WingmanDataService } from './services/wingman-data.service';

import { environment } from 'src/environments/environment';
import { MapControlComponent } from './components/map-control/map-control.component';
import { WingmanMapComponent } from './components/wingman-map/wingman-map.component';
import { FlightListComponent } from './components/flight-list/flight-list.component';
import { FlightDetailsComponent } from './components/flight-details/flight-details.component';


@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    MapControlComponent,
    WingmanMapComponent,
    FlightListComponent,
    FlightDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase)
  ],
  providers: [
    WingmanDataService,
    WingmanMapService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
