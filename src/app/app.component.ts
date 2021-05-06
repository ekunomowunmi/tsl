import { MapsAPILoader } from '@agm/core';
import { ThrowStmt } from '@angular/compiler';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { fromEvent, merge, Observable, Observer } from 'rxjs';
// import {map} from 'rxjs/operators';
import { AppService } from './app.service';
/// <reference types="@types/googlemaps" /

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'tsl';
  zoom = 8;
  center: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    zoomControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    maxZoom: 17,
    minZoom: 6,
  };
  marker: google.maps.Marker;
  markerLabel = {};
  latitude: number = 51.678418;
  longitude: number = 7.809007;
  map : google.maps.Map;
  infoWindow: google.maps.InfoWindow;
  markerOption: google.maps.MarkerOptions;
  customerName: string = 'Wisdom';
  carName:string = 'Toyota';
  carNumber:string = 'EKY697AH'
  drivername:string;

  private geocoder;

  isConnectionAvailable: boolean = navigator.onLine;
  justInit: boolean;
  @ViewChild("search") searchElementRef: ElementRef;
  @ViewChild("map") mapElementRef: ElementRef;

  addressDescription: string;
  state: any;
  area: any;
  currentLatitude: any;
  currentLongitude: any;
  startLatitude: any;
  startLongitude: any;
  destinationLatitude: number;
  destinationLongitude: number;
  currentPosName: any;
  dispatchedBy: any;
  durationtoDestination: string;
  destinationName: any;
  destinationCenter: google.maps.LatLngLiteral;
  startmarkerOption: google.maps.MarkerOptions;
  startCenter: google.maps.LatLngLiteral;
  currentmarkerOption: google.maps.MarkerOptions;
  startMarker: google.maps.Marker;
  currentMarker: google.maps.Marker;
  distance: string;
  destinationAddress: string;
  originAddress: string;
  pngUrl: any;
  destinationMarker: google.maps.Marker;
  totalDuration: string;
  driverEmail: string;

  // tsr: any[] = [];

  /**
   *
   */
  constructor(private appService: AppService,  private mapsAPILoader: MapsAPILoader, private ngzone: NgZone) {
    window.addEventListener('online', () => {
      this.isConnectionAvailable = true;
    });

    window.addEventListener('offline', () => {
      this.isConnectionAvailable = false;
    });
    // this.createOnline().subscribe(
    //   (isOnline) => {
    //     // console.debug(isOnline);
    //     // console.debug("isonline");
    //   }
    // );
    if (this.isConnectionAvailable === true) {
      this.marker = new google.maps.Marker({
        animation: google.maps.Animation.DROP,
        draggable: true,
        title: "Drag me!",
      });
    }
  }

  async getTimeSeries(){

    const tsr = await this.appService.getTimeSeries().toPromise();
    console.log(tsr);
    const currentcoord = tsr[0].current_asset_position_coord;
    const curLatLng = currentcoord.split(",");
    this.currentLatitude = +curLatLng[0];
    this.currentLongitude = +curLatLng[1];
    this.currentPosName = tsr[0].current_asset_position_name;
    this.dispatchedBy = tsr[0].dispatched_by;
    this.destinationName = tsr[0].destination_name;
    const startCoord = tsr[0].start_position_coord;
    const startLatiLongSplit = startCoord.split(",");
    this.startLatitude = +startLatiLongSplit[0];
    this.startLongitude = +startLatiLongSplit[1];
    let origin = {lat:this.startLatitude, lng:this.startLongitude};

    const destinationCoord = tsr[0].destination_coord;
    const destCoordSplit = destinationCoord.split(",");
    this.destinationLatitude = +destCoordSplit[0];
    this.destinationLongitude = +destCoordSplit[1];
    let destination = {lat:this.destinationLatitude, lng:this.destinationLongitude};
    this.driverEmail = tsr[0].dispatched_by;
    const getNameFromEmail = this.driverEmail.split("@",1);
    this.drivername = getNameFromEmail[0];
    let date = new Date();
    date.setTime(tsr[0].duration_to_destination);
    const hour = date.getHours();
    const minute = date.getMinutes();
    this.durationtoDestination = `${hour} \n hours,\n ${minute} \n minutes`;
    this.setCurrentMarker(this.currentLatitude,this.currentLongitude);
    this.setDestinationMarker(this.destinationLatitude,this.destinationLongitude);
    this.setStartMarker(this.startLatitude,this.startLongitude);
    this.getDistance(origin,destination);


    const minutes = (new Date().getTime() );
    console.log(this.durationtoDestination, minutes);

  }

  zoomIn() {
    if (this.zoom < this.options.maxZoom) {
      this.zoom++;
    }
  }

  zoomOut() {
    if (this.zoom > this.options.minZoom) {
      this.zoom--;
    }
  }
  mapClick(event: google.maps.MouseEvent) {
    this.center = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
  }

  ngOnInit(): void {
    this.markerLabel = { color: "#0fdfee", text: "Current Location" };
    this.getTimeSeries();

    // this.setCurrentLocation();
    // this.initMap();

  }

  setDestinationMarker(latitude, longitiude){
    this.markerLabel = { color: '#0fdfee', text: "My Location" };
    this.markerOption = {
      draggable: false,
      icon: '../assets/images/marker-blue.png'
    }
    this.destinationMarker = new google.maps.Marker({
        icon:{
          url:'../assets/images/marker-blue.png',
          scale:1
        },
        label:this.durationtoDestination
// icon: pngUrl,
    })

    this.destinationCenter = { lat: latitude, lng: longitiude };
    console.log(this.destinationCenter,this.markerOption)
  }

  setStartMarker(latitude,longitude){
    this.startmarkerOption = {
      draggable: false,
      icon: '../assets/images/green-circle.png'
    }
    this.startMarker = new google.maps.Marker({
      icon:{
        path:google.maps.SymbolPath.CIRCLE,
        fillColor:`#0000ff`,
        strokeColor:'green',
        scale:7,
      },
      draggable:false
    });

    this.startCenter = { lat: latitude, lng: longitude };

  }
  setCurrentMarker(latitude,longitude){
    this.currentmarkerOption = {
      draggable: false,
      icon: '../assets/images/3d-car-icon-9.jpeg',

    }
    var size = new google.maps.Size(100,70);
    this.currentMarker = new google.maps.Marker({
      icon:{
        url:'../assets/images/baseline_directions_car_black_24dp.png',
        scale:1,
        // size:size
      },
      draggable:false
    })

    this.center = { lat: latitude, lng: longitude };
    console.log(this.center,this.currentmarkerOption)
  }

  getDistance(origin, destination){
    let service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix({
      origins:[origin],
      destinations:[destination],
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.METRIC,
      avoidTolls:false,
      avoidHighways:false
    },(response,status)=>{
      this.destinationAddress = response.destinationAddresses[0];
      this.originAddress = response.originAddresses[0];
      this.distance = response.rows[0].elements[0].distance.text;
      this.totalDuration = response.rows[0].elements[0].duration.text;
      this.drawMinuteCircle(this.durationtoDestination)
      console.log(response,status)
    })
  }

  drawMinuteCircle(time){
    var canvas, context;

    canvas = document.createElement("canvas");
    canvas.width = 50;
    canvas.height = 30;
    var  x=1, y=1, width=45, height=15, radius=0,  stroke= true;
    context = canvas.getContext("2d");
    if (typeof stroke == "undefined" ) {
      stroke = true;
    }
    if (typeof radius == "undefined") {
      radius = 5;
    }
    context.beginPath();
    context.moveTo(x + radius, y);
    context.lineTo(x + width - radius, y);
    context.quadraticCurveTo(x + width, y, x + width, y + radius);
    context.lineTo(x + width, y + height - radius);
    context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    context.lineTo(x + radius, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - radius);
    context.lineTo(x, y + radius);
    context.quadraticCurveTo(x, y, x + radius, y);
    context.fillStyle = "blue";
    context.fill();
    context.closePath();
    if (stroke) {
      context.stroke();
    }
  context.lineWidth = 1;
  context.strokeStyle = "#ffffff";
  context.font="12px Arial";
  context.textAlign="center";
  context.fillStyle = "black";
  context.fillText(time,22,12);

  this.pngUrl = canvas.toDataURL("image/jpg");
  console.log(this.pngUrl)
  }

  // createOnline() {
  //   return merge<boolean>(
  //     fromEvent(window, 'offline').pipe(map(() => false)),
  //     fromEvent(window, 'online').pipe(map(() => true)),
  //     new Observable((sub: Observer<boolean>) => {
  //       sub.next(navigator.onLine);
  //       sub.complete();
  //     }));
  // }

  initMap() {
    this.justInit = true;
    // load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
        this.setCurrentLocation();


      this.geocoder = new google.maps.Geocoder();

      // const autocomplete = new google.maps.places.Autocomplete(
      //   this.searchElementRef.nativeElement,
      //   {}
      // );

      // autocomplete.addListener("place_changed", () => {
      //   this.ngzone.run(() => {
      //     // get the place result
      //     const place: google.maps.places.PlaceResult = autocomplete.getPlace();
      //     // verify result
      //     if (place.geometry === undefined || place.geometry === null) {
      //       return;
      //     }
      //     // set latitude, longitude and zoom
      //     this.center = {
      //       lat: place.geometry.location.lat(),
      //       lng: place.geometry.location.lng(),
      //     };
      //     // this.getAddress(this.restaurant.Position.Coordinates[1], this.restaurant.Position.Coordinates[0]);
      //     this.addressDescription = place.formatted_address;
      //     this.getAddress(this.center.lat, this.center.lng);
      //   });
      // });
    });
  }



  getAddress(latitude, longitude) {
    this.geocoder.geocode(
      { location: { lat: latitude, lng: longitude } },
      (results, status) => {
        if (status === "OK") {
          if (results[0]) {
            this.addressDescription = results[0].formatted_address;

            this.state = results[0].address_components[5].long_name;

            this.area = results[0].address_components[2].long_name;
            console.log(this.state, this.area, longitude,latitude)

          } else {
            window.alert("No results found");
          }
        } else {
          window.alert("Geocoder failed due to: " + status);
        }
      }
    );
  }

  setCurrentLocation2() {
    this.justInit = false;
    this.map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8,
    });
    this.infoWindow = new google.maps.InfoWindow();
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log('in here')
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        console.log(this.center);
        // this.zoom = 19;
        this.infoWindow.setPosition(this.center);
          this.infoWindow.setContent("Location found.");
          this.infoWindow.open(this.map);
          this.map.setCenter(this.center);
        // this.getAddress(this.center.lat, this.center.lng);
      },(error)=>{console.log(error)});
    }
  }

  setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        this.zoom = 19;
        this.getAddress(this.center.lat, this.center.lng);
      });
    }
  }
  markerDragEnd($event: google.maps.MouseEvent) {
    this.justInit = false;
    // console.debug($event);
    this.center = {
      lat: $event.latLng.lat(),
      lng: $event.latLng.lng(),
    };
    this.getAddress(this.center.lat, this.center.lng);
  }

  onChooseLocation(event){
    console.log(event);
    this.latitude = event.coords.lat;
    this.longitude = event.coords.lng;
  }

}
