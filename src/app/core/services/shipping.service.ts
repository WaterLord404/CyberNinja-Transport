import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ShippingI } from '../interfaces/shippingI';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ShippingService {

  cyberNinjaURL = 'http://localhost:8080/shipping'

  constructor(
    private geolocation: Geolocation,
    private http: HttpClient,
  ) { }

  /**
   * Actualiza la ubicacion de todos los productos del transportista cada 30 minutos
   */
  syncPosition(): void {
    let geolocation: Geolocation = new Geolocation();

    geolocation.getCurrentPosition({ enableHighAccuracy: true })
      .then(data => {
        this.updateOneOrAllShippingsPositions(data.coords.latitude, data.coords.longitude);
      }).catch(err => {
        console.log('Error getting location-', err);
      });

    setTimeout(() => {
      this.syncPosition()
    }, 1800000);
  }

  /**
   * Obtiene la posicion Lat y Long
   */
  updatePosition(url: string): void {
    this.geolocation.getCurrentPosition({ enableHighAccuracy: true })
      .then(data => {
        this.updateOneOrAllShippingsPositions(data.coords.latitude, data.coords.longitude, url);

      }).catch(err => {
        console.log('Error getting location-', err);
      });
  }

  updateOneOrAllShippingsPositions(lat: number, lon: number, url?: string) {
    if (lat == null || lon == null) { return; }

    // Obtiene la direccion
    this.getCity(lat, lon).subscribe(
      (res: ShippingI) => {
        // Peticion a CyberNinja-BE para actualizar en envio
        if (url !== undefined) {
          this.http.post(url, {
            county: res.county,
            state: res.state,
            village: res.village,
            status: 'INTRANSIT'
          });
        }
        // Actualiza todos los envios en camino
        else {
          this.http.put(this.cyberNinjaURL, {
            county: res.county,
            state: res.state,
            village: res.village,
            status: 'INTRANSIT'
          });
        }
      },
      err => console.log(err)
    );
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

}
