import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ShippingI } from 'src/app/interfaces/shippingI';
import { ShippingService } from 'src/app/services/shipping.service';
import { ShippingDialogComponent } from '../shipping-dialog/shipping-dialog.component';

@Component({
  selector: 'app-shippings',
  templateUrl: './shippings.component.html',
  styleUrls: ['./shippings.component.scss']
})
export class ShippingsComponent implements OnInit {

  shippings: Array<ShippingI> = [];

  constructor(
    private shippingService: ShippingService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.shippingService.getShippings().subscribe(
      res => this.shippings = res,
      () => { }
    );
  }

  openDialog(shipping: ShippingI): void {
    this.dialog.open(ShippingDialogComponent, {
      width: '100%',
      height: 'auto',
      data: shipping
    });
  }
}
