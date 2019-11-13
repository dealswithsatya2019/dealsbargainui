import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductDetailsRouteInfoService {
  cname: string;
  scname: string;
  productId: string;
  constructor() { }
}
