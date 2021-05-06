import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http"

@Injectable({
  providedIn: 'root'
})
export class AppService {
  api_key = '569d44cbeaf04b2da798548564c40ec1'

  constructor(private http:HttpClient ) { }

  getTimeSeries(trackingId){
     return this.http.get(`https://cco-telematics-apis.azure-api.net/dev/tele/status/${trackingId}?api_key=${this.api_key}`)
  }
}


// import { HttpClient } from "@angular/common/http";
// import { Injectable } from "@angular/core";
// import { BaseModel } from "../models/base-model";
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: "root",
// })
// export class ServerService {
//   getWithParams(toLocationCode: string, searchItemIds: string, UPSTREAM_PRODUCTS: string) {
//     throw new Error('Method not implemented.');
//   }
//   serverURL = "http://localhost:3009/api/";
//   isProd = false;
//   constructor(private http: HttpClient) {}
//   getBaseURL(upstream = false) {
//     if (upstream) {
//       return !this.isProd
//         ? "https://yuvendstaging.endearng.net/api/"
//         : "https://yuvend.endearng.net/api/";
//     } else {
//       return this.serverURL;
//     }
//   }
//   get(url: string, upstream = false) {

//     const URL = this.getBaseURL(upstream) + `${url}`;

//     return this.http.get<Array<BaseModel>>(URL);
//   }

//   getWithParam(locationId, itemId, url: string, upstream = false) {
//     const URL = this.getBaseURL(upstream) + url + `?condition={"locationId":"${locationId}", "item_Id":"${itemId}"}`;
//     return this.http.get(URL);
//   }

//   post(url: string, body: any, upstream = false) {
//     console.log(this.getBaseURL(upstream) + url);
//     return this.http.post(this.getBaseURL(upstream) + url, body);
//   }
//   put(url: string, body: any, upstream = false) {
//     return this.http.put(this.getBaseURL(upstream) + url, body);
//   }

//   delete(url: string, upstream = false): Observable<any> {
//     console.log('Delete Url: ', this.getBaseURL(upstream) + url);
//     return this.http.delete(this.getBaseURL(upstream) + url);
//   }
// }
