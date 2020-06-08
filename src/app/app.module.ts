import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire';
import { NgModule } from '@angular/core';


import { AppRoutingModule } from './app-routing.module';

// Components
import { AppComponent } from './app.component';
import { DynamicMapComponent } from './dynamic-map/dynamic-map.component';

// Services
import { WingmanMapService } from './services/wingman-map.service';
import { WingmanDataService } from './services/wingman-data.service';

import { environment } from 'src/environments/environment';


@NgModule({
  declarations: [
    AppComponent,
    DynamicMapComponent
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
