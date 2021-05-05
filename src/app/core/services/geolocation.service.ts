import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Observable } from 'rxjs';
import { LocationI } from '../interfaces/locationI';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  location: LocationI;

  constructor(
    private geolocation: Geolocation,
    private http: HttpClient
  ) { }

  /**
   * Obtiene la posicion Lat y Long
   */
  getPosition(): void {
    this.geolocation.getCurrentPosition({
      enableHighAccuracy: true
    }).then(data => {

      // Obtiene la direccion
      this.getCity(data.coords.latitude, data.coords.longitude).subscribe(
        (res: LocationI) => {
          this.location = {
            county: res.county,
            state: res.state,
            village: res.village
          }
        },
        err => console.log(err)
      );

    }).catch(err => {
      console.log('Error getting location', err);
    });
  }

  /**
   * Obtiene state, county y village
   * @param lat
   * @param lon
   */
  private getCity(lat: number, lon: number): Observable<any> {
    return this.http.get('https://nominatim.openstreetmap.org/reverse?lat=' + lat + '&lon=' + lon + '&format=json').pipe(
      map(res => res['address'])
    );
  }

  getLocation(): LocationI {
    return this.location;
  }
}
