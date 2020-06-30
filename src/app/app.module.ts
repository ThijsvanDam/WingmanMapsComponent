import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';

import { environment } from 'src/environments/environment';

// Components
import { AppComponent } from './app.component';
import { MapComponent } from './components/map/map.component';
import { MapControlComponent } from './components/map-control/map-control.component';
import { WingmanMapComponent } from './components/wingman-map/wingman-map.component';
import { FlightListComponent } from './components/flight-list/flight-list.component';
import { AircraftListComponent } from './components/aircraft-list/aircraft-list.component';
import { AircraftComponent } from './components/aircraft/aircraft.component';

// Services
import { CookieService } from './services/cookie.service';
import { WingmanMapService } from './services/wingman-map.service';
import { WingmanDataService } from './services/wingman-data.service';



@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    MapControlComponent,
    WingmanMapComponent,
    FlightListComponent,
    AircraftListComponent,
    AircraftComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase)
  ],
  providers: [
    WingmanDataService,
    WingmanMapService,
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
