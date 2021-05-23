import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ShippingI } from 'src/app/interfaces/shippingI';
import { ShippingService } from 'src/app/services/shipping.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-order-dialog',
  templateUrl: './shipping-dialog.component.html',
  styleUrls: ['./shipping-dialog.component.scss']
})
export class ShippingDialogComponent implements OnInit {

  shipping: ShippingI;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private shippingService: ShippingService,
    private geolocation: Geolocation
  ) {
    this.shipping = data;
  }

  ngOnInit(): void {
  }

  /**
   * Confirma la entrega del envio
   */
  deliver(): void {
    this.geolocation.getCurrentPosition({ enableHighAccuracy: true })
    .then(data => {
      this.shippingService.updateOneOrAllShippingsPositions(data.coords.latitude, data.coords.longitude, false, this.shipping.uuid, this.shipping);

    }).catch(err => {
      console.log('Error getting position-', err);
    });
  }
}
