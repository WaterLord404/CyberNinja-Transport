import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ShippingService } from '../../services/shipping.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  constructor(
    private barcodeScanner: BarcodeScanner,
    private shippingService: ShippingService,
    protected router: Router
  ) { }

  ngOnInit() {
    this.shippingService.syncPosition();
  }

  /**
   * Escanea el codigo QR y envia la información donde se encuentra el transportista
   */
  scannerQR(): void {
    this.barcodeScanner.scan().then(qrUUID => {

      this.shippingService.updatePosition(qrUUID.text);

    }).catch(err => {
      console.log('Error barcode', err);
    });
  }
}
