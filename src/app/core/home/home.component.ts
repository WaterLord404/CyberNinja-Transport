import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ShippingService } from '../services/shipping.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  lat: number;
  lon: number;

  constructor(
    private barcodeScanner: BarcodeScanner,
    private shippingService: ShippingService
  ) { }

  ngOnInit() {
    this.shippingService.syncPosition();
  }

  /**
   * Escanea el codigo QR y envia la información donde se encuentra el transportista
   */
  scannerQR(): void {
    this.barcodeScanner.scan().then(barcodeData => {

      this.shippingService.updatePosition(barcodeData.text);

    }).catch(err => {
      console.log('Error barcode', err);
    });
  }
}
