import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { AgmCoreModule, MapsAPILoader } from '@agm/core';
import {IconsModule, MDBBootstrapModule} from 'angular-bootstrap-md';
// For MDB Angular Free
import { NavbarModule, WavesModule, ButtonsModule } from 'angular-bootstrap-md'


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GoogleMapsModule,
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBWOS_rQS0Z1E3Po5inBDuIwiDHn2NA3DE',
      libraries: ['places', 'geometry']
    }),
    GoogleMapsModule,
    IconsModule,
    NavbarModule,
    WavesModule,
    ButtonsModule
    // MDBBootstrapModule.forRoot()
  ],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
