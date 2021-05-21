import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ShippingI } from '../interfaces/shippingI';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SnackBarService } from '../core/services/snack-bar.service';

@Injectable({
  providedIn: 'root'
})
export class ShippingService {

  url = 'shipping'

  constructor(
    private geolocation: Geolocation,
    private http: HttpClient,
    private snackBarService: SnackBarService
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
  updatePosition(barCode: string): void {
    this.geolocation.getCurrentPosition({ enableHighAccuracy: true })
      .then(data => {
        this.updateOneOrAllShippingsPositions(data.coords.latitude, data.coords.longitude, barCode);

      }).catch(err => {
        console.log('Error getting position-', err);
      });
  }

  updateOneOrAllShippingsPositions(lat: number, lon: number, barCode?: string) {
    if (lat == null || lon == null) { return; }

    // Obtiene la direccion
    this.getCity(lat, lon).subscribe(
      (res: ShippingI) => {
        // Peticion a CyberNinja-BE para actualizar en envio
        if (barCode !== undefined) {
          this.http.post(this.url + '/' + barCode, {
            county: res.county,
            state: res.state,
            village: res.village,
            status: 'INTRANSIT'
          }).subscribe(
            () => this.snackBarService.popup(211),
            err => {
              console.log(JSON.stringify(err));
              this.snackBarService.popup(500);
            }
          );
        }
        // Actualiza todos los envios en camino
        else {
          this.http.put(this.url, {
            county: res.county,
            state: res.state,
            village: res.village,
            status: 'INTRANSIT'
          }).subscribe(
            () => this.snackBarService.popup(211),
            err => {
              console.log(JSON.stringify(err));
              this.snackBarService.popup(500);
            }
          );
        }
      },
      err => console.log(JSON.stringify(err))
    );
  }

  /**
   * Obtiene state, county y village
   * @param lat
   * @param lon
   */
  private getCity(lat: number, lon: number): Observable<any> {
    return this.http.get('https://nominatim.openstreetmap.org/reverse?lat=' + lat + '&lon=' + lon + '&format=json', { headers: { skip: 'true' } }).pipe(
      map(res => res['address'])
    );
  }

}
