import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ShippingI } from '../interfaces/shippingI';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SnackBarService } from '../core/services/snack-bar.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class ShippingService {

  url = 'shipping'
  status: string;
  county: string;
  state: string;
  village: string;

  constructor(
    private geolocation: Geolocation,
    private http: HttpClient,
    private snackBarService: SnackBarService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  getShippings(): Observable<any> {
    return this.http.get(this.url);
  }

  /**
   * Actualiza la ubicacion de todos los productos del transportista cada 30 minutos
   */
  syncPosition(): void {
    let geolocation: Geolocation = new Geolocation();

    geolocation.getCurrentPosition({ enableHighAccuracy: true })
      .then(data => {
        this.updateOneOrAllShippingsPositions(data.coords.latitude, data.coords.longitude, false);
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
  updatePosition(qrUUID: string): void {
    this.geolocation.getCurrentPosition({ enableHighAccuracy: true })
      .then(data => {
        this.updateOneOrAllShippingsPositions(data.coords.latitude, data.coords.longitude, true, qrUUID);

      }).catch(err => {
        console.log('Error getting position-', err);
      });
  }

  updateOneOrAllShippingsPositions(lat: number, lon: number, newShipping: boolean, qrUUID?: string, shipping?: ShippingI) {
    if (lat == null || lon == null) { return; }

    // Obtiene la direccion
    this.getCity(lat, lon).subscribe(
      (res: ShippingI) => {

        if (shipping != null) {
          this.status = 'DELIVERED'
          this.county = shipping.customer.county;
          this.state = shipping.customer.state;
          this.village = shipping.customer.village;
        } else {
          this.status = 'INTRANSIT'
          this.county = res.county;
          this.state = res.state;
          this.village = res.village;
        }

        // Peticion a CyberNinja-BE para actualizar en envio
        if (qrUUID !== undefined) {
          this.http.put(this.url + '/' + qrUUID + '?newShipping=' + newShipping, {
            county: this.county,
            state: this.state,
            village: this.village,
            status: this.status
          }).subscribe(
            () => {
              if (shipping != null) {
                this.dialog.closeAll();
                this.snackBarService.popup(212)
                this.router.navigate(['/'])
              } else {
                this.snackBarService.popup(211)
              }
            },
            err => {
              console.log(JSON.stringify(err));
              switch (err.status) {
                case 409:
                  this.snackBarService.popup(409);
                  break;
                case 404:
                  this.snackBarService.popup(404);
                  break;
                default:
                  this.snackBarService.popup(500);
                  break;
              }
            }
          );
        }
        // Actualiza todos los envios en camino
        else {
          this.http.put(this.url, {
            county: res.county,
            state: res.state,
            village: res.village
          }).subscribe(
            () => { },
            err => {
              console.log(JSON.stringify(err));
              this.snackBarService.popup(501);
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
