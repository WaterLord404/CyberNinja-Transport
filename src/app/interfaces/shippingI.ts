import { CustomerI } from "./customerI";

export interface ShippingI {
  id?: number;
  uuid?: string;
  status?: string;
  village: string;
  county: string;
  state: string;
  customer: CustomerI;
}
