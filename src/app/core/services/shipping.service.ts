import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocationI } from '../interfaces/locationI';

@Injectable({
  providedIn: 'root'
})
export class ShippingService {

  constructor(private http: HttpClient) { }

  updateOrderLocation(url: string, location: LocationI): void {

  }
}
