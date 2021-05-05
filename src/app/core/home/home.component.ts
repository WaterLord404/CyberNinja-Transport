import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { LocationI } from '../interfaces/locationI';
import { GeolocationService } from '../services/geolocation.service';
import { ShippingService } from '../services/shipping.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  constructor(
    private barcodeScanner: BarcodeScanner,
    private shippingService: ShippingService,
    private geolocation: GeolocationService
  ) { }

  ngOnInit() { }

  /**
   * Escanea el codigo QR y envia la información donde se encuentra el transportista
   */
  scannerQR(): void {
    this.barcodeScanner.scan().then(barcodeData => {

      this.geolocation.getPosition();
      this.shippingService.updateOrderLocation(barcodeData.text, this.geolocation.getLocation());

    }).catch(err => {
      console.log('Error barcode', err);
    });
  }
}
